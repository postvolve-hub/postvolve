/**
 * Helper functions for Stripe operations
 */

import { PLAN_CONFIG, PlanId } from "./stripe";

/**
 * Create a checkout session for a user
 */
export async function createCheckoutSession(planId: PlanId, userId: string) {
  const response = await fetch("/api/stripe/create-checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      planId: planId,
      userId: userId,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to create checkout session");
  }

  return data;
}

/**
 * Get plan display name
 */
export function getPlanName(planId: PlanId): string {
  return PLAN_CONFIG[planId].name;
}

/**
 * Get plan price
 */
export function getPlanPrice(planId: PlanId): number {
  return PLAN_CONFIG[planId].amount;
}

/**
 * Check if plan is an upgrade
 */
export function isUpgrade(currentPlan: PlanId, newPlan: PlanId): boolean {
  const prices = {
    starter: 39,
    plus: 99,
    pro: 299,
  };
  return prices[newPlan] > prices[currentPlan];
}

/**
 * Check if plan is a downgrade
 */
export function isDowngrade(currentPlan: PlanId, newPlan: PlanId): boolean {
  const prices = {
    starter: 39,
    plus: 99,
    pro: 299,
  };
  return prices[newPlan] < prices[currentPlan];
}

