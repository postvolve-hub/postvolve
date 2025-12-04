// =====================================================
// Database Helper Functions
// =====================================================
// Common database queries and utilities for PostVolve
// =====================================================

import { supabase } from "./supabaseServer";

// =====================================================
// USER OPERATIONS
// =====================================================

/**
 * Get user profile by ID
 */
export async function getUserById(userId: string) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get user by username
 */
export async function getUserByUsername(username: string) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("username", username)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Check if username is available
 */
export async function checkUsernameAvailability(username: string) {
  // Check if username already exists in users table
  const { data, error } = await supabase
    .from("users")
    .select("id")
    .eq("username", username)
    .maybeSingle();

  if (error) throw error;
  // If no user found with this username, it's available
  return data === null;
}

/**
 * Update user profile
 */
export async function updateUser(userId: string, updates: Record<string, any>) {
  const { data, error } = await supabase
    .from("users")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Complete user onboarding
 */
export async function completeOnboarding(userId: string) {
  const { data, error } = await supabase
    .from("users")
    .update({ onboarding_completed: true })
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// =====================================================
// SUBSCRIPTION OPERATIONS
// =====================================================

/**
 * Get user's active subscription
 */
export async function getUserSubscription(userId: string) {
  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "active")
    .single();

  if (error && error.code !== "PGRST116") throw error; // PGRST116 = no rows
  return data;
}

// =====================================================
// USER SETTINGS OPERATIONS
// =====================================================

/**
 * Get user settings
 */
export async function getUserSettings(userId: string) {
  const { data, error } = await supabase
    .from("user_settings")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return data;
}

/**
 * Update user settings
 */
export async function updateUserSettings(userId: string, settings: Record<string, any>) {
  const { data, error } = await supabase
    .from("user_settings")
    .upsert({ user_id: userId, ...settings })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// =====================================================
// POST OPERATIONS
// =====================================================

/**
 * Get user's posts
 */
export async function getUserPosts(
  userId: string,
  filters?: {
    status?: string;
    category?: string;
    limit?: number;
  }
) {
  let query = supabase
    .from("posts")
    .select("*")
    .eq("user_id", userId)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (filters?.status) {
    query = query.eq("status", filters.status);
  }
  if (filters?.category) {
    query = query.eq("category", filters.category);
  }
  if (filters?.limit) {
    query = query.limit(filters.limit);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

/**
 * Get post by ID
 */
export async function getPostById(postId: string) {
  const { data, error } = await supabase
    .from("posts")
    .select(`
      *,
      post_platforms (
        *,
        post_analytics (*)
      )
    `)
    .eq("id", postId)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Create a new post
 */
export async function createPost(post: Record<string, any>) {
  const { data, error } = await supabase
    .from("posts")
    .insert(post)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Update post
 */
export async function updatePost(postId: string, updates: Record<string, any>) {
  const { data, error } = await supabase
    .from("posts")
    .update(updates)
    .eq("id", postId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Soft delete post
 */
export async function deletePost(postId: string) {
  const { data, error } = await supabase
    .from("posts")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", postId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get scheduled posts
 */
export async function getScheduledPosts(userId: string) {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "scheduled")
    .is("deleted_at", null)
    .order("scheduled_at", { ascending: true });

  if (error) throw error;
  return data || [];
}

// =====================================================
// CONNECTED ACCOUNTS OPERATIONS
// =====================================================

/**
 * Get user's connected accounts
 */
export async function getConnectedAccounts(userId: string) {
  const { data, error } = await supabase
    .from("connected_accounts")
    .select("*")
    .eq("user_id", userId)
    .order("connected_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

/**
 * Get connected account by platform
 */
export async function getConnectedAccountByPlatform(userId: string, platform: string) {
  const { data, error } = await supabase
    .from("connected_accounts")
    .select("*")
    .eq("user_id", userId)
    .eq("platform", platform)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return data;
}

// =====================================================
// POSTING SCHEDULES OPERATIONS
// =====================================================

/**
 * Get user's posting schedules
 */
export async function getPostingSchedules(userId: string) {
  const { data, error } = await supabase
    .from("posting_schedules")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

// =====================================================
// ANALYTICS OPERATIONS
// =====================================================

/**
 * Get user's daily analytics
 */
export async function getDailyAnalytics(
  userId: string,
  startDate: string,
  endDate: string
) {
  const { data, error } = await supabase
    .from("daily_analytics")
    .select("*")
    .eq("user_id", userId)
    .gte("date", startDate)
    .lte("date", endDate)
    .order("date", { ascending: true });

  if (error) throw error;
  return data || [];
}

/**
 * Get user's analytics summary
 */
export async function getAnalyticsSummary(userId: string, days: number = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data, error } = await supabase
    .from("daily_analytics")
    .select("*")
    .eq("user_id", userId)
    .gte("date", startDate.toISOString().split("T")[0])
    .order("date", { ascending: false });

  if (error) throw error;

  // Calculate totals
  const summary = {
    totalImpressions: 0,
    totalEngagements: 0,
    totalClicks: 0,
    totalShares: 0,
    totalPublished: 0,
    dailyData: data || [],
  };

  data?.forEach((day: any) => {
    summary.totalImpressions += day.total_impressions || 0;
    summary.totalEngagements += day.total_engagements || 0;
    summary.totalClicks += day.total_clicks || 0;
    summary.totalShares += day.total_shares || 0;
    summary.totalPublished += day.posts_published || 0;
  });

  return summary;
}

// =====================================================
// ACTIVITY LOG
// =====================================================

/**
 * Log user activity
 */
export async function logActivity(
  userId: string,
  activityType: string,
  description?: string,
  metadata?: Record<string, any>
) {
  const { data, error } = await supabase
    .from("activity_log")
    .insert({
      user_id: userId,
      activity_type: activityType,
      description,
      metadata,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// =====================================================
// BULK OPERATIONS
// =====================================================

/**
 * Get full user profile with all related data
 */
export async function getFullUserProfile(userId: string) {
  const [user, subscription, settings, connectedAccounts, schedules] = await Promise.all([
    getUserById(userId),
    getUserSubscription(userId),
    getUserSettings(userId),
    getConnectedAccounts(userId),
    getPostingSchedules(userId),
  ]);

  return {
    user,
    subscription,
    settings,
    connectedAccounts,
    schedules,
  };
}

/**
 * Get dashboard data
 */
export async function getDashboardData(userId: string) {
  const [profile, recentPosts, scheduledPosts, analytics] = await Promise.all([
    getFullUserProfile(userId),
    getUserPosts(userId, { limit: 10 }),
    getScheduledPosts(userId),
    getAnalyticsSummary(userId, 30),
  ]);

  return {
    ...profile,
    recentPosts,
    scheduledPosts,
    analytics,
  };
}
