/**
 * POST /api/posts/[id]/regenerate
 * Regenerate content for an existing post
 * Uses the same generation lane and parameters as the original post
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generateContent } from '@/lib/generation-orchestrator';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const postId = params.id;
    const body = await request.json().catch(() => null);
    const userId = body?.userId as string | undefined;
    const regenerateImage = body?.regenerateImage as boolean | undefined;

    if (!userId) {
      return NextResponse.json(
        { error: 'missing_params', message: 'userId is required' },
        { status: 400 }
      );
    }

    // Get the original post
    const { data: post, error: postError } = await supabaseAdmin
      .from('posts')
      .select('*')
      .eq('id', postId)
      .eq('user_id', userId)
      .single();

    if (postError || !post) {
      return NextResponse.json(
        { error: 'not_found', message: 'Post not found or access denied' },
        { status: 404 }
      );
    }

    // Only allow regeneration of draft posts
    if (post.status !== 'draft') {
      return NextResponse.json(
        { error: 'invalid_status', message: 'Can only regenerate draft posts' },
        { status: 400 }
      );
    }

    // Get platform content to determine which platforms to regenerate for
    const { data: platformContent } = await supabaseAdmin
      .from('post_platforms')
      .select('platform')
      .eq('post_id', postId);

    const platforms = (platformContent || []).map((pc: any) => 
      pc.platform === 'twitter' ? 'x' : pc.platform
    ) as any[];

    if (platforms.length === 0) {
      platforms.push('linkedin', 'x', 'facebook', 'instagram'); // Default platforms
    }

    // Determine generation options based on original post
    const generationOptions: any = {
      lane: (post.generation_lane || 'custom') as 'auto' | 'url' | 'custom',
      category: (post.category || 'tech') as 'tech' | 'ai' | 'business' | 'motivation',
      platforms,
      userId, // Pass userId to download external images
    };

    // Add source based on generation lane
    if (post.generation_lane === 'url' && post.source_url) {
      generationOptions.url = post.source_url;
    } else if (post.generation_lane === 'custom' && post.source_prompt) {
      generationOptions.userPrompt = post.source_prompt;
    }

    console.log(`[Regenerate Post] Regenerating post ${postId} with options:`, generationOptions);

    // Regenerate content
    const result = await generateContent(generationOptions);

    // Update post with new content
    const updateData: any = {
      title: result.title,
      content: result.content[0]?.content || post.content,
      updated_at: new Date().toISOString(),
    };

    // Update image if requested or if original had no image
    if (regenerateImage || !post.image_url) {
      updateData.image_url = result.image?.imageUrl || null;
      updateData.image_prompt = result.image?.prompt || null;
    }

    const { data: updatedPost, error: updateError } = await supabaseAdmin
      .from('posts')
      .update(updateData)
      .eq('id', postId)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    // Delete old platform content
    await supabaseAdmin
      .from('post_platforms')
      .delete()
      .eq('post_id', postId);

    // Create new platform-specific content
    const platformInserts = result.content.map((content: any) => ({
      post_id: postId,
      platform: content.platform === 'x' ? 'twitter' : content.platform,
      content: content.content,
      status: 'draft',
    }));

    const { error: platformError } = await supabaseAdmin
      .from('post_platforms')
      .insert(platformInserts);

    if (platformError) {
      console.error('[Regenerate Post] Error saving platform content:', platformError);
      // Continue anyway - post is updated
    }

    // Log activity
    await supabaseAdmin.from('activity_log').insert({
      user_id: userId,
      activity_type: 'post_regenerated',
      description: `Regenerated post: ${post.title}`,
      metadata: {
        post_id: postId,
        generation_lane: post.generation_lane,
      },
    } as any);

    return NextResponse.json({
      success: true,
      post: updatedPost,
      message: 'Post regenerated successfully',
    });
  } catch (error: any) {
    console.error('[Regenerate Post] Error:', error);
    return NextResponse.json(
      { error: 'server_error', message: error.message },
      { status: 500 }
    );
  }
}

