import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseServer";
import crypto from "crypto";

/**
 * Facebook User Data Deletion Callback
 * 
 * This endpoint handles Facebook's user data deletion requests.
 * When a user requests data deletion from Facebook, Facebook will call this endpoint.
 * 
 * Documentation: https://developers.facebook.com/docs/apps/delete-data
 * 
 * Request format:
 * POST with form data containing:
 * - signed_request: A signed request containing user_id and algorithm
 * 
 * Response format:
 * JSON with confirmation_code (URL to a page confirming deletion)
 */

/**
 * Parse and verify Facebook signed_request
 * 
 * @param signedRequest - The signed_request parameter from Facebook
 * @param appSecret - Facebook App Secret
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
 * Delete all user data associated with a Facebook user
 * 
 * @param facebookUserId - Facebook user ID
 * @returns Success status
 */
async function deleteUserData(facebookUserId: string): Promise<boolean> {
  try {
    // Find the user in our database by matching Facebook user_id in connected_accounts
    const { data: connectedAccount, error: accountError } = await supabaseAdmin
      .from("connected_accounts")
      .select("user_id")
      .eq("platform", "facebook")
      .eq("platform_user_id", facebookUserId)
      .maybeSingle();

    if (accountError) {
      console.error("Error finding connected account:", accountError);
      return false;
    }

    if (!connectedAccount) {
      // User not found in our system, but we still confirm deletion
      console.log(`Facebook user ${facebookUserId} not found in database, confirming deletion anyway`);
      return true;
    }

    const userId = connectedAccount.user_id;

    console.log(`Deleting data for user ${userId} (Facebook ID: ${facebookUserId})`);

    // Delete in order (respecting foreign key constraints)
    // Note: Most tables have ON DELETE CASCADE, but we'll be explicit

    // 1. Delete connected_accounts (Facebook account)
    const { error: deleteAccountError } = await supabaseAdmin
      .from("connected_accounts")
      .delete()
      .eq("user_id", userId)
      .eq("platform", "facebook");

    if (deleteAccountError) {
      console.error("Error deleting connected account:", deleteAccountError);
    }

    // 2. Delete posts (CASCADE will handle post_platforms)
    const { error: deletePostsError } = await supabaseAdmin
      .from("posts")
      .delete()
      .eq("user_id", userId);

    if (deletePostsError) {
      console.error("Error deleting posts:", deletePostsError);
    }

    // 3. Delete posting_schedules
    const { error: deleteSchedulesError } = await supabaseAdmin
      .from("posting_schedules")
      .delete()
      .eq("user_id", userId);

    if (deleteSchedulesError) {
      console.error("Error deleting posting schedules:", deleteSchedulesError);
    }

    // 4. Delete user_settings
    const { error: deleteSettingsError } = await supabaseAdmin
      .from("user_settings")
      .delete()
      .eq("user_id", userId);

    if (deleteSettingsError) {
      console.error("Error deleting user settings:", deleteSettingsError);
    }

    // 5. Delete subscriptions
    const { error: deleteSubscriptionsError } = await supabaseAdmin
      .from("subscriptions")
      .delete()
      .eq("user_id", userId);

    if (deleteSubscriptionsError) {
      console.error("Error deleting subscriptions:", deleteSubscriptionsError);
    }

    // 6. Delete activity_log entries
    const { error: deleteActivityError } = await supabaseAdmin
      .from("activity_log")
      .delete()
      .eq("user_id", userId);

    if (deleteActivityError) {
      console.error("Error deleting activity log:", deleteActivityError);
    }

    // 7. Delete usage_tracking entries
    const { error: deleteUsageError } = await supabaseAdmin
      .from("usage_tracking")
      .delete()
      .eq("user_id", userId);

    if (deleteUsageError) {
      console.error("Error deleting usage tracking:", deleteUsageError);
    }

    // 8. Delete invoices
    const { error: deleteInvoicesError } = await supabaseAdmin
      .from("invoices")
      .delete()
      .eq("user_id", userId);

    if (deleteInvoicesError) {
      console.error("Error deleting invoices:", deleteInvoicesError);
    }

    // 9. Finally, delete the user record
    // Note: This will also delete auth.users via CASCADE if the user was created via Facebook Login
    // But we'll only delete if the user was created via Facebook Login
    // For now, we'll leave the user record and let them delete it manually if needed
    // Or we can check if they have other connected accounts first

    // Check if user has other connected accounts
    const { data: otherAccounts } = await supabaseAdmin
      .from("connected_accounts")
      .select("id")
      .eq("user_id", userId)
      .limit(1);

    // If no other connected accounts, we could delete the user
    // But for safety, we'll leave the user record and just delete Facebook-specific data
    // The user can delete their account manually if they want

    console.log(`Successfully deleted data for user ${userId} (Facebook ID: ${facebookUserId})`);
    return true;
  } catch (error) {
    console.error("Error deleting user data:", error);
    return false;
  }
}

/**
 * POST /api/webhooks/facebook/user-deletion
 * 
 * Handles Facebook user data deletion requests
 */
export async function POST(request: NextRequest) {
  try {
    // Get App Secret from environment
    const appSecret = process.env.FACEBOOK_LOGIN_APP_SECRET;
    
    if (!appSecret) {
      console.error("FACEBOOK_LOGIN_APP_SECRET not configured");
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

    // Parse and verify signed_request
    const data = parseSignedRequest(signedRequest, appSecret);

    if (!data || !data.user_id) {
      return NextResponse.json(
        { error: "Invalid signed_request" },
        { status: 400 }
      );
    }

    const facebookUserId = data.user_id;

    console.log(`Received deletion request for Facebook user: ${facebookUserId}`);

    // Delete user data
    const success = await deleteUserData(facebookUserId);

    if (!success) {
      // Still return 200 to Facebook, but log the error
      console.error(`Failed to delete data for Facebook user: ${facebookUserId}`);
    }

    // Return confirmation URL
    // Facebook expects a JSON response with a confirmation_code (URL)
    // This URL should show a page confirming that data has been deleted
    const confirmationUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://postvolve.vercel.app"}/privacy#data-deleted`;

    return NextResponse.json({
      url: confirmationUrl,
      confirmation_code: facebookUserId, // Facebook user ID as confirmation code
    });
  } catch (error: any) {
    console.error("Error processing Facebook user deletion:", error);
    
    // Always return 200 to Facebook, even on error
    // Facebook will retry if needed
    return NextResponse.json({
      url: `${process.env.NEXT_PUBLIC_APP_URL || "https://postvolve.vercel.app"}/privacy#data-deletion-error`,
      confirmation_code: "error",
    });
  }
}

/**
 * GET /api/webhooks/facebook/user-deletion
 * 
 * Health check endpoint
 */
export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Facebook user data deletion webhook endpoint",
    endpoint: "/api/webhooks/facebook/user-deletion",
    method: "POST",
    requiredParams: ["signed_request"],
    requiredEnvVars: ["FACEBOOK_LOGIN_APP_SECRET"],
    envVarsSet: {
      FACEBOOK_LOGIN_APP_SECRET: !!process.env.FACEBOOK_LOGIN_APP_SECRET,
    },
  });
}

