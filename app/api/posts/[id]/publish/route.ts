/**
 * POST /api/posts/[id]/publish
 * Publish post to selected platforms
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Platform publishers (we'll implement these)
async function publishToLinkedIn(postId: string, content: string, userId: string) {
  // TODO: Implement LinkedIn publisher
  return { success: true, postId: `linkedin_${Date.now()}` };
}

async function publishToX(postId: string, content: string, userId: string) {
  // TODO: Implement X publisher (use existing /api/social/x/post)
  return { success: true, postId: `x_${Date.now()}` };
}

async function publishToFacebook(postId: string, content: string, userId: string) {
  // TODO: Implement Facebook publisher
  return { success: true, postId: `facebook_${Date.now()}` };
}

async function publishToInstagram(postId: string, content: string, imageUrl: string, userId: string) {
  // TODO: Implement Instagram publisher
  return { success: true, postId: `instagram_${Date.now()}` };
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const postId = params.id;
    const body = await request.json().catch(() => null);
    const userId = body?.userId as string | undefined;
    const platforms = body?.platforms as string[] | undefined;

    if (!userId || !platforms || platforms.length === 0) {
      return NextResponse.json(
        { error: 'missing_params', message: 'userId and platforms are required' },
        { status: 400 }
      );
    }

    // Get post with platform content
    const { data: post, error: postError } = await supabaseAdmin
      .from('posts')
      .select(`
        *,
        post_platforms (*)
      `)
      .eq('id', postId)
      .single();

    if (postError || post?.user_id !== userId) {
      return NextResponse.json(
        { error: 'not_found', message: 'Post not found or access denied' },
        { status: 404 }
      );
    }

    // Update post status
    await supabaseAdmin
      .from('posts')
      .update({ status: 'publishing' })
      .eq('id', postId);

    // Publish to each platform
    const publishResults: Array<{ platform: string; success: boolean; postId?: string; error?: string }> = [];

    for (const platform of platforms) {
      try {
        const platformContent = post.post_platforms?.find(
          (pp: any) => pp.platform === (platform === 'x' ? 'twitter' : platform)
        );

        if (!platformContent) {
          publishResults.push({
            platform,
            success: false,
            error: 'No content found for this platform',
          });
          continue;
        }

        let result;
        switch (platform) {
          case 'linkedin':
            result = await publishToLinkedIn(postId, platformContent.content, userId);
            break;
          case 'x':
            result = await publishToX(postId, platformContent.content, userId);
            break;
          case 'facebook':
            result = await publishToFacebook(postId, platformContent.content, userId);
            break;
          case 'instagram':
            result = await publishToInstagram(postId, platformContent.content, post.image_url || '', userId);
            break;
          default:
            throw new Error(`Unknown platform: ${platform}`);
        }

        // Update platform entry
        await supabaseAdmin
          .from('post_platforms')
          .update({
            status: 'posted',
            platform_post_id: result.postId,
            posted_at: new Date().toISOString(), // FIX: Use posted_at not published_at
          })
          .eq('id', platformContent.id);

        publishResults.push({
          platform,
          success: true,
          postId: result.postId,
        });
      } catch (error: any) {
        console.error(`[Publish] Error publishing to ${platform}:`, error);
        
        // Update platform entry with error
        const platformContent = post.post_platforms?.find(
          (pp: any) => pp.platform === (platform === 'x' ? 'twitter' : platform)
        );
        if (platformContent) {
          await supabaseAdmin
            .from('post_platforms')
            .update({ status: 'failed' })
            .eq('id', platformContent.id);
        }

        publishResults.push({
          platform,
          success: false,
          error: error.message,
        });
      }
    }

    // Update post status based on results
    const allSuccess = publishResults.every((r) => r.success);
    const anySuccess = publishResults.some((r) => r.success);

    const finalStatus = allSuccess ? 'posted' : anySuccess ? 'posted' : 'failed';

    await supabaseAdmin
      .from('posts')
      .update({ status: finalStatus })
      .eq('id', postId);

    // Log activity
    await supabaseAdmin.from('activity_log').insert({
      user_id: userId,
      activity_type: 'post_published',
      description: `Published post to ${platforms.join(', ')}`,
      metadata: {
        post_id: postId,
        platforms,
        results: publishResults,
      },
    } as any);

    return NextResponse.json({
      success: anySuccess,
      results: publishResults,
      status: finalStatus,
    });
  } catch (error: any) {
    console.error('[Publish] Error:', error);
    return NextResponse.json(
      { error: 'server_error', message: error.message },
      { status: 500 }
    );
  }
}

