import { NextRequest, NextResponse } from "next/server";
import { refreshXToken } from "@/lib/token-refresh";

/**
 * POST /api/auth/refresh-token
 * 
 * Refreshes an OAuth token for a specific account
 * Can be called manually or by cron jobs
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { accountId } = body;

    if (!accountId) {
      return NextResponse.json(
        { error: "accountId is required" },
        { status: 400 }
      );
    }

    const result = await refreshXToken(accountId);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error?.message || "Failed to refresh token" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      expiresAt: result.expiresAt,
    });
  } catch (error: any) {
    console.error("Error in refresh-token endpoint:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

