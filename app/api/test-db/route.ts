// =====================================================
// Database Test API Route
// =====================================================
// Visit /api/test-db to run database connection tests
// This should only be used in development!
// =====================================================

import { NextResponse } from "next/server";
import { runAllTests } from "@/lib/test-db-connection";

export async function GET() {
  // Only allow in development
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Database tests are disabled in production" },
      { status: 403 }
    );
  }

  try {
    const results = await runAllTests();
    
    return NextResponse.json({
      success: results.allPassed,
      message: results.allPassed 
        ? "All database tests passed! ✅" 
        : "Some tests failed. Check the details below.",
      results: results.results,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Database test error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

