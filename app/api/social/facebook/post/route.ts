import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing Supabase configuration for Facebook post tester:", {
    hasUrl: !!supabaseUrl,
    hasServiceRoleKey: !!serviceRoleKey,
  });
}

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

/**
 * POST /api/social/facebook/post
 * Body: { userId: string, message: string }
 * Test helper to post a simple message to the user's first Facebook Page.
 * Uses the stored access_token (page token preferred) in connected_accounts.
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

    // Fetch stored Facebook token (we store USER token in access_token)
    const { data: account, error: accountError } = await supabaseAdmin
      .from("connected_accounts")
      .select("access_token, status, metadata")
      .eq("user_id", userId)
      .eq("platform", "facebook")
      .maybeSingle();

    if (accountError) {
      console.error("FB post: DB error", accountError);
      return NextResponse.json({ error: "database_error" }, { status: 500 });
    }

    if (!account?.access_token) {
      return NextResponse.json({ error: "no_facebook_account" }, { status: 404 });
    }

    const userAccessToken = account.access_token; // This is the USER token
    const metadata = (account.metadata as any) || {};

    // Check if a page is selected in metadata
    let pageId: string | null = null;
    let pageToken: string | null = null;
    let pageName: string | null = null;

    if (metadata.selected_page_id && metadata.selected_page_token) {
      // Use selected page from metadata
      pageId = metadata.selected_page_id;
      pageToken = metadata.selected_page_token;
      pageName = metadata.selected_page_name || null;
    } else {
      // Fallback: fetch pages and use first one (for backward compatibility)
      const pagesResp = await fetch(
        `https://graph.facebook.com/v21.0/me/accounts?fields=id,name,access_token&access_token=${userAccessToken}`
      );

      if (!pagesResp.ok) {
        const errText = await pagesResp.text();
        console.error("FB post: pages fetch failed", errText);
        return NextResponse.json({ error: "pages_fetch_failed", details: errText }, { status: 502 });
      }

      const pagesJson = await pagesResp.json();
      const pages = pagesJson?.data || [];
      
      if (!pages.length) {
        return NextResponse.json({ 
          error: "no_pages_found",
          message: "No Facebook Pages found. Please select a page in Settings."
        }, { status: 404 });
      }

      const primaryPage = pages[0];
      pageId = primaryPage.id;
      pageToken = primaryPage.access_token;
      pageName = primaryPage.name;
    }

    if (!pageId || !pageToken) {
      return NextResponse.json({ 
        error: "no_page_selected",
        message: "No Facebook Page selected. Please select a page in Settings."
      }, { status: 404 });
    }

    // Post to the page feed
    const form = new URLSearchParams();
    form.set("message", message);
    form.set("access_token", pageToken);

    const postResp = await fetch(`https://graph.facebook.com/v21.0/${pageId}/feed`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form.toString(),
    });

    const postText = await postResp.text();
    if (!postResp.ok) {
      console.error("FB post: post failed", postText);
      return NextResponse.json({ error: "post_failed", details: postText }, { status: 502 });
    }

    const postResult = await postResp.json().catch(() => ({ id: postText }));

    return NextResponse.json({ 
      success: true, 
      pageId,
      pageName: pageName || "Unknown",
      result: postResult 
    });
  } catch (error: any) {
    console.error("FB post: unexpected error", error);
    return NextResponse.json({ error: "unexpected_error", details: error?.message }, { status: 500 });
  }
}




