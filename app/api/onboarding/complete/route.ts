import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Create a Supabase admin client with service role key (bypasses RLS)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

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
    const { userId, username, platforms, categories, preferredDraftTime, autoPostingEnabled } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // 1. Update user profile with username and mark onboarding complete
    const { error: userError } = await supabaseAdmin
      .from("users")
      .update({
        username: username,
        onboarding_completed: true,
        updated_at: new Date().toISOString(),
      } as any)
      .eq("id", userId);

    if (userError) {
      console.error("Error updating user:", userError);
      return NextResponse.json(
        { error: "Failed to update user profile", details: userError.message },
        { status: 500 }
      );
    }

    // 2. Upsert user settings
    const { error: settingsError } = await supabaseAdmin
      .from("user_settings")
      .upsert({
        user_id: userId,
        selected_categories: categories || ["tech", "ai"],
        default_platforms: platforms || ["linkedin"],
        preferred_draft_time: preferredDraftTime || "09:00:00",
        auto_posting_enabled: autoPostingEnabled || false,
        updated_at: new Date().toISOString(),
      } as any, {
        onConflict: "user_id",
      });

    if (settingsError) {
      console.error("Error updating settings:", settingsError);
      return NextResponse.json(
        { error: "Failed to save preferences", details: settingsError.message },
        { status: 500 }
      );
    }

    // 3. Create posting schedule if auto-posting is enabled
    if (autoPostingEnabled && preferredDraftTime && platforms && platforms.length > 0) {
      const { error: scheduleError } = await supabaseAdmin
        .from("posting_schedules")
        .insert({
          user_id: userId,
          name: "Daily Auto-Post",
          time: preferredDraftTime,
          days_of_week: ["mon", "tue", "wed", "thu", "fri"],
          platforms: platforms,
          categories: categories,
          enabled: true,
        } as any);

      if (scheduleError) {
        console.error("Error creating schedule:", scheduleError);
        // Don't fail the request, just log it
      }
    }

    // 4. Log activity
    const { error: activityError } = await supabaseAdmin
      .from("activity_log")
      .insert({
        user_id: userId,
        activity_type: "settings_updated",
        description: "Onboarding completed",
        metadata: {
          platforms,
          categories,
          autoPostingEnabled,
        },
      } as any);

    if (activityError) {
      console.error("Error logging activity:", activityError);
      // Don't fail the request, just log it
    }

    return NextResponse.json({
      success: true,
      message: "Onboarding completed successfully",
    });
  } catch (error) {
    console.error("Onboarding complete error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

