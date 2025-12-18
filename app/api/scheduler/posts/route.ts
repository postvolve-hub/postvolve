/**
 * GET /api/scheduler/posts
 * Get scheduled posts for the authenticated user
 * POST /api/scheduler/posts
 * Schedule a post
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!userId) {
      return NextResponse.json(
        { error: 'missing_params', message: 'userId is required' },
        { status: 400 }
      );
    }

    let query = supabaseAdmin
      .from('posts')
      .select(`
        id,
        title,
        content,
        category,
        status,
        scheduled_at,
        created_at,
        post_platforms (platform, status)
      `)
      .eq('user_id', userId)
      .in('status', ['scheduled', 'publishing'])
      .order('scheduled_at', { ascending: true });

    // Filter by date range if provided
    if (startDate) {
      query = query.gte('scheduled_at', startDate);
    }
    if (endDate) {
      query = query.lte('scheduled_at', endDate);
    }

    const { data: posts, error } = await query;

    if (error) {
      console.error('[Scheduler Posts] Error:', error);
      return NextResponse.json(
        { error: 'database_error', message: 'Failed to fetch scheduled posts' },
        { status: 500 }
      );
    }

    // Format posts for calendar display
    const formattedPosts = (posts || []).map((post) => {
      const scheduledDate = post.scheduled_at ? new Date(post.scheduled_at) : null;
      const platforms = (post.post_platforms as any[]) || [];
      
      return {
        id: post.id,
        title: post.title || 'Untitled Post',
        date: scheduledDate ? scheduledDate.toISOString().split('T')[0] : null,
        time: scheduledDate ? scheduledDate.toTimeString().slice(0, 5) : null,
        category: post.category || 'uncategorized',
        platform: platforms.length > 0 ? platforms[0].platform : 'linkedin',
        status: post.status,
      };
    });

    return NextResponse.json({
      success: true,
      posts: formattedPosts,
      count: formattedPosts.length,
    });
  } catch (error: any) {
    console.error('[Scheduler Posts] Error:', error);
    return NextResponse.json(
      { error: 'server_error', message: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const userId = body?.userId as string | undefined;
    const postId = body?.postId as string | undefined;
    const scheduledAt = body?.scheduledAt as string | undefined;

    if (!userId || !postId || !scheduledAt) {
      return NextResponse.json(
        { error: 'missing_params', message: 'userId, postId, and scheduledAt are required' },
        { status: 400 }
      );
    }

    // First, verify the post exists and belongs to the user, and get its content
    const { data: existingPost, error: fetchError } = await supabaseAdmin
      .from('posts')
      .select('id, status, content, title')
      .eq('id', postId)
      .eq('user_id', userId)
      .single();

    if (fetchError || !existingPost) {
      console.error('[Scheduler Posts] Post not found or access denied:', fetchError);
      return NextResponse.json(
        { error: 'not_found', message: 'Post not found or access denied' },
        { status: 404 }
      );
    }

    // Update post to scheduled status
    const { data: post, error: updateError } = await supabaseAdmin
      .from('posts')
      .update({
        status: 'scheduled',
        scheduled_at: scheduledAt,
      })
      .eq('id', postId)
      .eq('user_id', userId)
      .select()
      .single();

    if (updateError) {
      console.error('[Scheduler Posts] Error updating post status:', updateError);
      return NextResponse.json(
        { error: 'database_error', message: 'Failed to schedule post' },
        { status: 500 }
      );
    }

    // CRITICAL FIX: Update post_platforms status to 'scheduled' so cron job can find them
    // First, check if post_platforms exist
    const { data: existingPlatforms, error: fetchPlatformsError } = await supabaseAdmin
      .from('post_platforms')
      .select('id, platform, status')
      .eq('post_id', postId);

    if (fetchPlatformsError) {
      console.error('[Scheduler Posts] Error fetching post_platforms:', fetchPlatformsError);
    } else {
      console.log(`[Scheduler Posts] Post ${postId} has ${existingPlatforms?.length || 0} post_platforms entries`);
      
      if (!existingPlatforms || existingPlatforms.length === 0) {
        console.error(`[Scheduler Posts] CRITICAL: Post ${postId} has NO post_platforms entries! Creating default platforms...`);
        
        // Create default post_platforms entries if they don't exist
        // Default to LinkedIn and X (most common platforms)
        const defaultPlatforms = [
          { platform: 'linkedin', content: existingPost.content || '' },
          { platform: 'twitter', content: existingPost.content || '' },
        ];
        
        const platformEntries = defaultPlatforms.map((p) => ({
          post_id: postId,
          platform: p.platform,
          content: p.content,
          status: 'scheduled' as const,
        }));
        
        const { error: createError } = await supabaseAdmin
          .from('post_platforms')
          .insert(platformEntries);
        
        if (createError) {
          console.error('[Scheduler Posts] Error creating default post_platforms:', createError);
        } else {
          console.log(`[Scheduler Posts] Created ${platformEntries.length} default post_platforms for post ${postId}`);
        }
      } else {
        // Update ALL post_platforms to 'scheduled' status (not just draft/pending)
        // This ensures the cron job can find them regardless of their current status
        const { error: platformError, count } = await supabaseAdmin
          .from('post_platforms')
          .update({ status: 'scheduled' })
          .eq('post_id', postId)
          .select('id', { count: 'exact', head: false });

        if (platformError) {
          console.error('[Scheduler Posts] Error updating platform status:', platformError);
        } else {
          console.log(`[Scheduler Posts] Updated ${count || existingPlatforms.length} post_platforms to scheduled for post ${postId}`);
        }
      }
    }

    return NextResponse.json({
      success: true,
      post,
      message: 'Post scheduled successfully',
    });
  } catch (error: any) {
    console.error('[Scheduler Posts] Error:', error);
    return NextResponse.json(
      { error: 'server_error', message: error.message },
      { status: 500 }
    );
  }
}



