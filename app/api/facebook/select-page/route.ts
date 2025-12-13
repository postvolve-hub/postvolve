import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

/**
 * POST /api/facebook/select-page
 * Body: { userId: string, pageId: string }
 * Saves the selected Facebook Page ID to the connected_accounts metadata
 */
export async function POST(request: NextRequest) {
  try {
    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({ error: "oauth_not_configured" }, { status: 500 });
    }

    const body = await request.json().catch(() => null);
    const userId = body?.userId as string | undefined;
    const pageId = body?.pageId as string | undefined;

    if (!userId || !pageId) {
      return NextResponse.json({ error: "missing_params" }, { status: 400 });
    }

    // Fetch the Facebook account
    const { data: account, error: accountError } = await supabaseAdmin
      .from("connected_accounts")
      .select("id, access_token, metadata")
      .eq("user_id", userId)
      .eq("platform", "facebook")
      .maybeSingle();

    if (accountError) {
      console.error("FB select page: DB error", accountError);
      return NextResponse.json({ error: "database_error" }, { status: 500 });
    }

    if (!account) {
      return NextResponse.json({ error: "no_facebook_account" }, { status: 404 });
    }

    // Fetch pages to verify the page exists and get its token
    const userAccessToken = account.access_token;
    const pagesResp = await fetch(
      `https://graph.facebook.com/v21.0/me/accounts?fields=id,name,access_token&access_token=${userAccessToken}`
    );

    const pagesResponseText = await pagesResp.text();
    let pagesJson: any = {};

    try {
      pagesJson = JSON.parse(pagesResponseText);
    } catch {
      pagesJson = { raw: pagesResponseText };
    }

    if (!pagesResp.ok) {
      console.error("FB select page: pages fetch failed", {
        status: pagesResp.status,
        statusText: pagesResp.statusText,
        error: pagesJson.error || pagesJson,
      });
      return NextResponse.json({ 
        error: "pages_fetch_failed",
        details: pagesJson.error || pagesJson 
      }, { status: 502 });
    }

    // Check for error in response even if status is 200
    if (pagesJson.error) {
      console.error("FB select page: Facebook API error (200 OK but error in body)", {
        error: pagesJson.error,
        type: pagesJson.error.type,
        code: pagesJson.error.code,
        message: pagesJson.error.message,
        error_subcode: pagesJson.error.error_subcode,
        error_user_msg: pagesJson.error.error_user_msg,
      });
      return NextResponse.json({ 
        error: "pages_fetch_failed",
        details: pagesJson.error 
      }, { status: 502 });
    }

    const pages = pagesJson?.data || [];
    console.log(`FB select page: Found ${pages.length} pages`);
    const selectedPage = pages.find((p: any) => p.id === pageId);

    if (!selectedPage) {
      return NextResponse.json({ error: "page_not_found" }, { status: 404 });
    }

    // Update metadata with selected page info
    const currentMetadata = (account.metadata as any) || {};
    const updatedMetadata = {
      ...currentMetadata,
      selected_page_id: pageId,
      selected_page_name: selectedPage.name,
      selected_page_token: selectedPage.access_token,
      pages_count: pages.length,
      last_updated: new Date().toISOString(),
    };

    const { error: updateError } = await supabaseAdmin
      .from("connected_accounts")
      .update({
        metadata: updatedMetadata,
        updated_at: new Date().toISOString(),
      })
      .eq("id", account.id);

    if (updateError) {
      console.error("FB select page: update error", updateError);
      return NextResponse.json({ error: "database_error" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      pageId,
      pageName: selectedPage.name,
    });
  } catch (error: any) {
    console.error("FB select page: unexpected error", error);
    return NextResponse.json(
      { error: "unexpected_error", details: error?.message },
      { status: 500 }
    );
  }
}

