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

    // Update post to scheduled status
    const { data: post, error } = await supabaseAdmin
      .from('posts')
      .update({
        status: 'scheduled',
        scheduled_at: scheduledAt,
      })
      .eq('id', postId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('[Scheduler Posts] Error scheduling:', error);
      return NextResponse.json(
        { error: 'database_error', message: 'Failed to schedule post' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      post,
    });
  } catch (error: any) {
    console.error('[Scheduler Posts] Error:', error);
    return NextResponse.json(
      { error: 'server_error', message: error.message },
      { status: 500 }
    );
  }
}

