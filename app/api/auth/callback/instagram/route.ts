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

/**
 * GET /api/auth/callback/instagram
 * 
 * Handles Instagram OAuth callback
 * Instagram uses Facebook's OAuth system, so we exchange via Facebook Graph API
 * Then fetch Instagram account info via Instagram Graph API
 */
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
    const errorReason = searchParams.get("error_reason");
    const errorDescription = searchParams.get("error_description");

    // Handle OAuth errors
    if (error) {
      console.error("Instagram OAuth error:", error, errorReason, errorDescription);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/settings?error=instagram_auth_failed`
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

    // Exchange authorization code for short-lived IG user token (Instagram Login)
    const clientId = process.env.INSTAGRAM_APP_ID;
    const clientSecret = process.env.INSTAGRAM_APP_SECRET;
    const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/+$/, "");
    const redirectUri = `${baseUrl}/api/auth/callback/instagram`;

    if (!clientId || !clientSecret) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/settings?error=oauth_not_configured`
      );
    }

    // Instagram token exchange (form POST)
    const tokenForm = new URLSearchParams();
    tokenForm.set("client_id", clientId);
    tokenForm.set("client_secret", clientSecret);
    tokenForm.set("grant_type", "authorization_code");
    tokenForm.set("redirect_uri", redirectUri);
    tokenForm.set("code", code);

    const tokenFetchResponse = await fetch("https://api.instagram.com/oauth/access_token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: tokenForm.toString(),
    });

    if (!tokenFetchResponse.ok) {
      const errorText = await tokenFetchResponse.text();
      console.error("Instagram token exchange error:", errorText);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/settings?error=token_exchange_failed`
      );
    }

    const tokenData = await tokenFetchResponse.json();
    const { access_token: shortLivedToken, user_id: igUserId } = tokenData;

    if (!shortLivedToken) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/settings?error=no_access_token`
      );
    }

    // Exchange for long-lived IG token
    const longLivedUrl = new URL("https://graph.instagram.com/access_token");
    longLivedUrl.searchParams.set("grant_type", "ig_exchange_token");
    longLivedUrl.searchParams.set("client_secret", clientSecret);
    longLivedUrl.searchParams.set("access_token", shortLivedToken);

    const longLivedResp = await fetch(longLivedUrl.toString(), { method: "GET" });
    if (!longLivedResp.ok) {
      console.warn("Instagram long-lived token exchange failed, using short-lived token:", await longLivedResp.text());
    }
    const longLivedData = longLivedResp.ok ? await longLivedResp.json() : {};
    const userAccessToken = longLivedData.access_token || shortLivedToken;
    const longLivedExpiresIn = longLivedData.expires_in; // seconds

    // Fetch IG account details directly (no Page needed)
    let instagramAccountId: string | null = igUserId ? String(igUserId) : null;
    let instagramUsername: string | null = null;
    let platformAvatarUrl: string | null = null;

    const igProfileResp = await fetch(
      `https://graph.instagram.com/me?fields=id,username,account_type,media_count,profile_picture_url&access_token=${userAccessToken}`
    );

    if (igProfileResp.ok) {
      const igProfile = await igProfileResp.json();
      instagramAccountId = igProfile.id || instagramAccountId;
      instagramUsername = igProfile.username || instagramUsername;
      platformAvatarUrl = igProfile.profile_picture_url || platformAvatarUrl;
    } else {
      console.warn("Instagram profile fetch failed:", await igProfileResp.text());
    }

    const expiresAt = longLivedExpiresIn && longLivedExpiresIn > 0
      ? new Date(Date.now() + longLivedExpiresIn * 1000).toISOString()
      : null;

    // Check if account already exists
    const { data: existingAccount, error: checkError } = await supabaseAdmin
      .from("connected_accounts")
      .select("id")
      .eq("user_id", userId)
      .eq("platform", "instagram")
      .maybeSingle();

    if (checkError) {
      console.error("Error checking existing account:", checkError);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/settings?error=database_error`
      );
    }

    const effectiveAccessToken = userAccessToken;

    const accountData = {
      user_id: userId,
      platform: "instagram" as const,
      platform_user_id: instagramAccountId || `instagram_${Date.now()}`,
      platform_username: instagramUsername ? `@${instagramUsername}` : null,
      platform_display_name: pageName || instagramUsername || null,
      platform_avatar_url: platformAvatarUrl || null,
      access_token: effectiveAccessToken, // prefer Page token for posting
      refresh_token: null, // Instagram doesn't provide refresh tokens via this flow
      token_expires_at: expiresAt,
      status: "connected" as const,
      connected_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    console.log("Saving Instagram account to database:", {
      userId,
      platform: accountData.platform,
      platform_user_id: accountData.platform_user_id,
      username: accountData.platform_username,
      existingAccount: existingAccount?.id || null,
    });

    if (existingAccount) {
      // Update existing account - explicitly ensure status is set to "connected"
      const updateData = {
        ...accountData,
        status: "connected" as const, // Explicitly set status to ensure it updates from "expired"
      };
      
      const { error: updateError, data: updatedData } = await supabaseAdmin
        .from("connected_accounts")
        .update(updateData)
        .eq("id", existingAccount.id)
        .select("status"); // Select to verify update

      if (updateError) {
        console.error("Error updating connected account:", updateError);
        return NextResponse.redirect(
          `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/settings?error=database_error`
        );
      }
      
      const actualStatus = updatedData?.[0]?.status;
      console.log("Successfully updated existing Instagram account:", {
        accountId: existingAccount.id,
        statusAfterUpdate: actualStatus,
      });
      
      if (actualStatus !== "connected") {
        console.warn(`Status update may have failed. Expected: "connected", Got: "${actualStatus}"`);
      }
    } else {
      // Create new account
      const { data: insertedAccount, error: insertError } = await supabaseAdmin
        .from("connected_accounts")
        .insert(accountData)
        .select()
        .single();

      if (insertError) {
        console.error("Error inserting connected account:", insertError);
        return NextResponse.redirect(
          `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/settings?error=database_error`
        );
      }
      console.log("Successfully created new Instagram account:", insertedAccount?.id);
    }

    // Log activity
    const { error: activityError } = await supabaseAdmin.from("activity_log").insert({
      user_id: userId,
      activity_type: "account_connected",
      description: "Instagram account connected successfully",
      metadata: {
        platform: "instagram",
        platform_user_id: accountData.platform_user_id,
      },
    } as any);

    if (activityError) {
      console.error("Error logging activity:", activityError);
      // Don't fail the whole flow if activity logging fails
    }

    // Redirect back to settings with success
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/settings?connected=instagram`
    );
  } catch (error: any) {
    console.error("Instagram callback error:", error);
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



