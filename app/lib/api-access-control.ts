// =====================================================
// API Route Access Control
// =====================================================
// Helper functions to check subscription status in API routes
// =====================================================

import { NextResponse } from "next/server";
import { supabaseAdmin } from "./supabaseServer";
import { getAccessPermissions, type Subscription } from "./subscription-access";

/**
 * Get user's subscription from database
 */
export async function getUserSubscriptionFromDB(userId: string): Promise<Subscription | null> {
  const { data, error } = await supabaseAdmin
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data as Subscription;
}

/**
 * Check if user has access to a feature
 */
export async function checkFeatureAccess(
  userId: string,
  feature: "generate" | "publish" | "schedule" | "connect"
): Promise<{ allowed: boolean; message?: string; status?: number }> {
  const subscription = await getUserSubscriptionFromDB(userId);
  const permissions = getAccessPermissions(subscription);

  switch (feature) {
    case "generate":
      if (!permissions.canGenerateContent) {
        return {
          allowed: false,
          message: permissions.message || "Subscription required to generate content.",
          status: 402, // Payment Required
        };
      }
      break;
    case "publish":
      if (!permissions.canPublishPosts) {
        return {
          allowed: false,
          message: permissions.message || "Subscription required to publish posts.",
          status: 402,
        };
      }
      break;
    case "schedule":
      if (!permissions.canSchedulePosts) {
        return {
          allowed: false,
          message: permissions.message || "Subscription required to schedule posts.",
          status: 402,
        };
      }
      break;
    case "connect":
      if (!permissions.canConnectAccounts) {
        return {
          allowed: false,
          message: permissions.message || "Subscription required to connect accounts.",
          status: 402,
        };
      }
      break;
  }

  return { allowed: true };
}

/**
 * Middleware function to protect API routes
 */
export async function requireFeatureAccess(
  userId: string,
  feature: "generate" | "publish" | "schedule" | "connect"
): Promise<NextResponse | null> {
  const access = await checkFeatureAccess(userId, feature);

  if (!access.allowed) {
    return NextResponse.json(
      {
        error: access.message || "Access denied",
        code: "SUBSCRIPTION_REQUIRED",
        action: "update_payment",
      },
      { status: access.status || 403 }
    );
  }

  return null; // Access granted
}

