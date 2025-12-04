import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Create a typed Supabase client for this route
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, email, username } = body;

    if (!userId || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate temporary username from email if not provided
    const finalUsername = username || email.split("@")[0].toLowerCase().replace(/[^a-z0-9_]/g, "");

    // 1. Create user profile in users table
    const { data: userData, error: userError } = await supabase
      .from("users")
      .insert({
        id: userId,
        username: finalUsername,
        email: email,
        email_verified: false,
        onboarding_completed: false,
      } as any)
      .select()
      .single();

    if (userError) {
      console.error("Error creating user:", userError);
      return NextResponse.json(
        { error: "Failed to create user profile", details: userError.message },
        { status: 500 }
      );
    }

    // 2. Create default subscription (starter plan)
    const { error: subscriptionError } = await supabase
      .from("subscriptions")
      .insert({
        user_id: userId,
        plan_type: "starter",
        status: "active",
        posts_per_day: 1,
        social_accounts_limit: 1,
        categories_limit: 2,
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      } as any);

    if (subscriptionError) {
      console.error("Error creating subscription:", subscriptionError);
      // Don't fail the request, just log it
    }

    // 3. Create default user settings
    const { error: settingsError } = await supabase
      .from("user_settings")
      .insert({
        user_id: userId,
        auto_posting_enabled: false,
        selected_categories: ["tech", "ai"],
        email_notifications: true,
        push_notifications: true,
        weekly_digest: false,
        default_platforms: ["linkedin"],
        preferred_draft_time: "09:00:00",
      } as any);

    if (settingsError) {
      console.error("Error creating settings:", settingsError);
      // Don't fail the request, just log it
    }

    // 4. Log activity
    const { error: activityError } = await supabase
      .from("activity_log")
      .insert({
        user_id: userId,
        activity_type: "login",
        description: "User registered",
      } as any);

    if (activityError) {
      console.error("Error logging activity:", activityError);
      // Don't fail the request, just log it
    }

    return NextResponse.json({
      success: true,
      user: userData,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

