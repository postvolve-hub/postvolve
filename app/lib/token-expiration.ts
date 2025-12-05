/**
 * Token Expiration Helper Functions
 * 
 * Handles checking and updating expired OAuth tokens for connected accounts
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
 * Check if a token is expired or expiring soon
 */
export function checkTokenExpiration(tokenExpiresAt: string | null | undefined) {
  if (!tokenExpiresAt) return { isExpired: false, expiresSoon: false, daysUntilExpiry: null };
  
  const expiresAt = new Date(tokenExpiresAt);
  const now = new Date();
  const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  
  const isExpired = expiresAt < now;
  const expiresSoon = !isExpired && expiresAt < sevenDaysFromNow;
  const daysUntilExpiry = Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  return { isExpired, expiresSoon, daysUntilExpiry };
}

/**
 * Update expired tokens status in database
 * This should be called periodically (e.g., via cron job)
 */
export async function updateExpiredTokens() {
  try {
    // Fetch all connected accounts with tokens
    const { data: accounts, error } = await supabaseAdmin
      .from("connected_accounts")
      .select("id, platform, token_expires_at, status, user_id")
      .eq("status", "connected")
      .not("token_expires_at", "is", null);

    if (error) {
      console.error("Error fetching accounts for expiration check:", error);
      return { updated: 0, errors: [] };
    }

    if (!accounts || accounts.length === 0) {
      return { updated: 0, errors: [] };
    }

    const errors: any[] = [];
    let updated = 0;

    for (const account of accounts) {
      const { isExpired } = checkTokenExpiration(account.token_expires_at);
      
      if (isExpired) {
        // Update status to expired
        const { error: updateError } = await supabaseAdmin
          .from("connected_accounts")
          .update({ 
            status: "expired",
            updated_at: new Date().toISOString(),
          })
          .eq("id", account.id);

        if (updateError) {
          console.error(`Error updating expired token for ${account.platform} (${account.id}):`, updateError);
          errors.push({ accountId: account.id, platform: account.platform, error: updateError });
        } else {
          updated++;
          console.log(`Updated ${account.platform} account (${account.id}) to expired status`);
          
          // Log activity
          const { error: activityError } = await supabaseAdmin.from("activity_log").insert({
            user_id: account.user_id,
            activity_type: "account_disconnected",
            description: `${account.platform} account token expired`,
            metadata: { 
              platform: account.platform,
              reason: "token_expired",
            },
          } as any);

          if (activityError) {
            console.error("Error logging expiration activity:", activityError);
            // Don't fail the whole flow if activity logging fails
          }
        }
      }
    }

    return { updated, errors };
  } catch (error: any) {
    console.error("Error in updateExpiredTokens:", error);
    return { updated: 0, errors: [error] };
  }
}

/**
 * Check if a specific account's token is expired
 */
export async function checkAccountTokenExpiration(accountId: string) {
  try {
    const { data: account, error } = await supabaseAdmin
      .from("connected_accounts")
      .select("id, platform, token_expires_at, status")
      .eq("id", accountId)
      .single();

    if (error || !account) {
      return { isExpired: false, error };
    }

    const { isExpired } = checkTokenExpiration(account.token_expires_at);
    
    if (isExpired && account.status === "connected") {
      // Update status to expired
      await supabaseAdmin
        .from("connected_accounts")
        .update({ 
          status: "expired",
          updated_at: new Date().toISOString(),
        })
        .eq("id", accountId);
    }

    return { isExpired, error: null };
  } catch (error: any) {
    console.error("Error checking account token expiration:", error);
    return { isExpired: false, error };
  }
}

