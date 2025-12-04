import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-11-17.clover",
  typescript: true,
});

// Plan configuration mapping
export const PLAN_CONFIG = {
  starter: {
    priceId: process.env.STRIPE_STARTER_PRICE_ID || "",
    amount: 39,
    name: "Starter",
    features: {
      postsPerDay: 1,
      socialAccountsLimit: 1,
      categoriesLimit: 2,
    },
  },
  plus: {
    priceId: process.env.STRIPE_PLUS_PRICE_ID || "",
    amount: 99,
    name: "Plus",
    features: {
      postsPerDay: 3,
      socialAccountsLimit: 5,
      categoriesLimit: 4,
    },
  },
  pro: {
    priceId: process.env.STRIPE_PRO_PRICE_ID || "",
    amount: 299,
    name: "Pro",
    features: {
      postsPerDay: -1, // -1 means unlimited
      socialAccountsLimit: -1,
      categoriesLimit: -1,
    },
  },
} as const;

export type PlanId = keyof typeof PLAN_CONFIG;

