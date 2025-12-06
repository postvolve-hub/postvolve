/**
 * Token Refresh Helper Functions
 * 
 * Handles automatic refresh of OAuth tokens for platforms that support refresh tokens (X/Twitter)
 */

import { supabaseAdmin } from "@/lib/supabaseServer";

/**
 * Check if a token should be refreshed (expires within 24 hours)
 */
export function shouldRefreshToken(tokenExpiresAt: string | null | undefined): boolean {
  if (!tokenExpiresAt) return false;
  
  const expiresAt = new Date(tokenExpiresAt);
  const now = new Date();
  const twentyFourHoursFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  
  // Refresh if token expires within 24 hours
  return expiresAt < twentyFourHoursFromNow && expiresAt > now;
}

/**
 * Refresh X (Twitter) access token using refresh token
 */
export async function refreshXToken(accountId: string) {
  try {
    // Fetch account with refresh token
    const { data: account, error: fetchError } = await supabaseAdmin
      .from("connected_accounts")
      .select("id, user_id, platform, refresh_token, access_token, token_expires_at")
      .eq("id", accountId)
      .eq("platform", "twitter") // Database uses "twitter" enum
      .eq("status", "connected")
      .single();

    if (fetchError || !account) {
      return { success: false, error: fetchError || new Error("Account not found") };
    }

    if (!account.refresh_token) {
      return { success: false, error: new Error("No refresh token available") };
    }

    const clientId = process.env.TWITTER_CLIENT_ID;
    const clientSecret = process.env.TWITTER_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return { success: false, error: new Error("X OAuth credentials not configured") };
    }

    // Exchange refresh token for new access token
    const tokenResponse = await fetch("https://api.x.com/2/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      },
      body: new URLSearchParams({
        refresh_token: account.refresh_token,
        grant_type: "refresh_token",
        client_id: clientId,
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error("X token refresh error:", errorText);
      
      // If refresh token is invalid/expired, mark account as expired
      if (tokenResponse.status === 401 || tokenResponse.status === 400) {
        await supabaseAdmin
          .from("connected_accounts")
          .update({
            status: "expired",
            updated_at: new Date().toISOString(),
          })
          .eq("id", accountId);
        
        return { success: false, error: new Error("Refresh token expired - user needs to reconnect") };
      }
      
      return { success: false, error: new Error(`Token refresh failed: ${errorText}`) };
    }

    const tokenData = await tokenResponse.json();
    const { access_token, refresh_token, expires_in } = tokenData;

    if (!access_token) {
      return { success: false, error: new Error("No access token in refresh response") };
    }

    // Calculate new expiration
    const expiresAt = expires_in
      ? new Date(Date.now() + expires_in * 1000).toISOString()
      : null;

    // Update account with new tokens
    const { error: updateError } = await supabaseAdmin
      .from("connected_accounts")
      .update({
        access_token: access_token,
        refresh_token: refresh_token || account.refresh_token, // Use new refresh token if provided, otherwise keep old one
        token_expires_at: expiresAt,
        updated_at: new Date().toISOString(),
      })
      .eq("id", accountId);

    if (updateError) {
      console.error("Error updating refreshed token:", updateError);
      return { success: false, error: updateError };
    }

    // Log activity
    await supabaseAdmin.from("activity_log").insert({
      user_id: account.user_id,
      activity_type: "account_connected", // Using same type for refresh
      description: "X account token refreshed automatically",
      metadata: {
        platform: "x",
        account_id: accountId,
      },
    } as any);

    console.log(`Successfully refreshed X token for account ${accountId}`);
    return { success: true, expiresAt };
  } catch (error: any) {
    console.error("Error refreshing X token:", error);
    return { success: false, error };
  }
}

/**
 * Refresh all X tokens that need refreshing
 */
export async function refreshAllXTokens() {
  try {
    // Fetch all connected X accounts with refresh tokens
    const { data: accounts, error } = await supabaseAdmin
      .from("connected_accounts")
      .select("id, token_expires_at, refresh_token")
      .eq("platform", "twitter")
      .eq("status", "connected")
      .not("refresh_token", "is", null)
      .not("token_expires_at", "is", null);

    if (error) {
      console.error("Error fetching X accounts for refresh:", error);
      return { refreshed: 0, failed: 0, errors: [] };
    }

    if (!accounts || accounts.length === 0) {
      return { refreshed: 0, failed: 0, errors: [] };
    }

    const errors: any[] = [];
    let refreshed = 0;
    let failed = 0;

    for (const account of accounts) {
      if (shouldRefreshToken(account.token_expires_at)) {
        const result = await refreshXToken(account.id);
        if (result.success) {
          refreshed++;
        } else {
          failed++;
          errors.push({ accountId: account.id, error: result.error });
        }
      }
    }

    console.log(`Token refresh complete: ${refreshed} refreshed, ${failed} failed`);
    return { refreshed, failed, errors };
  } catch (error: any) {
    console.error("Error in refreshAllXTokens:", error);
    return { refreshed: 0, failed: 0, errors: [error] };
  }
}

