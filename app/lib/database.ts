// =====================================================
// Database Helper Functions
// =====================================================
// Common database queries and utilities for PostVolve
// =====================================================

import { supabase } from "./supabaseServer";
import type {
  User,
  UserInsert,
  UserUpdate,
  Post,
  PostInsert,
  PostUpdate,
  Subscription,
  UserSettings,
  ConnectedAccount,
  PostingSchedule,
  DailyAnalytics,
} from "@/shared/types/database.types";

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
  return data as User;
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
  return data as User;
}

/**
 * Check if username is available
 */
export async function checkUsernameAvailability(username: string) {
  const { data, error } = await supabase
    .rpc("is_username_available", { username_to_check: username });

  if (error) throw error;
  return data as boolean;
}

/**
 * Update user profile
 */
export async function updateUser(userId: string, updates: UserUpdate) {
  const { data, error } = await supabase
    .from("users")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;
  return data as User;
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
  return data as User;
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
  return data as Subscription | null;
}

/**
 * Get user subscription limits
 */
export async function getUserLimits(userId: string) {
  const { data, error } = await supabase
    .rpc("get_user_limits", { user_uuid: userId });

  if (error) throw error;
  return data?.[0] || null;
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
  return data as UserSettings | null;
}

/**
 * Update user settings
 */
export async function updateUserSettings(userId: string, settings: Partial<UserSettings>) {
  const { data, error } = await supabase
    .from("user_settings")
    .upsert({ user_id: userId, ...settings })
    .select()
    .single();

  if (error) throw error;
  return data as UserSettings;
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
  return data as Post[];
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
export async function createPost(post: PostInsert) {
  const { data, error } = await supabase
    .from("posts")
    .insert(post)
    .select()
    .single();

  if (error) throw error;
  return data as Post;
}

/**
 * Update post
 */
export async function updatePost(postId: string, updates: PostUpdate) {
  const { data, error } = await supabase
    .from("posts")
    .update(updates)
    .eq("id", postId)
    .select()
    .single();

  if (error) throw error;
  return data as Post;
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
  return data as Post;
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
  return data as Post[];
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
  return data as ConnectedAccount[];
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
  return data as ConnectedAccount | null;
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
  return data as PostingSchedule[];
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
  return data as DailyAnalytics[];
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
    dailyData: data as DailyAnalytics[],
  };

  data?.forEach((day) => {
    summary.totalImpressions += day.total_impressions;
    summary.totalEngagements += day.total_engagements;
    summary.totalClicks += day.total_clicks;
    summary.totalShares += day.total_shares;
    summary.totalPublished += day.posts_published;
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

