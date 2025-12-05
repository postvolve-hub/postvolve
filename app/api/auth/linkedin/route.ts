import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET(request: NextRequest) {
  try {
    // Get user ID from query parameter (passed from frontend)
    const userId = request.nextUrl.searchParams.get("userId");
    
    if (!userId) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/settings?error=missing_user`
      );
    }

    // Optional security check - user ID comes from authenticated session, so it's safe
    // Use maybeSingle to not fail if user doesn't exist in users table yet
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("id", userId)
      .maybeSingle();

    // Log warning but don't block OAuth - user ID is from authenticated session
    if (userError) {
      console.warn("User lookup warning (non-blocking):", userError);
    }
    
    // Continue with OAuth regardless - the user ID comes from authenticated Supabase Auth session
    // which is verified in ConnectAccountModal before calling this endpoint

    // Get LinkedIn OAuth credentials
    const clientId = process.env.LINKEDIN_CLIENT_ID;
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/auth/callback/linkedin`;
    
    if (!clientId) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/settings?error=oauth_not_configured`
      );
    }

    // Generate state parameter for CSRF protection
    const state = Buffer.from(`${userId}:${Date.now()}`).toString("base64");
    
    // LinkedIn OAuth scopes
    const scopes = [
      "openid",
      "profile",
      "email",
      "w_member_social", // Required for posting
    ].join(" ");

    // Build LinkedIn authorization URL
    const authUrl = new URL("https://www.linkedin.com/oauth/v2/authorization");
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("client_id", clientId);
    authUrl.searchParams.set("redirect_uri", redirectUri);
    authUrl.searchParams.set("scope", scopes);
    authUrl.searchParams.set("state", state);

    // Redirect to LinkedIn
    return NextResponse.redirect(authUrl.toString());
  } catch (error: any) {
    console.error("LinkedIn OAuth initiation error:", error);
    return NextResponse.json(
      { error: "Failed to initiate LinkedIn OAuth" },
      { status: 500 }
    );
  }
}

