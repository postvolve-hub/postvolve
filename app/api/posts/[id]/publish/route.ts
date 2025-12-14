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

// Platform publishers - call real API endpoints
async function publishToLinkedIn(postId: string, content: string, userId: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/social/linkedin/post`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, message: content }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'LinkedIn publish failed');
    }

    const result = await response.json();
    return { success: true, postId: result.result?.id || `linkedin_${Date.now()}` };
  } catch (error: any) {
    console.error('[Publish LinkedIn] Error:', error);
    throw error;
  }
}

async function publishToX(postId: string, content: string, userId: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/social/x/post`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, message: content }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'X publish failed');
    }

    const result = await response.json();
    // X API returns result.data.id
    return { success: true, postId: result.result?.data?.id || result.result?.id || `x_${Date.now()}` };
  } catch (error: any) {
    console.error('[Publish X] Error:', error);
    throw error;
  }
}

async function publishToFacebook(postId: string, content: string, userId: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/social/facebook/post`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, message: content }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Facebook publish failed');
    }

    const result = await response.json();
    return { success: true, postId: result.result?.id || `facebook_${Date.now()}` };
  } catch (error: any) {
    console.error('[Publish Facebook] Error:', error);
    throw error;
  }
}

async function publishToInstagram(postId: string, content: string, imageUrl: string, userId: string) {
  try {
    if (!imageUrl) {
      throw new Error('Instagram requires an image URL');
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/social/instagram/post`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, message: content, imageUrl }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Instagram publish failed');
    }

    const result = await response.json();
    return { success: true, postId: result.result?.id || `instagram_${Date.now()}` };
  } catch (error: any) {
    console.error('[Publish Instagram] Error:', error);
    throw error;
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
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

