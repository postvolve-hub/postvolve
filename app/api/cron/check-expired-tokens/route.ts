import { NextRequest, NextResponse } from "next/server";
import { updateExpiredTokens } from "@/lib/token-expiration";

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
    // Verify this is a Vercel cron request
    // Vercel sends x-vercel-cron header for scheduled cron jobs
    const isVercelCron = request.headers.get("x-vercel-cron") === "1";
    
    // Optional: Additional security check with CRON_SECRET for manual calls
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;
    
    // Allow if it's a Vercel cron request OR if CRON_SECRET matches (for manual testing)
    if (!isVercelCron) {
      if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        );
      }
    }

    console.log("Checking for expired tokens...");
    const result = await updateExpiredTokens();
    
    return NextResponse.json({
      success: true,
      updated: result.updated,
      errors: result.errors.length,
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

