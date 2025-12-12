/**
 * Token Refresh Helper Functions
 * 
 * Handles automatic refresh of OAuth tokens for platforms that support refresh tokens (X/Twitter)
 * LinkedIn does not provide refresh tokens, so manual reconnect is required
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

/**
  * Check if a token should be refreshed based on a buffer window
 * Default buffer: 10 minutes
 */
export function shouldRefreshToken(
  tokenExpiresAt: string | null | undefined,
  bufferMs = 10 * 60 * 1000
): boolean {
  if (!tokenExpiresAt) return false;
  const expiresAtMs = new Date(tokenExpiresAt).getTime();
  const now = Date.now();
  return expiresAtMs > now && expiresAtMs <= now + bufferMs;
}

/**
 * Refresh X/Twitter access token using refresh token
 * According to X OAuth 2.0 docs: https://docs.x.com/fundamentals/authentication/oauth-2-0/authorization-code
 */
export async function refreshXToken(accountId: string) {
  try {
    // Fetch account with refresh token
    const { data: account, error: fetchError } = await supabaseAdmin
      .from("connected_accounts")
      .select("id, platform, refresh_token, user_id")
      .eq("id", accountId)
      .eq("platform", "twitter") // Database uses "twitter" enum
      .eq("status", "connected")
      .single();

    if (fetchError || !account) {
      console.error("Error fetching account for refresh:", fetchError);
      return { success: false, error: "Account not found or not connected" };
    }

    if (!account.refresh_token) {
      return { success: false, error: "No refresh token available" };
    }

    // Get X OAuth credentials
    const clientId = process.env.TWITTER_CLIENT_ID;
    const clientSecret = process.env.TWITTER_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return { success: false, error: "X OAuth credentials not configured" };
    }

    // Refresh token using X API
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
      console.error("X token refresh error:", {
        status: tokenResponse.status,
        statusText: tokenResponse.statusText,
        error: errorText,
        accountId: account.id,
      });
      
      // If refresh token is invalid/expired, mark account as expired
      if (tokenResponse.status === 400 || tokenResponse.status === 401) {
        console.log("Marking account as expired due to invalid refresh token:", {
          accountId,
          platform: account.platform,
          userId: account.user_id,
        });
        
        const { error: updateError, data: updatedAccount } = await supabaseAdmin
          .from("connected_accounts")
          .update({
            status: "expired",
            updated_at: new Date().toISOString(),
          })
          .eq("id", accountId)
          .select("status"); // Select to verify update

        if (updateError) {
          console.error("Error marking account as expired:", updateError);
        } else {
          const actualStatus = updatedAccount?.[0]?.status;
          console.log("Account status after marking as expired:", {
            accountId,
            status: actualStatus,
            expected: "expired",
            match: actualStatus === "expired",
          });
        }

        // Log activity
        const { error: activityError } = await supabaseAdmin.from("activity_log").insert({
          user_id: account.user_id,
          activity_type: "account_disconnected",
          description: "X account refresh token expired - reconnect required",
          metadata: {
            platform: "twitter",
            reason: "refresh_token_expired",
            error: errorText,
          },
        } as any);

        if (activityError) {
          console.error("Error logging activity for expired token:", activityError);
        }
      }

      return { success: false, error: "Refresh token expired. Please reconnect your X account." };
    }

    const tokenData = await tokenResponse.json();
    const { access_token, refresh_token, expires_in } = tokenData;

    if (!access_token) {
      return { success: false, error: "No access token in refresh response" };
    }

    // Calculate new expiration
    const expiresAt = expires_in
      ? new Date(Date.now() + expires_in * 1000).toISOString()
      : null;

    // Update account with new tokens
    const updateData: any = {
      access_token: access_token,
      token_expires_at: expiresAt,
      updated_at: new Date().toISOString(),
    };

    // Update refresh token if a new one was provided
    if (refresh_token) {
      updateData.refresh_token = refresh_token;
    }

    const { error: updateError } = await supabaseAdmin
      .from("connected_accounts")
      .update(updateData)
      .eq("id", accountId);

    if (updateError) {
      console.error("Error updating refreshed token:", updateError);
      return { success: false, error: "Failed to update token in database" };
    }

    console.log(`Successfully refreshed X token for account ${accountId}`);
    return { success: true, expiresAt };
  } catch (error: any) {
    console.error("Error refreshing X token:", error);
    return { success: false, error: error.message || "Unknown error" };
  }
}

/**
 * Check and refresh X tokens that are expiring soon
 * This can be called on-demand (e.g., when user visits settings page)
 */
export async function refreshExpiringTokens(userId?: string, bufferMs = 10 * 60 * 1000) {
  try {
    // Fetch all X accounts with refresh tokens that are expiring soon
    let query = supabaseAdmin
      .from("connected_accounts")
      .select("id, platform, token_expires_at, refresh_token, user_id, updated_at")
      .eq("platform", "twitter")
      .eq("status", "connected")
      .not("refresh_token", "is", null)
      .not("token_expires_at", "is", null);

    if (userId) {
      query = query.eq("user_id", userId);
    }

    const { data: accounts, error } = await query;

    if (error) {
      console.error("Error fetching accounts for refresh:", error);
      return { refreshed: 0, errors: [] };
    }

    if (!accounts || accounts.length === 0) {
      return { refreshed: 0, errors: [] };
    }

    // Filter out accounts that were just updated (within last 2 minutes) to avoid race conditions
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
    const accountsToRefresh = accounts.filter(account => {
      if (!account.updated_at) return true; // Include if no updated_at
      const updatedAt = new Date(account.updated_at);
      return updatedAt < twoMinutesAgo; // Only include if updated more than 2 minutes ago
    });

    if (accountsToRefresh.length === 0) {
      console.log("Skipping token refresh - all accounts were recently updated");
      return { refreshed: 0, errors: [] };
    }

    const errors: any[] = [];
    let refreshed = 0;

    for (const account of accountsToRefresh) {
      if (shouldRefreshToken(account.token_expires_at, bufferMs)) {
        const result = await refreshXToken(account.id);
        if (result.success) {
          refreshed++;
        } else {
          errors.push({ accountId: account.id, error: result.error });
        }
      }
    }

    return { refreshed, errors };
  } catch (error: any) {
    console.error("Error in refreshExpiringTokens:", error);
    return { refreshed: 0, errors: [error] };
  }
}



