import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing Supabase configuration for X post tester:", {
    hasUrl: !!supabaseUrl,
    hasServiceRoleKey: !!serviceRoleKey,
  });
}

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

/**
 * POST /api/social/x/post
 * Body: { userId: string, message: string }
 * Test helper to post a tweet to X (Twitter).
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

    // Check message length (X limit is 280 characters)
    if (message.length > 280) {
      return NextResponse.json({ 
        error: "message_too_long", 
        maxLength: 280,
        actualLength: message.length 
      }, { status: 400 });
    }

    // Fetch stored X token
    const { data: account, error: accountError } = await supabaseAdmin
      .from("connected_accounts")
      .select("access_token, status")
      .eq("user_id", userId)
      .eq("platform", "twitter") // Database uses "twitter" enum
      .maybeSingle();

    if (accountError) {
      console.error("X post: DB error", accountError);
      return NextResponse.json({ error: "database_error" }, { status: 500 });
    }

    if (!account?.access_token) {
      return NextResponse.json({ error: "no_x_account" }, { status: 404 });
    }

    if (account.status !== "connected") {
      return NextResponse.json({ error: "account_not_connected", status: account.status }, { status: 403 });
    }

    const accessToken = account.access_token;

    // X API v2 - Create a tweet
    const tweetData = {
      text: message,
    };

    const postResp = await fetch("https://api.x.com/2/tweets", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tweetData),
    });

    const postText = await postResp.text();
    if (!postResp.ok) {
      console.error("X post: post failed", postText);
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
      result: postResult 
    });
  } catch (error: any) {
    console.error("X post: unexpected error", error);
    return NextResponse.json({ 
      error: "unexpected_error", 
      details: error?.message 
    }, { status: 500 });
  }
}







