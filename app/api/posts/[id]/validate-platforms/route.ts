/**
 * GET /api/posts/[id]/validate-platforms
 * Validates if user has connected accounts for the post's selected platforms
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { validatePlatformConnections } from '@/lib/platform-validation';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const postId = params.id;
    const userId = request.nextUrl.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'missing_params', message: 'userId is required' },
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

    // Extract platforms from post_platforms
    const platforms = (post.post_platforms as any[])
      ?.map((pp: any) => pp.platform === 'twitter' ? 'x' : pp.platform) || [];

    if (platforms.length === 0) {
      return NextResponse.json({
        valid: false,
        message: 'No platforms selected for this post',
        summary: {
          allConnected: false,
          connectedPlatforms: [],
          missingPlatforms: [],
          expiredPlatforms: [],
          results: [],
        },
      });
    }

    // Validate platform connections
    const summary = await validatePlatformConnections(userId, platforms);

    return NextResponse.json({
      valid: summary.allConnected,
      message: summary.allConnected
        ? 'All platforms are connected and ready'
        : 'Some platforms are not connected',
      summary,
    });
  } catch (error: any) {
    console.error('[Validate Platforms] Error:', error);
    return NextResponse.json(
      { error: 'server_error', message: error.message },
      { status: 500 }
    );
  }
}



