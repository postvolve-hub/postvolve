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
 * GET /api/auth/callback/facebook-pages
 * 
 * Handles Facebook Pages OAuth callback
 * Exchanges authorization code for access token and stores account info
 * Also fetches user's Pages and stores Page access tokens
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
      console.error("Facebook Pages OAuth error:", error, errorReason, errorDescription);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/settings?error=facebook_pages_auth_failed`
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

    // Exchange authorization code for short-lived user access token
    const clientId = process.env.FACEBOOK_PAGES_APP_ID;
    const clientSecret = process.env.FACEBOOK_PAGES_APP_SECRET;
    // Ensure no trailing slash in base URL to avoid double slashes
    const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/+$/, "");
    const redirectUri = `${baseUrl}/api/auth/callback/facebook-pages`;

    if (!clientId || !clientSecret) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/settings?error=oauth_not_configured`
      );
    }

    // Exchange code for token
    const tokenUrl = new URL("https://graph.facebook.com/v21.0/oauth/access_token");
    tokenUrl.searchParams.set("client_id", clientId);
    tokenUrl.searchParams.set("client_secret", clientSecret);
    tokenUrl.searchParams.set("redirect_uri", redirectUri);
    tokenUrl.searchParams.set("code", code);

    const tokenFetchResponse = await fetch(tokenUrl.toString(), {
      method: "GET",
    });

    if (!tokenFetchResponse.ok) {
      const errorText = await tokenFetchResponse.text();
      console.error("Facebook Pages token exchange error:", errorText);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/settings?error=token_exchange_failed`
      );
    }

    const tokenData = await tokenFetchResponse.json();
    const { access_token: shortLivedToken, expires_in } = tokenData;

    if (!shortLivedToken) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/settings?error=no_access_token`
      );
    }

    // Exchange for long-lived user token (better stability for posting)
    const longLivedUrl = new URL("https://graph.facebook.com/v21.0/oauth/access_token");
    longLivedUrl.searchParams.set("grant_type", "fb_exchange_token");
    longLivedUrl.searchParams.set("client_id", clientId);
    longLivedUrl.searchParams.set("client_secret", clientSecret);
    longLivedUrl.searchParams.set("fb_exchange_token", shortLivedToken);

    const longLivedResp = await fetch(longLivedUrl.toString(), { method: "GET" });
    if (!longLivedResp.ok) {
      console.warn("Facebook long-lived token exchange failed, falling back to short-lived:", await longLivedResp.text());
    }
    const longLivedData = longLivedResp.ok ? await longLivedResp.json() : {};
    const userAccessToken = longLivedData.access_token || shortLivedToken;
    const longLivedExpiresIn = longLivedData.expires_in || expires_in;

    // Fetch user profile from Facebook Graph API
    // Note: 'email' field requires 'email' permission which is not available for Business apps
    const profileResponse = await fetch(
      `https://graph.facebook.com/v21.0/me?fields=id,name,picture&access_token=${userAccessToken}`
    );

    if (!profileResponse.ok) {
      console.error("Facebook profile fetch error:", await profileResponse.text());
      // Continue anyway - we have the token
    }

    let profileData: any = {};
    if (profileResponse.ok) {
      profileData = await profileResponse.json();
    }

    // Fetch user's Pages (requires pages_show_list permission)
    const pagesResponse = await fetch(
      `https://graph.facebook.com/v21.0/me/accounts?fields=id,name,access_token,instagram_business_account&access_token=${userAccessToken}`
    );

    let pagesData: any[] = [];
    if (pagesResponse.ok) {
      const pagesResult = await pagesResponse.json();
      pagesData = pagesResult.data || [];
    } else {
      console.warn("Could not fetch Pages. User may not have any Pages or permission was denied.");
    }

    // Pick first page (for now) and prefer its access token for posting
    const primaryPage = pagesData[0];
    const pageAccessToken = primaryPage?.access_token || userAccessToken;

    // Calculate token expiration using long-lived value if available
    const expiresAt = longLivedExpiresIn && longLivedExpiresIn > 0
      ? new Date(Date.now() + longLivedExpiresIn * 1000).toISOString()
      : null;

    // Check if account already exists
    const { data: existingAccount, error: checkError } = await supabaseAdmin
      .from("connected_accounts")
      .select("id")
      .eq("user_id", userId)
      .eq("platform", "facebook")
      .maybeSingle();

    if (checkError) {
      console.error("Error checking existing account:", checkError);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/settings?error=database_error`
      );
    }

    // For Facebook Pages, we store the user's access token
    // The Pages themselves are managed via the user's access token
    const accountData = {
      user_id: userId,
      platform: "facebook" as const,
      platform_user_id: profileData.id || `facebook_${Date.now()}`,
      platform_username: profileData.name || null, // Email not available for Business apps
      platform_display_name: profileData.name || null,
      platform_avatar_url: profileData.picture?.data?.url || null,
      access_token: pageAccessToken, // use Page token for posting
      refresh_token: null, // Facebook doesn't provide refresh tokens
      token_expires_at: expiresAt,
      status: "connected" as const,
      connected_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    console.log("Saving Facebook Pages account to database:", {
      userId,
      platform: accountData.platform,
      platform_user_id: accountData.platform_user_id,
      username: accountData.platform_username,
      pagesCount: pagesData.length,
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
      console.log("Successfully updated existing Facebook Pages account:", {
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
      console.log("Successfully created new Facebook Pages account:", insertedAccount?.id);
    }

    // Log activity
    const { error: activityError } = await supabaseAdmin.from("activity_log").insert({
      user_id: userId,
      activity_type: "account_connected",
      description: "Facebook Pages account connected successfully",
      metadata: {
        platform: "facebook",
        platform_user_id: accountData.platform_user_id,
        pages_count: pagesData.length,
      },
    } as any);

    if (activityError) {
      console.error("Error logging activity:", activityError);
      // Don't fail the whole flow if activity logging fails
    }

    // Redirect back to settings with success
    // Note: We use "facebook" as the connected parameter since both Login and Pages use the same platform
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/settings?connected=facebook`
    );
  } catch (error: any) {
    console.error("Facebook Pages callback error:", error);
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

