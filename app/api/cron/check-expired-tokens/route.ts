import { NextRequest, NextResponse } from "next/server";
import { updateExpiredTokens } from "@/lib/token-expiration";
import { refreshExpiringTokens } from "@/lib/token-refresh";

/**
 * Cron job endpoint to check and update expired tokens
 * 
 * Should be called periodically (e.g., daily) via Vercel Cron or similar
 * 
 * Example Vercel Cron config (vercel.json):
 * {
 *   "crons": [{
 *     "path": "/api/cron/check-expired-tokens",
 *     "schedule": "0 0 * * *" // Daily at midnight
 *   }]
 * }
 */
export async function GET(request: NextRequest) {
  try {
    // Optional: Add authentication/authorization check
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.log("Checking for expired tokens and refreshing expiring ones...");
    const expireResult = await updateExpiredTokens();
    const refreshResult = await refreshExpiringTokens(undefined, 10 * 60 * 1000); // 10-minute buffer

    return NextResponse.json({
      success: true,
      expiredUpdated: expireResult.updated,
      expiredErrors: expireResult.errors.length,
      refreshed: refreshResult.refreshed,
      refreshErrors: refreshResult.errors.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Error in check-expired-tokens cron:", error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}



