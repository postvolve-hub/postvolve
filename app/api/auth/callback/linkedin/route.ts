import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing Supabase configuration:", {
    hasUrl: !!supabaseUrl,
    hasServiceRoleKey: !!serviceRoleKey,
  });
}

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export async function GET(request: NextRequest) {
  try {
    // Verify Supabase configuration
    if (!supabaseUrl || !serviceRoleKey) {
      console.error("Missing Supabase configuration in callback");
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/settings?error=oauth_not_configured`
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    // Handle OAuth errors
    if (error) {
      console.error("LinkedIn OAuth error:", error);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/settings?error=linkedin_auth_failed`
      );
    }

    if (!code || !state) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/settings?error=missing_params`
      );
    }

    // Decode state to get user ID
    let userId: string;
    try {
      const decodedState = Buffer.from(state, "base64").toString("utf-8");
      userId = decodedState.split(":")[0];
    } catch {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/settings?error=invalid_state`
      );
    }

    // Exchange authorization code for access token
    const clientId = process.env.LINKEDIN_CLIENT_ID;
    const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
    // Ensure no trailing slash in base URL to avoid double slashes
    const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/+$/, "");
    const redirectUri = `${baseUrl}/api/auth/callback/linkedin`;

    if (!clientId || !clientSecret) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/settings?error=oauth_not_configured`
      );
    }

    // Exchange code for token
    const tokenResponse = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error("LinkedIn token exchange error:", errorText);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/settings?error=token_exchange_failed`
      );
    }

    const tokenData = await tokenResponse.json();
    const { access_token, refresh_token, expires_in } = tokenData;

    if (!access_token) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/settings?error=no_access_token`
      );
    }

    // Fetch user profile from LinkedIn
    const profileResponse = await fetch("https://api.linkedin.com/v2/userinfo", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (!profileResponse.ok) {
      console.error("LinkedIn profile fetch error:", await profileResponse.text());
      // Continue anyway - we have the token
    }

    let profileData: any = {};
    if (profileResponse.ok) {
      profileData = await profileResponse.json();
    }

    // Calculate token expiration
    const expiresAt = expires_in
      ? new Date(Date.now() + expires_in * 1000).toISOString()
      : null;

    // Check if account already exists
    const { data: existingAccount, error: checkError } = await supabaseAdmin
      .from("connected_accounts")
      .select("id")
      .eq("user_id", userId)
      .eq("platform", "linkedin")
      .maybeSingle();

    if (checkError) {
      console.error("Error checking existing account:", checkError);
      console.error("Check error details:", JSON.stringify(checkError, null, 2));
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/settings?error=database_error`
      );
    }

    const accountData = {
      user_id: userId,
      platform: "linkedin" as const,
      platform_user_id: profileData.sub || `linkedin_${Date.now()}`,
      platform_username: profileData.preferred_username || profileData.email || null,
      platform_display_name: profileData.name || null,
      platform_avatar_url: profileData.picture || null,
      access_token: access_token,
      refresh_token: refresh_token || null,
      token_expires_at: expiresAt,
      status: "connected" as const,
      connected_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    console.log("Saving LinkedIn account to database:", {
      userId,
      platform: accountData.platform,
      platform_user_id: accountData.platform_user_id,
      username: accountData.platform_username,
      existingAccount: existingAccount?.id || null,
    });

    if (existingAccount) {
      // Update existing account
      const { error: updateError } = await supabaseAdmin
        .from("connected_accounts")
        .update(accountData)
        .eq("id", existingAccount.id);

      if (updateError) {
        console.error("Error updating connected account:", updateError);
        console.error("Update error details:", JSON.stringify(updateError, null, 2));
        console.error("Account data being updated:", JSON.stringify(accountData, null, 2));
        return NextResponse.redirect(
          `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/settings?error=database_error`
        );
      }
      console.log("Successfully updated existing LinkedIn account");
    } else {
      // Create new account
      const { data: insertedAccount, error: insertError } = await supabaseAdmin
        .from("connected_accounts")
        .insert(accountData)
        .select()
        .single();

      if (insertError) {
        console.error("Error inserting connected account:", insertError);
        console.error("Insert error details:", JSON.stringify(insertError, null, 2));
        console.error("Account data being inserted:", JSON.stringify({
          ...accountData,
          access_token: "[REDACTED]",
          refresh_token: accountData.refresh_token ? "[REDACTED]" : null,
        }, null, 2));
        return NextResponse.redirect(
          `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/settings?error=database_error`
        );
      }
      console.log("Successfully created new LinkedIn account:", insertedAccount?.id);
    }

    // Log activity
    const { error: activityError } = await supabaseAdmin.from("activity_log").insert({
      user_id: userId,
      activity_type: "account_connected",
      description: "LinkedIn account connected successfully",
      metadata: {
        platform: "linkedin",
        platform_user_id: accountData.platform_user_id,
      },
    } as any);

    if (activityError) {
      console.error("Error logging activity:", activityError);
      // Don't fail the whole flow if activity logging fails
    }

    // Redirect back to settings with success
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/settings?connected=linkedin`
    );
  } catch (error: any) {
    console.error("LinkedIn callback error:", error);
    console.error("Error stack:", error?.stack);
    console.error("Error message:", error?.message);
    
    // Try to provide more specific error message
    let errorCode = "callback_failed";
    if (error?.message?.includes("database") || error?.message?.includes("supabase")) {
      errorCode = "database_error";
    } else if (error?.message?.includes("token") || error?.message?.includes("oauth")) {
      errorCode = "token_error";
    }
    
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/settings?error=${errorCode}`
    );
  }
}

