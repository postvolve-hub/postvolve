import { NextRequest, NextResponse } from "next/server";
import { checkUsernameAvailability } from "@/lib/database";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json(
        { error: "Username parameter is required" },
        { status: 400 }
      );
    }

    // Validate username format
    const usernameRegex = /^[a-z0-9_]{3,20}$/;
    if (!usernameRegex.test(username)) {
      return NextResponse.json({
        available: false,
        error: "Username must be 3-20 characters and contain only lowercase letters, numbers, and underscores",
      });
    }

    // Check reserved usernames
    const reservedUsernames = ["admin", "postvolve", "support", "help", "test", "user", "api", "dashboard"];
    if (reservedUsernames.includes(username.toLowerCase())) {
      return NextResponse.json({
        available: false,
        error: "This username is reserved",
      });
    }

    // Check database
    const isAvailable = await checkUsernameAvailability(username);

    return NextResponse.json({
      available: isAvailable,
      username: username,
    });
  } catch (error) {
    console.error("Username check error:", error);
    return NextResponse.json(
      { error: "Failed to check username availability" },
      { status: 500 }
    );
  }
}

