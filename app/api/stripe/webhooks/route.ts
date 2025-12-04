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

  // Extract subscription properties (Stripe types can be complex)
  const periodStart = (subscription as any).current_period_start;
  const periodEnd = (subscription as any).current_period_end;
  const cancelAtPeriodEnd = (subscription as any).cancel_at_period_end;

  // Update subscription in database
  await supabaseAdmin
    .from("subscriptions")
    .update({
      plan_type: planId as any,
      status: "active",
      stripe_subscription_id: subscriptionId,
      stripe_customer_id: customerId,
      posts_per_day: plan.features.postsPerDay,
      social_accounts_limit: plan.features.socialAccountsLimit,
      categories_limit: plan.features.categoriesLimit,
      current_period_start: periodStart
        ? new Date(periodStart * 1000).toISOString()
        : null,
      current_period_end: periodEnd
        ? new Date(periodEnd * 1000).toISOString()
        : null,
      cancel_at_period_end: cancelAtPeriodEnd || false,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId);

  // Log activity
  await supabaseAdmin.from("activity_log").insert({
    user_id: userId,
    activity_type: "subscription_upgraded",
    metadata: { plan_id: planId },
  } as any);
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId;
  const planId = subscription.metadata?.planId;

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

      const periodStart = (subscription as any).current_period_start;
      const periodEnd = (subscription as any).current_period_end;
      const cancelAtPeriodEnd = (subscription as any).cancel_at_period_end;

      await supabaseAdmin
        .from("subscriptions")
        .update({
          status: subscription.status === "active" ? "active" : "canceled",
          current_period_start: periodStart
            ? new Date(periodStart * 1000).toISOString()
            : null,
          current_period_end: periodEnd
            ? new Date(periodEnd * 1000).toISOString()
            : null,
          cancel_at_period_end: cancelAtPeriodEnd || false,
          updated_at: new Date().toISOString(),
        })
        .eq("stripe_subscription_id", subscription.id);

    return;
  }

  const plan = PLAN_CONFIG[planId as keyof typeof PLAN_CONFIG];
  if (!plan) return;

  const periodStart = (subscription as any).current_period_start;
  const periodEnd = (subscription as any).current_period_end;
  const cancelAtPeriodEnd = (subscription as any).cancel_at_period_end;

  await supabaseAdmin
    .from("subscriptions")
    .update({
      plan_type: planId as any,
      status: subscription.status === "active" ? "active" : "canceled",
      posts_per_day: plan.features.postsPerDay,
      social_accounts_limit: plan.features.socialAccountsLimit,
      categories_limit: plan.features.categoriesLimit,
      current_period_start: periodStart
        ? new Date(periodStart * 1000).toISOString()
        : null,
      current_period_end: periodEnd
        ? new Date(periodEnd * 1000).toISOString()
        : null,
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

  // Create invoice record matching database schema
  await supabaseAdmin.from("invoices").insert({
    user_id: sub.user_id,
    subscription_id: sub.id,
    invoice_number: invoiceNumber,
    amount_cents: invoice.amount_paid || invoice.amount_due || 0,
    currency: invoice.currency || "USD",
    status: "paid",
    stripe_invoice_id: invoice.id,
    stripe_payment_intent_id: typeof invoice.payment_intent === "string" 
      ? invoice.payment_intent 
      : invoice.payment_intent?.id || null,
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

  await supabaseAdmin
    .from("subscriptions")
    .update({
      status: "past_due",
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_subscription_id", subscriptionId);
}

