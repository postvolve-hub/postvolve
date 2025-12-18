/**
 * GET /api/cron/publish-scheduled
 * POST /api/cron/publish-scheduled
 * 
 * Cron job to automatically publish scheduled posts
 * Runs every 5 minutes via Supabase pg_cron
 * 
 * Finds posts where:
 * - status = 'scheduled'
 * - scheduled_at <= NOW()
 * Publishes them to their selected platforms
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function handleCronRequest(request: NextRequest) {
  try {
    // Optional: Add authentication/authorization check
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('[Publish Scheduled] Starting scheduled post publishing...');
    const now = new Date().toISOString();

    // Find posts that are scheduled and due to be published
    const { data: scheduledPosts, error: fetchError } = await supabaseAdmin
      .from('posts')
      .select(`
        id,
        user_id,
        title,
        content,
        image_url,
        status,
        scheduled_at,
        post_platforms (
          id,
          platform,
          content,
          status
        )
      `)
      .eq('status', 'scheduled')
      .lte('scheduled_at', now)
      .is('deleted_at', null)
      .order('scheduled_at', { ascending: true })
      .limit(50); // Process max 50 posts per run

    if (fetchError) {
      console.error('[Publish Scheduled] Error fetching scheduled posts:', fetchError);
      throw fetchError;
    }

    if (!scheduledPosts || scheduledPosts.length === 0) {
      console.log('[Publish Scheduled] No scheduled posts to publish');
      return NextResponse.json({
        success: true,
        published: 0,
        errors: [],
        message: 'No scheduled posts to publish',
      });
    }

    console.log(`[Publish Scheduled] Found ${scheduledPosts.length} posts to publish`);

    const results: Array<{ postId: string; success: boolean; platforms: string[]; errors: string[] }> = [];
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Process each scheduled post
    for (const post of scheduledPosts) {
      const postId = post.id;
      const userId = post.user_id;
      
      // Get platforms with scheduled status
      let platforms = (post.post_platforms as any[])
        ?.filter((pp: any) => pp.status === 'scheduled')
        .map((pp: any) => pp.platform === 'twitter' ? 'x' : pp.platform) || [];

      // FALLBACK: If no platforms have 'scheduled' status, check for draft/pending platforms
      // This handles cases where post_platforms weren't updated during scheduling
      if (platforms.length === 0) {
        console.warn(`[Publish Scheduled] Post ${postId} has no scheduled platforms, checking for draft/pending...`);
        const fallbackPlatforms = (post.post_platforms as any[])
          ?.filter((pp: any) => pp.status === 'draft' || pp.status === 'pending')
          .map((pp: any) => pp.platform === 'twitter' ? 'x' : pp.platform) || [];
        
        if (fallbackPlatforms.length > 0) {
          console.log(`[Publish Scheduled] Using fallback platforms for post ${postId}: ${fallbackPlatforms.join(', ')}`);
          platforms = fallbackPlatforms;
          
          // Update platform statuses to scheduled for consistency
          await supabaseAdmin
            .from('post_platforms')
            .update({ status: 'scheduled' })
            .eq('post_id', postId)
            .in('status', ['draft', 'pending']);
        }
      }

      if (platforms.length === 0) {
        console.warn(`[Publish Scheduled] Post ${postId} has no platforms to publish to`);
        results.push({
          postId,
          success: false,
          platforms: [],
          errors: ['No platforms selected for publishing'],
        });
        continue;
      }

      try {
        // Update post status to publishing
        await supabaseAdmin
          .from('posts')
          .update({ status: 'publishing' })
          .eq('id', postId);

        // Call the publish endpoint
        const publishResponse = await fetch(`${baseUrl}/api/posts/${postId}/publish`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            platforms,
          }),
        });

        if (!publishResponse.ok) {
          const errorData = await publishResponse.json().catch(() => ({ error: 'Unknown error' }));
          throw new Error(errorData.error || `Publish failed with status ${publishResponse.status}`);
        }

        const publishResult = await publishResponse.json();

        // Check if all platforms published successfully
        const allSuccess = publishResult.results?.every((r: any) => r.success) ?? false;

        if (allSuccess) {
          // Update post status to posted
          await supabaseAdmin
            .from('posts')
            .update({
              status: 'posted',
              posted_at: new Date().toISOString(),
            })
            .eq('id', postId);

          console.log(`[Publish Scheduled] Successfully published post ${postId} to ${platforms.length} platform(s)`);
          results.push({
            postId,
            success: true,
            platforms,
            errors: [],
          });
        } else {
          // Some platforms failed - keep status as publishing or mark as error
          const failedPlatforms = publishResult.results
            ?.filter((r: any) => !r.success)
            .map((r: any) => `${r.platform}: ${r.error || 'Unknown error'}`) || [];

          console.error(`[Publish Scheduled] Partial failure for post ${postId}:`, failedPlatforms);
          results.push({
            postId,
            success: false,
            platforms: publishResult.results?.filter((r: any) => r.success).map((r: any) => r.platform) || [],
            errors: failedPlatforms,
          });
        }
      } catch (error: any) {
        console.error(`[Publish Scheduled] Error publishing post ${postId}:`, error);
        
        // Update post status back to scheduled (for retry) or mark as error
        await supabaseAdmin
          .from('posts')
          .update({ status: 'scheduled' }) // Keep as scheduled for retry
          .eq('id', postId);

        results.push({
          postId,
          success: false,
          platforms: [],
          errors: [error.message || 'Unknown error'],
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const errorCount = results.filter(r => !r.success).length;

    console.log(`[Publish Scheduled] Completed: ${successCount} successful, ${errorCount} failed`);

    return NextResponse.json({
      success: true,
      published: successCount,
      failed: errorCount,
      total: scheduledPosts.length,
      results,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('[Publish Scheduled] Cron job error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return handleCronRequest(request);
}

export async function POST(request: NextRequest) {
  return handleCronRequest(request);
}



