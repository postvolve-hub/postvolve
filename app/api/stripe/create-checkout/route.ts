import { NextRequest, NextResponse } from "next/server";
import { stripe, PLAN_CONFIG } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabaseServer";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { planId, userId } = body;

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

    // Get existing subscription
    const { data: subscription, error: subError } = await supabaseAdmin
      .from("subscriptions")
      .select("stripe_customer_id, plan_type, stripe_subscription_id")
      .eq("user_id", userId)
      .single();

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

    // Check if user is already on this plan
    if (subscription && subscription.plan_type === planId) {
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
        
        // If subscription is active and user is trying to upgrade/downgrade
        if (existingSubscription.status === "active") {
          // For upgrades/downgrades, we should use subscription update, not new checkout
          // But for now, we'll allow it and handle in webhook
        }
      } catch (error) {
        // Subscription might not exist in Stripe, continue with checkout
        console.warn("Could not retrieve existing subscription from Stripe:", error);
      }
    }

    let customerId = subscription?.stripe_customer_id;

    if (!customerId) {
      // Create Stripe customer
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

