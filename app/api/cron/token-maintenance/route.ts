import { NextRequest, NextResponse } from "next/server";
import { updateExpiredTokens } from "@/lib/token-expiration";
import { refreshAllXTokens } from "@/lib/token-refresh";

/**
 * GET /api/cron/token-maintenance
 * 
 * Unified cron job that handles both:
 * 1. Checking and updating expired tokens (all platforms)
 * 2. Refreshing X tokens that are expiring soon
 * 
 * Runs every 6 hours to handle both tasks efficiently.
 * Both tasks are idempotent and safe to run multiple times.
 * 
 * Optional: CRON_SECRET for security
 */
export async function GET(request: NextRequest) {
  try {
    // Verify this is a Vercel cron request
    // Vercel sends x-vercel-cron header for scheduled cron jobs
    const isVercelCron = request.headers.get("x-vercel-cron") === "1";
    
    // Optional: Additional security check with CRON_SECRET for manual calls
    const cronSecret = request.headers.get("authorization");
    const expectedSecret = process.env.CRON_SECRET;

    // Allow if it's a Vercel cron request OR if CRON_SECRET matches (for manual testing)
    if (!isVercelCron) {
      if (expectedSecret && cronSecret !== `Bearer ${expectedSecret}`) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        );
      }
    }

    console.log("Starting token maintenance tasks...");
    
    // Run both tasks in parallel for efficiency
    const [expiredResult, refreshResult] = await Promise.all([
      updateExpiredTokens(),
      refreshAllXTokens(),
    ]);

    console.log("Token maintenance complete:", {
      expiredUpdated: expiredResult.updated,
      refreshed: refreshResult.refreshed,
      failed: refreshResult.failed,
    });

    return NextResponse.json({
      success: true,
      tasks: {
        expiredTokens: {
          updated: expiredResult.updated,
          errors: expiredResult.errors.length,
        },
        tokenRefresh: {
          refreshed: refreshResult.refreshed,
          failed: refreshResult.failed,
          errors: refreshResult.errors.length,
        },
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Error in token-maintenance cron job:", error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message || "Internal server error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

