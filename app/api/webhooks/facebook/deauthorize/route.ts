import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseServer";
import crypto from "crypto";

/**
 * Facebook Deauthorize Callback
 * 
 * This endpoint handles Facebook's deauthorization requests.
 * When a user disconnects your app from Facebook, Facebook will call this endpoint.
 * 
 * Documentation: https://developers.facebook.com/docs/facebook-login/security/#deauthorize_callback
 * 
 * Request format:
 * POST with form data containing:
 * - signed_request: A signed request containing user_id
 */

/**
 * Parse and verify Facebook signed_request
 * 
 * @param signedRequest - The signed_request parameter from Facebook
 * @param appSecret - Facebook App Secret (can be Login or Pages app)
 * @returns Parsed data if valid, null if invalid
 */
function parseSignedRequest(signedRequest: string, appSecret: string): any {
  try {
    const [encodedSig, payload] = signedRequest.split(".");
    
    if (!encodedSig || !payload) {
      return null;
    }

    // Decode the signature
    const sig = Buffer.from(encodedSig.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("hex");
    
    // Decode the payload
    const data = JSON.parse(
      Buffer.from(payload.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf-8")
    );

    // Verify the signature
    const expectedSig = crypto
      .createHmac("sha256", appSecret)
      .update(payload)
      .digest("hex");

    if (sig !== expectedSig) {
      console.error("Invalid signed_request signature");
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error parsing signed_request:", error);
    return null;
  }
}

/**
 * Handle Facebook account deauthorization
 * 
 * @param facebookUserId - Facebook user ID
 * @returns Success status
 */
async function handleDeauthorization(facebookUserId: string): Promise<boolean> {
  try {
    // Find the connected account(s) for this Facebook user
    // Could be from Facebook Login app or Facebook Pages app
    const { data: connectedAccounts, error: accountError } = await supabaseAdmin
      .from("connected_accounts")
      .select("id, user_id, platform")
      .eq("platform", "facebook")
      .eq("platform_user_id", facebookUserId);

    if (accountError) {
      console.error("Error finding connected accounts:", accountError);
      return false;
    }

    if (!connectedAccounts || connectedAccounts.length === 0) {
      // Account not found, but we still confirm deauthorization
      console.log(`Facebook user ${facebookUserId} not found in database, confirming deauthorization anyway`);
      return true;
    }

    // Update all Facebook accounts to disconnected status
    for (const account of connectedAccounts) {
      const { error: updateError } = await supabaseAdmin
        .from("connected_accounts")
        .update({
          status: "disconnected",
          access_token: null,
          refresh_token: null,
          token_expires_at: null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", account.id);

      if (updateError) {
        console.error(`Error updating account ${account.id}:`, updateError);
      } else {
        console.log(`Successfully deauthorized account ${account.id} for user ${account.user_id}`);
        
        // Log activity
        await supabaseAdmin.from("activity_log").insert({
          user_id: account.user_id,
          activity_type: "account_disconnected",
          description: "Facebook account deauthorized",
          metadata: {
            platform: "facebook",
            platform_user_id: facebookUserId,
            deauthorized_via: "webhook",
          },
        } as any);
      }
    }

    return true;
  } catch (error) {
    console.error("Error handling deauthorization:", error);
    return false;
  }
}

/**
 * POST /api/webhooks/facebook/deauthorize
 * 
 * Handles Facebook deauthorization requests
 */
export async function POST(request: NextRequest) {
  try {
    // Try both app secrets (Login and Pages apps might use different secrets)
    // Facebook will send the signed_request with the app that was deauthorized
    const loginAppSecret = process.env.FACEBOOK_LOGIN_APP_SECRET;
    const pagesAppSecret = process.env.FACEBOOK_PAGES_APP_SECRET;

    if (!loginAppSecret && !pagesAppSecret) {
      console.error("No Facebook app secrets configured");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Get form data
    const formData = await request.formData();
    const signedRequest = formData.get("signed_request") as string;

    if (!signedRequest) {
      return NextResponse.json(
        { error: "Missing signed_request parameter" },
        { status: 400 }
      );
    }

    // Try to parse with Login app secret first, then Pages app secret
    let data = null;
    if (loginAppSecret) {
      data = parseSignedRequest(signedRequest, loginAppSecret);
    }
    
    if (!data && pagesAppSecret) {
      data = parseSignedRequest(signedRequest, pagesAppSecret);
    }

    if (!data || !data.user_id) {
      return NextResponse.json(
        { error: "Invalid signed_request" },
        { status: 400 }
      );
    }

    const facebookUserId = data.user_id;

    console.log(`Received deauthorization request for Facebook user: ${facebookUserId}`);

    // Handle deauthorization
    const success = await handleDeauthorization(facebookUserId);

    if (!success) {
      // Still return 200 to Facebook, but log the error
      console.error(`Failed to deauthorize Facebook user: ${facebookUserId}`);
    }

    // Facebook expects a 200 response
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error processing Facebook deauthorization:", error);
    
    // Always return 200 to Facebook, even on error
    // Facebook will retry if needed
    return NextResponse.json({ success: true });
  }
}

/**
 * GET /api/webhooks/facebook/deauthorize
 * 
 * Health check endpoint
 */
export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Facebook deauthorization webhook endpoint",
    endpoint: "/api/webhooks/facebook/deauthorize",
    method: "POST",
    requiredParams: ["signed_request"],
    requiredEnvVars: ["FACEBOOK_LOGIN_APP_SECRET", "FACEBOOK_PAGES_APP_SECRET"],
    envVarsSet: {
      FACEBOOK_LOGIN_APP_SECRET: !!process.env.FACEBOOK_LOGIN_APP_SECRET,
      FACEBOOK_PAGES_APP_SECRET: !!process.env.FACEBOOK_PAGES_APP_SECRET,
    },
  });
}




