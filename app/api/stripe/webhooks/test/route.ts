import { NextRequest, NextResponse } from "next/server";

/**
 * Simple test endpoint to verify webhook route is accessible
 * This helps verify the route is deployed and reachable
 */
export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Webhook endpoint is accessible",
    endpoint: "/api/stripe/webhooks",
    method: "POST",
    requiredHeaders: ["stripe-signature"],
    requiredEnvVars: ["STRIPE_WEBHOOK_SECRET"],
    envVarsSet: {
      STRIPE_WEBHOOK_SECRET: !!process.env.STRIPE_WEBHOOK_SECRET,
      STRIPE_SECRET_KEY: !!process.env.STRIPE_SECRET_KEY,
    },
  });
}

