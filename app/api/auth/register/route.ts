import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Create a Supabase admin client with service role key (bypasses RLS)
// This is required because we need to create user records after Supabase Auth signup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!serviceRoleKey) {
  console.warn("SUPABASE_SERVICE_ROLE_KEY not set - user registration will fail due to RLS");
}

const supabaseAdmin = createClient(
  supabaseUrl,
  serviceRoleKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
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

    // Check if service role key is available
    if (!serviceRoleKey) {
      console.error("SUPABASE_SERVICE_ROLE_KEY is not configured");
      return NextResponse.json(
        { error: "Server configuration error - please contact support" },
        { status: 500 }
      );
    }

    // 1. Create user profile in users table
    const { data: userData, error: userError } = await supabaseAdmin
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
      
      // Check if it's a duplicate key error (user already exists)
      if (userError.code === "23505") {
        return NextResponse.json(
          { error: "User already exists", details: userError.message },
          { status: 409 }
        );
      }
      
      return NextResponse.json(
        { error: "Failed to create user profile", details: userError.message },
        { status: 500 }
      );
    }

    // 2. Create placeholder subscription (starter plan)
    // This will be replaced by Stripe subscription after checkout
    // Status is set to "trialing" as placeholder - will be updated by webhook
    // Check if subscription already exists (prevent duplicates)
    const { data: existingSub } = await supabaseAdmin
      .from("subscriptions")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (!existingSub) {
      const { error: subscriptionError } = await supabaseAdmin
        .from("subscriptions")
        .insert({
        user_id: userId,
        plan_type: "starter",
        status: "trialing", // Placeholder - will be updated by Stripe webhook
        posts_per_day: 1,
        social_accounts_limit: 1,
        categories_limit: -1, // -1 means unlimited (all categories)
          // Don't set dates here - Stripe webhook will set them properly
          current_period_start: null,
          current_period_end: null,
          trial_start: null,
          trial_end: null,
        } as any);

      if (subscriptionError) {
        console.error("Error creating placeholder subscription:", subscriptionError);
        // If it's a unique constraint violation, that's okay (subscription already exists)
        if (subscriptionError.code !== "23505") {
          // For other errors, log but don't fail - user can still go through checkout
          console.warn("Non-unique error creating subscription, continuing anyway");
        }
      }
    } else {
      console.log("Placeholder subscription already exists for user, skipping creation");
    }

    // 3. Create default user settings
    const { error: settingsError } = await supabaseAdmin
      .from("user_settings")
      .insert({
        user_id: userId,
        auto_posting_enabled: false,
        // Start with no categories selected; user will choose them later
        selected_categories: [],
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
    const { error: activityError } = await supabaseAdmin
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

