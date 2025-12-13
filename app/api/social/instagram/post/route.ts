import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing Supabase configuration for Instagram post tester:", {
    hasUrl: !!supabaseUrl,
    hasServiceRoleKey: !!serviceRoleKey,
  });
}

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

/**
 * POST /api/social/instagram/post
 * Body: { userId: string, message: string, imageUrl?: string }
 * Test helper to post to Instagram Business account.
 * Uses the stored access_token (long-lived IG token) in connected_accounts.
 * 
 * Note: Instagram requires an image. If imageUrl is not provided, this will fail.
 * For testing, you can use a publicly accessible image URL.
 */
export async function POST(request: NextRequest) {
  try {
    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({ error: "oauth_not_configured" }, { status: 500 });
    }

    const body = await request.json().catch(() => null);
    const userId = body?.userId as string | undefined;
    const message = body?.message as string | undefined;
    const imageUrl = body?.imageUrl as string | undefined;

    if (!userId || !message) {
      return NextResponse.json({ error: "missing_params" }, { status: 400 });
    }

    // Fetch stored Instagram token
    const { data: account, error: accountError } = await supabaseAdmin
      .from("connected_accounts")
      .select("access_token, status, platform_user_id")
      .eq("user_id", userId)
      .eq("platform", "instagram")
      .maybeSingle();

    if (accountError) {
      console.error("Instagram post: DB error", accountError);
      return NextResponse.json({ error: "database_error" }, { status: 500 });
    }

    if (!account?.access_token) {
      return NextResponse.json({ error: "no_instagram_account" }, { status: 404 });
    }

    if (account.status !== "connected") {
      return NextResponse.json({ error: "account_not_connected", status: account.status }, { status: 403 });
    }

    const accessToken = account.access_token;
    const igUserId = account.platform_user_id; // Instagram Business Account ID

    // Instagram Graph API - Create a media container first
    // Step 1: Create media container
    const containerData: any = {
      caption: message,
      access_token: accessToken,
    };

    // Instagram requires an image URL
    if (imageUrl) {
      containerData.image_url = imageUrl;
    } else {
      // For testing, you might want to use a default image
      // Or return an error requiring an image
      return NextResponse.json({ 
        error: "image_required", 
        message: "Instagram posts require an image. Please provide imageUrl in the request body."
      }, { status: 400 });
    }

    // Create media container
    const containerResp = await fetch(
      `https://graph.facebook.com/v21.0/${igUserId}/media`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(containerData),
      }
    );

    const containerText = await containerResp.text();
    if (!containerResp.ok) {
      console.error("Instagram post: container creation failed", containerText);
      return NextResponse.json({ 
        error: "container_creation_failed", 
        details: containerText,
        status: containerResp.status 
      }, { status: 502 });
    }

    let containerResult;
    try {
      containerResult = JSON.parse(containerText);
    } catch {
      return NextResponse.json({ 
        error: "invalid_container_response", 
        details: containerText 
      }, { status: 502 });
    }

    const creationId = containerResult.id;
    if (!creationId) {
      return NextResponse.json({ 
        error: "no_creation_id", 
        details: containerResult 
      }, { status: 502 });
    }

    // Step 2: Publish the media container
    const publishResp = await fetch(
      `https://graph.facebook.com/v21.0/${igUserId}/media_publish`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          creation_id: creationId,
          access_token: accessToken,
        }),
      }
    );

    const publishText = await publishResp.text();
    if (!publishResp.ok) {
      console.error("Instagram post: publish failed", publishText);
      return NextResponse.json({ 
        error: "publish_failed", 
        details: publishText,
        status: publishResp.status 
      }, { status: 502 });
    }

    let publishResult;
    try {
      publishResult = JSON.parse(publishText);
    } catch {
      publishResult = { id: publishText };
    }

    return NextResponse.json({ 
      success: true, 
      result: publishResult,
      creationId 
    });
  } catch (error: any) {
    console.error("Instagram post: unexpected error", error);
    return NextResponse.json({ 
      error: "unexpected_error", 
      details: error?.message 
    }, { status: 500 });
  }
}

