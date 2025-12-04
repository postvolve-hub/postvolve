import { NextRequest, NextResponse } from "next/server";
import { stripe, PLAN_CONFIG } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabaseServer";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { planId, userId } = body;

    if (!planId || !userId) {
      return NextResponse.json(
        { error: "Missing planId or userId" },
        { status: 400 }
      );
    }

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
      .select("email")
      .eq("id", userId)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Get or create Stripe customer
    const { data: subscription } = await supabaseAdmin
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", userId)
      .single();

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
      success_url: `${appUrl}/dashboard/billing?success=true`,
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

