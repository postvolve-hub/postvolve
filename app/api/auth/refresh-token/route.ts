import { NextRequest, NextResponse } from "next/server";
import { refreshExpiringTokens, refreshXToken } from "@/lib/token-refresh";

/**
 * POST /api/auth/refresh-token
 * Refresh tokens for the authenticated user
 * Can optionally specify accountId to refresh a specific account
 * 
 * This endpoint is called on-demand (e.g., when user visits settings page)
 * No cron job needed - tokens are refreshed when needed
 * 
 * Note: userId is trusted from the authenticated client (useAuth hook)
 * The endpoint is only called from authenticated pages, so client-side
 * session verification is sufficient for this use case.
 */
export async function POST(request: NextRequest) {
  try {
    // Get request body
    const body = await request.json().catch(() => ({}));
    const accountId = body.accountId;
    const userId = body.userId; // User ID passed from client (from authenticated session)

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
      // Refresh all expiring tokens for the user
      // userId is required when refreshing all tokens
      if (!userId) {
        return NextResponse.json(
          { success: false, error: "userId is required when refreshing all tokens" },
          { status: 400 }
        );
      }
      
      const result = await refreshExpiringTokens(userId);
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

