import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing Supabase configuration for LinkedIn post tester:", {
    hasUrl: !!supabaseUrl,
    hasServiceRoleKey: !!serviceRoleKey,
  });
}

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

/**
 * POST /api/social/linkedin/post
 * Body: { userId: string, message: string }
 * Test helper to post a simple message to LinkedIn.
 * Uses the stored access_token in connected_accounts.
 */
export async function POST(request: NextRequest) {
  try {
    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({ error: "oauth_not_configured" }, { status: 500 });
    }

    const body = await request.json().catch(() => null);
    const userId = body?.userId as string | undefined;
    const message = body?.message as string | undefined;

    if (!userId || !message) {
      return NextResponse.json({ error: "missing_params" }, { status: 400 });
    }

    // Fetch stored LinkedIn token
    const { data: account, error: accountError } = await supabaseAdmin
      .from("connected_accounts")
      .select("access_token, status, platform_user_id")
      .eq("user_id", userId)
      .eq("platform", "linkedin")
      .maybeSingle();

    if (accountError) {
      console.error("LinkedIn post: DB error", accountError);
      return NextResponse.json({ error: "database_error" }, { status: 500 });
    }

    if (!account?.access_token) {
      return NextResponse.json({ error: "no_linkedin_account" }, { status: 404 });
    }

    if (account.status !== "connected") {
      return NextResponse.json({ error: "account_not_connected", status: account.status }, { status: 403 });
    }

    const accessToken = account.access_token;
    const personUrn = account.platform_user_id; // LinkedIn URN format: "urn:li:person:xxxxx"

    // LinkedIn API v2 - Post to user's feed
    // First, we need to get the user's URN in the correct format
    // LinkedIn requires URN format: "urn:li:person:{id}"
    const authorUrn = personUrn?.startsWith("urn:li:person:") 
      ? personUrn 
      : `urn:li:person:${personUrn}`;

    // Create a text post using LinkedIn Share API
    const shareData = {
      author: authorUrn,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: {
            text: message,
          },
          shareMediaCategory: "NONE",
        },
      },
      visibility: {
        "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
      },
    };

    const postResp = await fetch("https://api.linkedin.com/v2/ugcPosts", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0",
      },
      body: JSON.stringify(shareData),
    });

    const postText = await postResp.text();
    if (!postResp.ok) {
      console.error("LinkedIn post: post failed", postText);
      return NextResponse.json({ 
        error: "post_failed", 
        details: postText,
        status: postResp.status 
      }, { status: 502 });
    }

    let postResult;
    try {
      postResult = JSON.parse(postText);
    } catch {
      postResult = { id: postText };
    }

    return NextResponse.json({ 
      success: true, 
      result: postResult,
      authorUrn 
    });
  } catch (error: any) {
    console.error("LinkedIn post: unexpected error", error);
    return NextResponse.json({ 
      error: "unexpected_error", 
      details: error?.message 
    }, { status: 500 });
  }
}







