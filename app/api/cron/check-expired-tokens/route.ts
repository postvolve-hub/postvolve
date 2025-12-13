import { NextRequest, NextResponse } from "next/server";
import { updateExpiredTokens } from "@/lib/token-expiration";
import { refreshExpiringTokens } from "@/lib/token-refresh";

/**
 * Cron job endpoint to check and update expired tokens
 * 
 * Called by Supabase pg_cron via pg_net extension (POST request)
 * Also supports GET for manual testing
 */
async function handleCronRequest(request: NextRequest) {
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
    // IMPORTANT: Run refresh FIRST, then mark as expired
    // This ensures we try to refresh tokens before marking them as expired
    // Using 40-minute buffer for better reliability (tokens expire in 2 hours)
    const refreshResult = await refreshExpiringTokens(undefined, 40 * 60 * 1000); // 40-minute buffer
    const expireResult = await updateExpiredTokens();
    
    // Log comprehensive metrics
    console.log("Token refresh cron job completed:", {
      refreshed: refreshResult.refreshed,
      refreshErrors: refreshResult.errors.length,
      skipped: refreshResult.skipped,
      total: refreshResult.total,
      successRate: `${refreshResult.metrics.successRate.toFixed(2)}%`,
      duration: `${(refreshResult.metrics.durationMs / 1000).toFixed(2)}s`,
      expiredUpdated: expireResult.updated,
      expiredErrors: expireResult.errors.length,
    });
    
    return NextResponse.json({
      success: true,
      expiredUpdated: expireResult.updated,
      expiredErrors: expireResult.errors.length,
      refreshed: refreshResult.refreshed,
      refreshErrors: refreshResult.errors.length,
      refreshSkipped: refreshResult.skipped,
      refreshTotal: refreshResult.total,
      refreshSuccessRate: refreshResult.metrics.successRate,
      refreshDurationMs: refreshResult.metrics.durationMs,
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

// Support both GET (for manual testing) and POST (for Supabase pg_net)
export async function GET(request: NextRequest) {
  return handleCronRequest(request);
}

export async function POST(request: NextRequest) {
  return handleCronRequest(request);
}



