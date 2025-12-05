import { NextRequest, NextResponse } from "next/server";
import { stripe, PLAN_CONFIG } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabaseServer";
import Stripe from "stripe";

const getWebhookSecret = () => {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error("STRIPE_WEBHOOK_SECRET is not set");
  }
  return secret;
};

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, getWebhookSecret());
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case "customer.subscription.created": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionCreated(subscription);
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaid(invoice);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentFailed(invoice);
        break;
      }

      case "customer.subscription.trial_will_end": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleTrialWillEnd(subscription);
        break;
      }

      case "invoice.payment_action_required": {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentActionRequired(invoice);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  const planId = session.metadata?.planId;

  if (!userId || !planId) {
    console.error("Missing userId or planId in checkout session metadata");
    return;
  }

  const subscriptionId = typeof session.subscription === "string" 
    ? session.subscription 
    : session.subscription?.id || "";
  const customerId = typeof session.customer === "string"
    ? session.customer
    : session.customer?.id || "";

  if (!subscriptionId) {
    console.error("No subscription ID in checkout session");
    return;
  }

  // Get subscription details from Stripe
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const plan = PLAN_CONFIG[planId as keyof typeof PLAN_CONFIG];

  if (!plan) {
    console.error(`Invalid plan ID: ${planId}`);
    return;
  }

  // Extract subscription properties from Stripe subscription object
  // Stripe returns these as Unix timestamps (numbers)
  // Access properties directly - they exist on the subscription object
  const periodStart = (subscription as any).current_period_start;
  const periodEnd = (subscription as any).current_period_end;
  const cancelAtPeriodEnd = (subscription as any).cancel_at_period_end ?? false;
  const trialStart = (subscription as any).trial_start;
  const trialEnd = (subscription as any).trial_end;
  const subscriptionStatus = subscription.status;
  
  // Log for debugging - check what we're getting from Stripe
  console.log("Checkout completed - Raw subscription object:", JSON.stringify({
    subscriptionId,
    status: subscriptionStatus,
    hasCurrentPeriodStart: periodStart !== undefined && periodStart !== null,
    hasCurrentPeriodEnd: periodEnd !== undefined && periodEnd !== null,
    hasTrialStart: trialStart !== undefined && trialStart !== null,
    hasTrialEnd: trialEnd !== undefined && trialEnd !== null,
    periodStartValue: periodStart,
    periodEndValue: periodEnd,
    trialStartValue: trialStart,
    trialEndValue: trialEnd,
    subscriptionKeys: Object.keys(subscription),
  }, null, 2));

  // Map Stripe status to our database status
  let dbStatus: "active" | "canceled" | "past_due" | "trialing" | "paused" = "active";
  if (subscriptionStatus === "active") dbStatus = "active";
  else if (subscriptionStatus === "trialing") dbStatus = "trialing";
  else if (subscriptionStatus === "past_due") dbStatus = "past_due";
  else if (subscriptionStatus === "canceled" || subscriptionStatus === "unpaid") dbStatus = "canceled";
  else if (subscriptionStatus === "paused") dbStatus = "paused";

  // Check if subscription exists, if not create it (edge case)
  const { data: existingSub } = await supabaseAdmin
    .from("subscriptions")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();

  if (existingSub) {
    // Update existing subscription (including placeholder subscriptions)
    await supabaseAdmin
      .from("subscriptions")
      .update({
        plan_type: planId as any,
        status: dbStatus,
        stripe_subscription_id: subscriptionId,
        stripe_customer_id: customerId,
        posts_per_day: plan.features.postsPerDay,
        social_accounts_limit: plan.features.socialAccountsLimit,
        categories_limit: plan.features.categoriesLimit,
        current_period_start: periodStart !== undefined && periodStart !== null
          ? new Date(periodStart * 1000).toISOString()
          : null,
        current_period_end: periodEnd !== undefined && periodEnd !== null
          ? new Date(periodEnd * 1000).toISOString()
          : null,
        trial_start: trialStart !== undefined && trialStart !== null
          ? new Date(trialStart * 1000).toISOString()
          : null,
        trial_end: trialEnd !== undefined && trialEnd !== null
          ? new Date(trialEnd * 1000).toISOString()
          : null,
        cancel_at_period_end: cancelAtPeriodEnd || false,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId);
  } else {
    // Edge case: subscription doesn't exist, create it
    console.warn(`Subscription not found for user ${userId}, creating new subscription`);
    await supabaseAdmin
      .from("subscriptions")
      .insert({
        user_id: userId,
        plan_type: planId as any,
        status: dbStatus,
        stripe_subscription_id: subscriptionId,
        stripe_customer_id: customerId,
        posts_per_day: plan.features.postsPerDay,
        social_accounts_limit: plan.features.socialAccountsLimit,
        categories_limit: plan.features.categoriesLimit,
        current_period_start: periodStart !== undefined && periodStart !== null
          ? new Date(periodStart * 1000).toISOString()
          : null,
        current_period_end: periodEnd !== undefined && periodEnd !== null
          ? new Date(periodEnd * 1000).toISOString()
          : null,
        trial_start: trialStart !== undefined && trialStart !== null
          ? new Date(trialStart * 1000).toISOString()
          : null,
        trial_end: trialEnd !== undefined && trialEnd !== null
          ? new Date(trialEnd * 1000).toISOString()
          : null,
        cancel_at_period_end: cancelAtPeriodEnd || false,
      } as any);
  }

  // Log activity
  await supabaseAdmin.from("activity_log").insert({
    user_id: userId,
    activity_type: "subscription_upgraded",
    metadata: { plan_id: planId },
  } as any);
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  // This event fires when a subscription is first created
  // It contains the full subscription object with all dates
  // We'll use the same logic as handleSubscriptionUpdated
  let userId = subscription.metadata?.userId;
  let planId = subscription.metadata?.planId;

  // Map Stripe status to our database status
  let dbStatus: "active" | "canceled" | "past_due" | "trialing" | "paused" = "active";
  if (subscription.status === "active") dbStatus = "active";
  else if (subscription.status === "trialing") dbStatus = "trialing";
  else if (subscription.status === "past_due") dbStatus = "past_due";
  else if (subscription.status === "canceled" || subscription.status === "unpaid") dbStatus = "canceled";
  else if (subscription.status === "paused") dbStatus = "paused";

  // Extract subscription properties from Stripe subscription object
  const periodStart = (subscription as any).current_period_start;
  const periodEnd = (subscription as any).current_period_end;
  const cancelAtPeriodEnd = (subscription as any).cancel_at_period_end ?? false;
  const trialStart = (subscription as any).trial_start;
  const trialEnd = (subscription as any).trial_end;
  
  // Log for debugging
  console.log("Subscription created - Raw subscription object:", JSON.stringify({
    subscriptionId: subscription.id,
    status: subscription.status,
    hasCurrentPeriodStart: periodStart !== undefined && periodStart !== null,
    hasCurrentPeriodEnd: periodEnd !== undefined && periodEnd !== null,
    hasTrialStart: trialStart !== undefined && trialStart !== null,
    hasTrialEnd: trialEnd !== undefined && trialEnd !== null,
    periodStartValue: periodStart,
    periodEndValue: periodEnd,
    trialStartValue: trialStart,
    trialEndValue: trialEnd,
  }, null, 2));

  if (!userId || !planId) {
    // Try to get from database
    const { data: sub } = await supabaseAdmin
      .from("subscriptions")
      .select("user_id, plan_type")
      .eq("stripe_subscription_id", subscription.id)
      .single();

    if (!sub) {
      console.error("Subscription created but not found in database:", subscription.id);
      return;
    }

    userId = sub.user_id;
    planId = sub.plan_type;
  }

  const plan = PLAN_CONFIG[planId as keyof typeof PLAN_CONFIG];
  if (!plan) {
    console.error(`Invalid plan ID: ${planId}`);
    return;
  }

  // Update subscription in database with all dates
  await supabaseAdmin
    .from("subscriptions")
    .update({
      plan_type: planId as any,
      status: dbStatus,
      stripe_subscription_id: subscription.id,
      stripe_customer_id: typeof subscription.customer === "string" 
        ? subscription.customer 
        : subscription.customer?.id || null,
      posts_per_day: plan.features.postsPerDay,
      social_accounts_limit: plan.features.socialAccountsLimit,
      categories_limit: plan.features.categoriesLimit,
      current_period_start: periodStart !== undefined && periodStart !== null
        ? new Date(periodStart * 1000).toISOString()
        : null,
      current_period_end: periodEnd !== undefined && periodEnd !== null
        ? new Date(periodEnd * 1000).toISOString()
        : null,
      trial_start: trialStart !== undefined && trialStart !== null
        ? new Date(trialStart * 1000).toISOString()
        : null,
      trial_end: trialEnd !== undefined && trialEnd !== null
        ? new Date(trialEnd * 1000).toISOString()
        : null,
      cancel_at_period_end: cancelAtPeriodEnd || false,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId);

  // Log activity
  await supabaseAdmin.from("activity_log").insert({
    user_id: userId,
    activity_type: "subscription_upgraded",
    description: `Subscription created: ${plan.name} plan`,
    metadata: { plan_id: planId, subscription_id: subscription.id },
  } as any);
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId;
  const planId = subscription.metadata?.planId;

  // Map Stripe status to our database status
  let dbStatus: "active" | "canceled" | "past_due" | "trialing" | "paused" = "active";
  if (subscription.status === "active") dbStatus = "active";
  else if (subscription.status === "trialing") dbStatus = "trialing";
  else if (subscription.status === "past_due") dbStatus = "past_due";
  else if (subscription.status === "canceled" || subscription.status === "unpaid") dbStatus = "canceled";
  else if (subscription.status === "paused") dbStatus = "paused";

  // Extract subscription properties from Stripe subscription object
  // Stripe returns these as Unix timestamps (numbers)
  // Access properties directly - they exist on the subscription object
  const periodStart = (subscription as any).current_period_start;
  const periodEnd = (subscription as any).current_period_end;
  const cancelAtPeriodEnd = (subscription as any).cancel_at_period_end ?? false;
  const trialStart = (subscription as any).trial_start;
  const trialEnd = (subscription as any).trial_end;
  
  // Log for debugging - check what we're getting from Stripe
  console.log("Subscription updated - Raw subscription object:", JSON.stringify({
    subscriptionId: subscription.id,
    status: subscription.status,
    hasCurrentPeriodStart: periodStart !== undefined && periodStart !== null,
    hasCurrentPeriodEnd: periodEnd !== undefined && periodEnd !== null,
    hasTrialStart: trialStart !== undefined && trialStart !== null,
    hasTrialEnd: trialEnd !== undefined && trialEnd !== null,
    periodStartValue: periodStart,
    periodEndValue: periodEnd,
    trialStartValue: trialStart,
    trialEndValue: trialEnd,
  }, null, 2));

  if (!userId || !planId) {
    // Try to get from database
    const { data: sub } = await supabaseAdmin
      .from("subscriptions")
      .select("user_id, plan_type")
      .eq("stripe_subscription_id", subscription.id)
      .single();

    if (!sub) return;

    const plan = PLAN_CONFIG[sub.plan_type as keyof typeof PLAN_CONFIG];
    if (!plan) return;

    await supabaseAdmin
      .from("subscriptions")
      .update({
        status: dbStatus,
        current_period_start: periodStart !== undefined && periodStart !== null
          ? new Date(periodStart * 1000).toISOString()
          : null,
        current_period_end: periodEnd !== undefined && periodEnd !== null
          ? new Date(periodEnd * 1000).toISOString()
          : null,
        trial_start: trialStart !== undefined && trialStart !== null
          ? new Date(trialStart * 1000).toISOString()
          : null,
        trial_end: trialEnd !== undefined && trialEnd !== null
          ? new Date(trialEnd * 1000).toISOString()
          : null,
        cancel_at_period_end: cancelAtPeriodEnd || false,
        updated_at: new Date().toISOString(),
      })
      .eq("stripe_subscription_id", subscription.id);

    return;
  }

  const plan = PLAN_CONFIG[planId as keyof typeof PLAN_CONFIG];
  if (!plan) return;

  await supabaseAdmin
    .from("subscriptions")
    .update({
      plan_type: planId as any,
      status: dbStatus,
      posts_per_day: plan.features.postsPerDay,
      social_accounts_limit: plan.features.socialAccountsLimit,
      categories_limit: plan.features.categoriesLimit,
      current_period_start: periodStart
        ? new Date(periodStart * 1000).toISOString()
        : null,
      current_period_end: periodEnd
        ? new Date(periodEnd * 1000).toISOString()
        : null,
      trial_start: trialStart ? new Date(trialStart * 1000).toISOString() : null,
      trial_end: trialEnd ? new Date(trialEnd * 1000).toISOString() : null,
      cancel_at_period_end: cancelAtPeriodEnd || false,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  await supabaseAdmin
    .from("subscriptions")
    .update({
      status: "canceled",
      canceled_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_subscription_id", subscription.id);

  const { data: sub } = await supabaseAdmin
    .from("subscriptions")
    .select("user_id")
    .eq("stripe_subscription_id", subscription.id)
    .single();

  if (sub) {
    await supabaseAdmin.from("activity_log").insert({
      user_id: sub.user_id,
      activity_type: "subscription_canceled",
    } as any);
  }
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  const subscriptionId = typeof (invoice as any).subscription === "string"
    ? (invoice as any).subscription
    : (invoice as any).subscription?.id || null;
  if (!subscriptionId) return;

  const { data: sub } = await supabaseAdmin
    .from("subscriptions")
    .select("user_id, id")
    .eq("stripe_subscription_id", subscriptionId)
    .single();

  if (!sub) return;

  // Generate invoice number from Stripe invoice ID
  const invoiceNumber = `INV-${invoice.number || invoice.id.slice(-12).toUpperCase()}`;

  // Extract payment intent ID safely (may not be in TypeScript types)
  const paymentIntentId = (invoice as any).payment_intent 
    ? (typeof (invoice as any).payment_intent === "string" 
        ? (invoice as any).payment_intent 
        : (invoice as any).payment_intent?.id || null)
    : null;

  // Create invoice record matching database schema
  await supabaseAdmin.from("invoices").insert({
    user_id: sub.user_id,
    subscription_id: sub.id,
    invoice_number: invoiceNumber,
    amount_cents: invoice.amount_paid || invoice.amount_due || 0,
    currency: invoice.currency || "USD",
    status: "paid",
    stripe_invoice_id: invoice.id,
    stripe_payment_intent_id: paymentIntentId,
    hosted_invoice_url: invoice.hosted_invoice_url,
    invoice_pdf_url: invoice.invoice_pdf,
    invoice_date: invoice.created ? new Date(invoice.created * 1000).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
    due_date: invoice.due_date ? new Date(invoice.due_date * 1000).toISOString().split("T")[0] : null,
    paid_at: new Date().toISOString(),
    created_at: new Date(invoice.created * 1000).toISOString(),
  } as any);

  // Log activity
  await supabaseAdmin.from("activity_log").insert({
    user_id: sub.user_id,
    activity_type: "invoice_paid",
    description: `Invoice ${invoiceNumber} paid.`,
    metadata: { invoice_id: invoice.id, amount: invoice.amount_paid },
  } as any);
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const subscriptionId = typeof (invoice as any).subscription === "string"
    ? (invoice as any).subscription
    : (invoice as any).subscription?.id || null;
  if (!subscriptionId) return;

  // Get subscription to check retry count and determine if this is final failure
  const { data: sub } = await supabaseAdmin
    .from("subscriptions")
    .select("user_id, status")
    .eq("stripe_subscription_id", subscriptionId)
    .single();

  if (!sub) return;

  // Check if this is the final retry failure (Stripe will cancel after all retries)
  // We'll check the invoice attempt_count to see if this is likely the final attempt
  const attemptCount = (invoice as any).attempt_count || 0;
  const maxRetries = 3; // Stripe's default

  // If this is the final retry and it failed, subscription will be canceled by Stripe
  // We'll set to past_due for now, and Stripe will send customer.subscription.deleted if it's truly canceled
  const status = attemptCount >= maxRetries ? "past_due" : "past_due";

  await supabaseAdmin
    .from("subscriptions")
    .update({
      status: status,
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_subscription_id", subscriptionId);

  // Log activity
  await supabaseAdmin.from("activity_log").insert({
    user_id: sub.user_id,
    activity_type: "payment_failed",
    description: `Payment failed (attempt ${attemptCount + 1}). Update payment method to restore access.`,
    metadata: {
      invoice_id: invoice.id,
      attempt_count: attemptCount + 1,
      amount: invoice.amount_due,
    },
  } as any);
}

async function handleTrialWillEnd(subscription: Stripe.Subscription) {
  const { data: sub } = await supabaseAdmin
    .from("subscriptions")
    .select("user_id")
    .eq("stripe_subscription_id", subscription.id)
    .single();

  if (!sub) return;

  const trialEnd = (subscription as any).trial_end;
  const trialEndDate = trialEnd ? new Date(trialEnd * 1000) : null;

  // Update trial_end in database
  await supabaseAdmin
    .from("subscriptions")
    .update({
      trial_end: trialEndDate ? trialEndDate.toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_subscription_id", subscription.id);

  // Log activity for trial ending reminder
  await supabaseAdmin.from("activity_log").insert({
    user_id: sub.user_id,
    activity_type: "trial_ending_soon",
    description: `Trial ending soon. Add payment method to continue.`,
    metadata: {
      trial_end: trialEndDate ? trialEndDate.toISOString() : null,
      days_remaining: trialEndDate
        ? Math.ceil((trialEndDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
        : null,
    },
  } as any);
}

async function handlePaymentActionRequired(invoice: Stripe.Invoice) {
  const subscriptionId = typeof (invoice as any).subscription === "string"
    ? (invoice as any).subscription
    : (invoice as any).subscription?.id || null;
  if (!subscriptionId) return;

  const { data: sub } = await supabaseAdmin
    .from("subscriptions")
    .select("user_id")
    .eq("stripe_subscription_id", subscriptionId)
    .single();

  if (!sub) return;

  // Log activity - user needs to complete payment (e.g., 3D Secure)
  await supabaseAdmin.from("activity_log").insert({
    user_id: sub.user_id,
    activity_type: "payment_action_required",
    description: "Payment requires action. Please complete authentication to continue.",
    metadata: {
      invoice_id: invoice.id,
      hosted_invoice_url: invoice.hosted_invoice_url,
      payment_intent: (invoice as any).payment_intent
        ? typeof (invoice as any).payment_intent === "string"
          ? (invoice as any).payment_intent
          : (invoice as any).payment_intent?.id || null
        : null,
    },
  } as any);
}