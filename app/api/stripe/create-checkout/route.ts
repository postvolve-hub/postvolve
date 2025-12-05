import { NextRequest, NextResponse } from "next/server";
import { stripe, PLAN_CONFIG } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabaseServer";

// In-memory cache for request deduplication (prevents race conditions)
// In production, consider using Redis or similar
const pendingCheckouts = new Map<string, Promise<NextResponse>>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { planId, userId } = body;

    // Create a unique key for this request (userId + planId + timestamp within 5 seconds)
    // This prevents duplicate requests within a short window
    const requestKey = `${userId}-${planId}-${Math.floor(Date.now() / 5000)}`;
    
    // Check if there's already a pending request for this user+plan
    if (pendingCheckouts.has(requestKey)) {
      console.log(`Duplicate checkout request detected for ${requestKey}, returning existing promise`);
      return await pendingCheckouts.get(requestKey)!;
    }

    // Create the checkout promise
    const checkoutPromise = createCheckoutSession(planId, userId);
    
    // Store it in cache
    pendingCheckouts.set(requestKey, checkoutPromise);
    
    // Remove from cache after 10 seconds (request should complete by then)
    setTimeout(() => {
      pendingCheckouts.delete(requestKey);
    }, 10000);

    return await checkoutPromise;
  } catch (error: any) {
    console.error("Error in checkout route:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create checkout session" },
      { status: 500 }
    );
  }
}

async function createCheckoutSession(planId: string, userId: string) {
  try {

    // Validation
    if (!planId || !userId) {
      return NextResponse.json(
        { error: "Missing planId or userId" },
        { status: 400 }
      );
    }

    // Validate plan ID
    const plan = PLAN_CONFIG[planId as keyof typeof PLAN_CONFIG];
    if (!plan) {
      return NextResponse.json(
        { error: "Invalid plan ID" },
        { status: 400 }
      );
    }

    if (!plan.priceId) {
      return NextResponse.json(
        { error: `Stripe price ID not configured for ${planId} plan` },
        { status: 500 }
      );
    }

    // Get user email from database
    const { data: user, error: userError } = await supabaseAdmin
      .from("users")
      .select("email, onboarding_completed")
      .eq("id", userId)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check if user has completed onboarding
    if (!user.onboarding_completed) {
      return NextResponse.json(
        { error: "Please complete onboarding before subscribing" },
        { status: 400 }
      );
    }

    // Get existing subscription (use maybeSingle to handle no subscription case)
    const { data: subscription, error: subError } = await supabaseAdmin
      .from("subscriptions")
      .select("stripe_customer_id, plan_type, stripe_subscription_id")
      .eq("user_id", userId)
      .maybeSingle();

    // Handle subscription query errors
    // PGRST116 = no rows found (user has no subscription yet) - this is fine
    // Any other error is a real database error that should be handled
    if (subError && subError.code !== "PGRST116") {
      console.error("Error fetching subscription:", subError);
      return NextResponse.json(
        { error: "Failed to check existing subscription" },
        { status: 500 }
      );
    }

    // Check if user is already on this plan AND has an active Stripe subscription
    // Allow checkout if they have a placeholder subscription (no stripe_subscription_id)
    if (subscription && subscription.plan_type === planId && subscription.stripe_subscription_id) {
      return NextResponse.json(
        { error: `You are already on the ${plan.name} plan` },
        { status: 400 }
      );
    }

    // Check if user has an active Stripe subscription
    if (subscription?.stripe_subscription_id) {
      try {
        const existingSubscription = await stripe.subscriptions.retrieve(
          subscription.stripe_subscription_id
        );
        
        // If subscription is active/trialing, block new checkout - user should use subscription update
        if (existingSubscription.status === "active" || existingSubscription.status === "trialing") {
          return NextResponse.json(
            { error: "You already have an active subscription. Please use the billing page to change your plan." },
            { status: 400 }
          );
        }
      } catch (error) {
        // Subscription might not exist in Stripe, continue with checkout
        console.warn("Could not retrieve existing subscription from Stripe:", error);
      }
    }

    let customerId = subscription?.stripe_customer_id;

    if (!customerId) {
      // Check if customer already exists in Stripe by email (prevent duplicates)
      try {
        const existingCustomers = await stripe.customers.list({
          email: user.email,
          limit: 1,
        });
        
        if (existingCustomers.data.length > 0) {
          // Customer already exists, use it
          customerId = existingCustomers.data[0].id;
          
          // Update subscription with customer ID
          await supabaseAdmin
            .from("subscriptions")
            .update({ stripe_customer_id: customerId })
            .eq("user_id", userId);
        } else {
          // Create new Stripe customer
          const customer = await stripe.customers.create({
            email: user.email,
            metadata: {
              userId: userId,
            },
          });
          customerId = customer.id;

          // Update subscription with customer ID
          await supabaseAdmin
            .from("subscriptions")
            .update({ stripe_customer_id: customerId })
            .eq("user_id", userId);
        }
      } catch (error) {
        console.error("Error checking/creating Stripe customer:", error);
        return NextResponse.json(
          { error: "Failed to set up payment method. Please try again." },
          { status: 500 }
        );
      }
    }

    // Get app URL for redirects
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price: plan.priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${appUrl}/dashboard/billing?success=true&plan=${planId}`,
      cancel_url: `${appUrl}/dashboard/billing?canceled=true`,
      metadata: {
        userId: userId,
        planId: planId,
      },
      subscription_data: {
        metadata: {
          userId: userId,
          planId: planId,
        },
        // Enable 7-day free trial only for Starter plan
        ...(planId === "starter" && { trial_period_days: 7 }),
      },
      // Allow promotion codes
      allow_promotion_codes: true,
      // Collect billing address
      billing_address_collection: "required",
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create checkout session" },
      { status: 500 }
    );
  }
}

