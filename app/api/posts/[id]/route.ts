/**
 * GET /api/posts/[id] - Get single post
 * PUT /api/posts/[id] - Update post
 * DELETE /api/posts/[id] - Delete post
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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

    const { data: post, error } = await supabaseAdmin
      .from('posts')
      .select(`
        *,
        post_platforms (*)
      `)
      .eq('id', postId)
      .single();

    if (error) {
      console.error('[Post GET] Error:', error);
      return NextResponse.json(
        { error: 'not_found', message: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      post,
    });
  } catch (error: any) {
    console.error('[Post GET] Error:', error);
    return NextResponse.json(
      { error: 'server_error', message: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const postId = params.id;
    const body = await request.json().catch(() => null);
    const userId = body?.userId as string | undefined;

    if (!userId) {
      return NextResponse.json(
        { error: 'missing_params', message: 'userId is required' },
        { status: 400 }
      );
    }

    // Verify post belongs to user
    const { data: existingPost, error: checkError } = await supabaseAdmin
      .from('posts')
      .select('user_id')
      .eq('id', postId)
      .single();

    if (checkError || existingPost?.user_id !== userId) {
      return NextResponse.json(
        { error: 'unauthorized', message: 'Post not found or access denied' },
        { status: 403 }
      );
    }

    // Update post
    const updateData: any = {};
    if (body.title !== undefined) updateData.title = body.title;
    if (body.content !== undefined) updateData.content = body.content;
    // Accept both imageUrl and image_url
    if (body.imageUrl !== undefined) updateData.image_url = body.imageUrl;
    if (body.image_url !== undefined) updateData.image_url = body.image_url;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.status !== undefined) updateData.status = body.status;

    const { error: updateError } = await supabaseAdmin
      .from('posts')
      .update(updateData)
      .eq('id', postId);

    if (updateError) {
      console.error('[Post PUT] Error:', updateError);
      return NextResponse.json(
        { error: 'database_error', message: 'Failed to update post' },
        { status: 500 }
      );
    }

    // Update platform-specific content if provided
    if (body.platforms && Array.isArray(body.platforms) && body.platforms.length > 0) {
      // Delete existing platform entries
      await supabaseAdmin
        .from('post_platforms')
        .delete()
        .eq('post_id', postId);

      // Insert new platform entries
      const platformEntries = body.platforms.map((p: any) => ({
        post_id: postId,
        platform: p.platform === 'x' ? 'twitter' : p.platform,
        content: p.content,
        status: p.status || 'draft',
      }));

      const { error: platformError } = await supabaseAdmin
        .from('post_platforms')
        .insert(platformEntries);
      
      if (platformError) {
        console.error('[Post PUT] Platform update error:', platformError);
      }
    }

    // Fetch the updated post with platforms
    const { data: post, error: fetchError } = await supabaseAdmin
      .from('posts')
      .select(`
        *,
        post_platforms (*)
      `)
      .eq('id', postId)
      .single();

    if (fetchError) {
      console.error('[Post PUT] Fetch error:', fetchError);
      return NextResponse.json(
        { error: 'database_error', message: 'Failed to fetch updated post' },
        { status: 500 }
      );
    }

    // Log activity
    await supabaseAdmin.from('activity_log').insert({
      user_id: userId,
      activity_type: 'post_edited',
      description: `Updated post: ${post.title}`,
      metadata: { post_id: postId },
    } as any);

    return NextResponse.json({
      success: true,
      post,
    });
  } catch (error: any) {
    console.error('[Post PUT] Error:', error);
    return NextResponse.json(
      { error: 'server_error', message: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const postId = params.id;
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'missing_params', message: 'userId is required' },
        { status: 400 }
      );
    }

    // Verify post belongs to user
    const { data: existingPost, error: checkError } = await supabaseAdmin
      .from('posts')
      .select('user_id, title')
      .eq('id', postId)
      .single();

    if (checkError || existingPost?.user_id !== userId) {
      return NextResponse.json(
        { error: 'unauthorized', message: 'Post not found or access denied' },
        { status: 403 }
      );
    }

    // Soft delete (set status to deleted or actually delete)
    // For now, we'll actually delete
    const { error: deleteError } = await supabaseAdmin
      .from('posts')
      .delete()
      .eq('id', postId);

    if (deleteError) {
      console.error('[Post DELETE] Error:', deleteError);
      return NextResponse.json(
        { error: 'database_error', message: 'Failed to delete post' },
        { status: 500 }
      );
    }

    // Log activity
    await supabaseAdmin.from('activity_log').insert({
      user_id: userId,
      activity_type: 'post_deleted',
      description: `Deleted post: ${existingPost.title}`,
      metadata: { post_id: postId },
    } as any);

    return NextResponse.json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (error: any) {
    console.error('[Post DELETE] Error:', error);
    return NextResponse.json(
      { error: 'server_error', message: error.message },
      { status: 500 }
    );
  }
}

