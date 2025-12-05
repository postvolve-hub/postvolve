import { NextRequest, NextResponse } from "next/server";
import { refreshAllXTokens } from "@/lib/token-refresh";

/**
 * GET /api/cron/refresh-tokens
 * 
 * Cron job to automatically refresh X tokens that are expiring soon
 * Should run daily (or every 6 hours)
 * 
 * Optional: CRON_SECRET for security
 */
export async function GET(request: NextRequest) {
  try {
    // Optional: Verify cron secret for security
    const cronSecret = request.headers.get("authorization");
    const expectedSecret = process.env.CRON_SECRET;

    if (expectedSecret && cronSecret !== `Bearer ${expectedSecret}`) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.log("Starting automatic token refresh for X accounts...");
    
    const result = await refreshAllXTokens();

    return NextResponse.json({
      success: true,
      refreshed: result.refreshed,
      failed: result.failed,
      errors: result.errors.length > 0 ? result.errors : undefined,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Error in refresh-tokens cron job:", error);
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

