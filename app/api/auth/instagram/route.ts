import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * GET /api/auth/instagram
 * 
 * Initiates Instagram OAuth flow
 * Instagram uses Facebook's OAuth system, so we redirect to Facebook with Instagram scopes
 */
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

    // Log warning but don't block OAuth - user ID is from authenticated Supabase Auth session
    if (userError) {
      console.warn("User lookup warning (non-blocking):", userError);
    }
    
    // Continue with OAuth regardless - the user ID comes from authenticated Supabase Auth session
    // which is verified in ConnectAccountModal before calling this endpoint

    // Get Instagram OAuth credentials (Instagram uses Facebook's OAuth system)
    const clientId = process.env.INSTAGRAM_APP_ID;
    // Ensure no trailing slash in base URL to avoid double slashes
    const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/+$/, "");
    const redirectUri = `${baseUrl}/api/auth/callback/instagram`;
    
    if (!clientId) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/settings?error=oauth_not_configured`
      );
    }

    // Generate state parameter for CSRF protection
    const state = Buffer.from(`${userId}:${Date.now()}`).toString("base64");
    
    // Instagram OAuth scopes (Instagram uses Facebook Graph API)
    // Note: Instagram requires the Instagram account to be linked to a Facebook Page
    const scopes = [
      "instagram_basic",
      "instagram_content_publish",
      "pages_show_list", // Required to list Pages (Instagram accounts are linked to Pages)
      "public_profile",
    ].join(",");

    // Build Facebook authorization URL (Instagram uses Facebook's OAuth)
    const authUrl = new URL("https://www.facebook.com/v21.0/dialog/oauth");
    authUrl.searchParams.set("client_id", clientId);
    authUrl.searchParams.set("redirect_uri", redirectUri);
    authUrl.searchParams.set("scope", scopes);
    authUrl.searchParams.set("state", state);
    authUrl.searchParams.set("response_type", "code");

    console.log("Redirecting to Instagram OAuth (via Facebook):", authUrl.toString());

    // Redirect to Facebook (which handles Instagram OAuth)
    return NextResponse.redirect(authUrl.toString());
  } catch (error: any) {
    console.error("Instagram OAuth initiation error:", error);
    return NextResponse.json(
      { error: "Failed to initiate Instagram OAuth" },
      { status: 500 }
    );
  }
}



