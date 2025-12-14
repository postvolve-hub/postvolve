/**
 * POST /api/posts - Create a new post
 * GET /api/posts - List user's posts
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
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const lane = searchParams.get('lane');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!userId) {
      return NextResponse.json(
        { error: 'missing_params', message: 'userId is required' },
        { status: 400 }
      );
    }

    let query = supabaseAdmin
      .from('posts')
      .select(`
        *,
        post_platforms (*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) {
      query = query.eq('status', status);
    }

    if (category) {
      query = query.eq('category', category);
    }

    if (lane) {
      query = query.eq('generation_lane', lane); // FIX: Use generation_lane
    }

    const { data: posts, error } = await query;

    if (error) {
      console.error('[Posts GET] Error:', error);
      return NextResponse.json(
        { error: 'database_error', message: 'Failed to fetch posts' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      posts: posts || [],
      count: posts?.length || 0,
    });
  } catch (error: any) {
    console.error('[Posts GET] Error:', error);
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
    const title = body?.title as string | undefined;
    const content = body?.content as string | undefined;
    const imageUrl = body?.imageUrl as string | undefined;
    const category = body?.category as string | undefined;
    const lane = body?.lane as 'auto' | 'url' | 'custom' | undefined;
    const platforms = body?.platforms as Array<{ platform: string; content: string }> | undefined;

    if (!userId || !title || !content) {
      return NextResponse.json(
        { error: 'missing_params', message: 'userId, title, and content are required' },
        { status: 400 }
      );
    }

    // Create post
    const { data: post, error: postError } = await supabaseAdmin
      .from('posts')
      .insert({
        user_id: userId,
        title,
        content,
        image_url: imageUrl,
        category: category || 'tech',
        generation_lane: lane || 'custom', // FIX: Use generation_lane
        status: 'draft',
      })
      .select()
      .single();

    if (postError) {
      console.error('[Posts POST] Error:', {
        error: postError,
        code: postError.code,
        message: postError.message,
        details: postError.details,
        hint: postError.hint,
      });
      return NextResponse.json(
        { 
          error: 'database_error', 
          message: 'Failed to create post',
          details: postError.message,
        },
        { status: 500 }
      );
    }

    // Create platform-specific entries
    if (platforms && platforms.length > 0) {
      const platformEntries = platforms.map((p) => ({
        post_id: post.id,
        platform: p.platform === 'x' ? 'twitter' : p.platform, // Map x to twitter
        content: p.content,
        status: 'pending' as const,
      }));

      const { error: platformError } = await supabaseAdmin
        .from('post_platforms')
        .insert(platformEntries);

      if (platformError) {
        console.error('[Posts POST] Platform entries error:', platformError);
      }
    }

    // Log activity
    await supabaseAdmin.from('activity_log').insert({
      user_id: userId,
      activity_type: 'post_created',
      description: `Created post: ${title}`,
      metadata: {
        post_id: post.id,
        lane: lane || 'custom',
      },
    } as any);

    return NextResponse.json({
      success: true,
      post,
    });
  } catch (error: any) {
    console.error('[Posts POST] Error:', error);
    return NextResponse.json(
      { error: 'server_error', message: error.message },
      { status: 500 }
    );
  }
}

