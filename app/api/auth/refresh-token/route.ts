import { NextRequest, NextResponse } from "next/server";
import { refreshExpiringTokens, refreshXToken } from "@/lib/token-refresh";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * POST /api/auth/refresh-token
 * Refresh tokens for the authenticated user
 * Can optionally specify accountId to refresh a specific account
 * 
 * This endpoint is called on-demand (e.g., when user visits settings page)
 * No cron job needed - tokens are refreshed when needed
 */
export async function POST(request: NextRequest) {
  try {
    // Get request body
    const body = await request.json().catch(() => ({}));
    const accountId = body.accountId;
    const userId = body.userId; // User ID passed from client (from authenticated session)

    // Create Supabase client for auth check
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Verify user is authenticated (if userId provided)
    if (userId) {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error || !user || user.id !== userId) {
          return NextResponse.json(
            { success: false, error: "Authentication failed" },
            { status: 401 }
          );
        }
      } catch (error) {
        return NextResponse.json(
          { success: false, error: "Authentication required" },
          { status: 401 }
        );
      }
    }

    if (accountId) {
      // Refresh specific account
      const result = await refreshXToken(accountId);
      if (result.success) {
        return NextResponse.json({ 
          success: true, 
          message: "Token refreshed successfully",
          expiresAt: result.expiresAt,
        });
      } else {
        return NextResponse.json(
          { success: false, error: result.error },
          { status: 400 }
        );
      }
    } else {
      // Refresh all expiring tokens for the user (or all users if no userId)
      const result = await refreshExpiringTokens(userId || undefined);
      return NextResponse.json({
        success: true,
        refreshed: result.refreshed,
        errors: result.errors,
      });
    }
  } catch (error: any) {
    console.error("Error in refresh-token endpoint:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to refresh token" },
      { status: 500 }
    );
  }
}

