// =====================================================
// Subscription Access Control
// =====================================================
// Helper functions to check subscription status and feature access
// =====================================================

import type { SubscriptionStatus } from "@shared/types/database.types";

export interface Subscription {
  id?: string;
  user_id: string;
  status: SubscriptionStatus;
  plan_type: "starter" | "plus" | "pro";
  stripe_subscription_id?: string | null;
  current_period_start?: string | null;
  current_period_end?: string | null;
  cancel_at_period_end?: boolean;
  canceled_at?: string | null;
  trial_end?: string | null;
}

export interface AccessPermissions {
  canGenerateContent: boolean;
  canPublishPosts: boolean;
  canSchedulePosts: boolean;
  canConnectAccounts: boolean;
  canViewAnalytics: boolean;
  canEditSettings: boolean;
  canViewDrafts: boolean;
  canUseAutoPosting: boolean;
  accessLevel: "full" | "limited" | "readonly" | "locked";
  gracePeriodDays?: number;
  message?: string;
  actionRequired?: boolean;
}

/**
 * Calculate days past due for a subscription
 */
function calculateDaysPastDue(subscription: Subscription): number {
  if (subscription.status !== "past_due" || !subscription.current_period_end) {
    return 0;
  }

  const periodEnd = new Date(subscription.current_period_end);
  const now = new Date();
  const diffTime = now.getTime() - periodEnd.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return Math.max(0, diffDays);
}

/**
 * Check if subscription has active access (full or limited)
 */
export function hasActiveAccess(subscription: Subscription | null): boolean {
  if (!subscription) return false;

  // Placeholder subscriptions (no stripe_subscription_id) should not grant access
  // User must complete checkout to get a real Stripe subscription
  if (!subscription.stripe_subscription_id) {
    return false;
  }

  // Active or trialing = full access (only if real Stripe subscription exists)
  if (subscription.status === "active" || subscription.status === "trialing") {
    return true;
  }

  // Past due = limited access (grace period)
  if (subscription.status === "past_due") {
    const daysPastDue = calculateDaysPastDue(subscription);
    return daysPastDue <= 7; // 7-day grace period
  }

  // Canceled = no access (unless cancel_at_period_end and still in period)
  if (subscription.status === "canceled") {
    if (subscription.cancel_at_period_end && subscription.current_period_end) {
      const periodEnd = new Date(subscription.current_period_end);
      const now = new Date();
      return now < periodEnd; // Access until period end
    }
    return false; // Immediate lock
  }

  // Paused = no access
  if (subscription.status === "paused") {
    return false;
  }

  return false;
}

/**
 * Get detailed access permissions for a subscription
 */
export function getAccessPermissions(subscription: Subscription | null): AccessPermissions {
  if (!subscription) {
    return {
      canGenerateContent: false,
      canPublishPosts: false,
      canSchedulePosts: false,
      canConnectAccounts: false,
      canViewAnalytics: true, // Historical data always viewable
      canEditSettings: false,
      canViewDrafts: true, // Read-only access
      canUseAutoPosting: false,
      accessLevel: "locked",
      message: "No active subscription. Please subscribe to access features.",
      actionRequired: true,
    };
  }

  // Placeholder subscription (no Stripe subscription ID) - no access
  // User must complete checkout to get a real subscription
  if (!subscription.stripe_subscription_id) {
    return {
      canGenerateContent: false,
      canPublishPosts: false,
      canSchedulePosts: false,
      canConnectAccounts: false,
      canViewAnalytics: true, // Historical data always viewable
      canEditSettings: false,
      canViewDrafts: true, // Read-only access
      canUseAutoPosting: false,
      accessLevel: "locked",
      message: "Please complete checkout to activate your subscription and access all features.",
      actionRequired: true,
    };
  }

  const status = subscription.status;
  const daysPastDue = calculateDaysPastDue(subscription);

  // Active or Trialing - Full Access (only if real Stripe subscription exists)
  if (status === "active" || status === "trialing") {
    return {
      canGenerateContent: true,
      canPublishPosts: true,
      canSchedulePosts: true,
      canConnectAccounts: true,
      canViewAnalytics: true,
      canEditSettings: true,
      canViewDrafts: true,
      canUseAutoPosting: true,
      accessLevel: "full",
    };
  }

  // Past Due - Limited Access (Grace Period)
  if (status === "past_due") {
    const gracePeriodDays = 7 - daysPastDue;
    const inGracePeriod = daysPastDue <= 7;

    return {
      canGenerateContent: false,
      canPublishPosts: false,
      canSchedulePosts: false,
      canConnectAccounts: false,
      canViewAnalytics: true, // Historical only
      canEditSettings: false,
      canViewDrafts: true, // Read-only
      canUseAutoPosting: false,
      accessLevel: inGracePeriod ? "limited" : "locked",
      gracePeriodDays: Math.max(0, gracePeriodDays),
      message: inGracePeriod
        ? `Payment failed. Update your payment method within ${gracePeriodDays} day${gracePeriodDays !== 1 ? "s" : ""} to restore access.`
        : "Payment failed. Your subscription has been canceled. Please update your payment method to reactivate.",
      actionRequired: true,
    };
  }

  // Canceled - Read-Only Access
  if (status === "canceled") {
    // If cancel_at_period_end, allow access until period end
    if (subscription.cancel_at_period_end && subscription.current_period_end) {
      const periodEnd = new Date(subscription.current_period_end);
      const now = new Date();
      const hasAccessUntilPeriodEnd = now < periodEnd;

      if (hasAccessUntilPeriodEnd) {
        return {
          canGenerateContent: false,
          canPublishPosts: false,
          canSchedulePosts: false,
          canConnectAccounts: false,
          canViewAnalytics: true,
          canEditSettings: false,
          canViewDrafts: true,
          canUseAutoPosting: false,
          accessLevel: "readonly",
          message: "Your subscription will end at the end of your current billing period. Reactivate to continue using all features.",
          actionRequired: true,
        };
      }
    }

    // Immediate lock (trial cancellation or period ended)
    return {
      canGenerateContent: false,
      canPublishPosts: false,
      canSchedulePosts: false,
      canConnectAccounts: false,
      canViewAnalytics: true, // Historical only
      canEditSettings: false,
      canViewDrafts: true, // Read-only
      canUseAutoPosting: false,
      accessLevel: "locked",
      message: "Your subscription has been canceled. Reactivate to restore access to all features.",
      actionRequired: true,
    };
  }

  // Paused - No Access
  if (status === "paused") {
    return {
      canGenerateContent: false,
      canPublishPosts: false,
      canSchedulePosts: false,
      canConnectAccounts: false,
      canViewAnalytics: true,
      canEditSettings: false,
      canViewDrafts: true,
      canUseAutoPosting: false,
      accessLevel: "locked",
      message: "Your subscription is paused. Please contact support to reactivate.",
      actionRequired: true,
    };
  }

  // Default - No Access
  return {
    canGenerateContent: false,
    canPublishPosts: false,
    canSchedulePosts: false,
    canConnectAccounts: false,
    canViewAnalytics: true,
    canEditSettings: false,
    canViewDrafts: true,
    canUseAutoPosting: false,
    accessLevel: "locked",
    message: "Subscription status unknown. Please contact support.",
    actionRequired: true,
  };
}

/**
 * Check if trial is ending soon (within 3 days)
 */
export function isTrialEndingSoon(subscription: Subscription | null): boolean {
  if (!subscription || subscription.status !== "trialing" || !subscription.trial_end) {
    return false;
  }

  const trialEnd = new Date(subscription.trial_end);
  const now = new Date();
  const diffTime = trialEnd.getTime() - now.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);

  return diffDays <= 3 && diffDays > 0;
}

/**
 * Get days remaining in trial
 */
export function getTrialDaysRemaining(subscription: Subscription | null): number | null {
  if (!subscription || subscription.status !== "trialing" || !subscription.trial_end) {
    return null;
  }

  const trialEnd = new Date(subscription.trial_end);
  const now = new Date();
  const diffTime = trialEnd.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return Math.max(0, diffDays);
}

/**
 * Get subscription status message for UI
 */
export function getSubscriptionStatusMessage(subscription: Subscription | null): {
  message: string;
  type: "success" | "warning" | "error" | "info";
  actionRequired: boolean;
} {
  if (!subscription) {
    return {
      message: "No active subscription. Please subscribe to access features.",
      type: "error",
      actionRequired: true,
    };
  }

  const status = subscription.status;

  if (status === "active") {
    return {
      message: "Your subscription is active.",
      type: "success",
      actionRequired: false,
    };
  }

  if (status === "trialing") {
    const daysRemaining = getTrialDaysRemaining(subscription);
    if (daysRemaining !== null && daysRemaining <= 3) {
      return {
        message: `Your trial ends in ${daysRemaining} day${daysRemaining !== 1 ? "s" : ""}. Add a payment method to continue.`,
        type: "warning",
        actionRequired: true,
      };
    }
    return {
      message: "You're on a free trial.",
      type: "info",
      actionRequired: false,
    };
  }

  if (status === "past_due") {
    const daysPastDue = calculateDaysPastDue(subscription);
    const gracePeriodDays = 7 - daysPastDue;

    if (gracePeriodDays > 0) {
      return {
        message: `Payment failed. Update your payment method within ${gracePeriodDays} day${gracePeriodDays !== 1 ? "s" : ""} to restore access.`,
        type: "error",
        actionRequired: true,
      };
    }

    return {
      message: "Payment failed. Your subscription has been canceled. Please update your payment method to reactivate.",
      type: "error",
      actionRequired: true,
    };
  }

  if (status === "canceled") {
    if (subscription.cancel_at_period_end && subscription.current_period_end) {
      const periodEnd = new Date(subscription.current_period_end);
      const now = new Date();
      if (now < periodEnd) {
        return {
          message: "Your subscription will end at the end of your current billing period. Reactivate to continue using all features.",
          type: "warning",
          actionRequired: true,
        };
      }
    }

    return {
      message: "Your subscription has been canceled. Reactivate to restore access to all features.",
      type: "error",
      actionRequired: true,
    };
  }

  if (status === "paused") {
    return {
      message: "Your subscription is paused. Please contact support to reactivate.",
      type: "error",
      actionRequired: true,
    };
  }

  return {
    message: "Subscription status unknown. Please contact support.",
    type: "error",
    actionRequired: true,
  };
}

