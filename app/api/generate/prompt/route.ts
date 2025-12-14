/**
 * POST /api/generate/prompt
 * Lane 3: Custom prompt content generation
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generateContent } from '@/lib/generation-orchestrator';
import { checkFeatureAccess } from '@/lib/api-access-control';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const userId = body?.userId as string | undefined;
    const userPrompt = body?.prompt as string | undefined;
    const category = body?.category as 'tech' | 'ai' | 'business' | 'motivation' | undefined;
    const platforms = body?.platforms as string[] | undefined;
    const uploadedImageUrl = body?.imageUrl as string | undefined;

    if (!userId || !userPrompt) {
      return NextResponse.json(
        { error: 'missing_params', message: 'userId and prompt are required' },
        { status: 400 }
      );
    }

    // Check feature access
    const accessCheck = await checkFeatureAccess(userId, 'generate');
    if (!accessCheck.allowed) {
      return NextResponse.json(
        { error: 'feature_not_available', message: accessCheck.message },
        { status: accessCheck.status || 403 }
      );
    }

    // Generate content
    console.log(`[Generate Prompt] Starting generation for user ${userId}`);
    const result = await generateContent({
      lane: 'custom',
      category: category || 'tech',
      platforms: (platforms as any) || ['linkedin', 'x', 'facebook', 'instagram'],
      userPrompt,
      userId, // Pass userId to download external images
      uploadedImageUrl,
    });

    // Save to database
    const { data: post, error: postError } = await supabaseAdmin
      .from('posts')
      .insert({
        user_id: userId,
        title: result.title,
        content: result.content[0]?.content || '',
        image_url: result.image.imageUrl,
        image_prompt: result.image.prompt,
        category: result.category,
        generation_lane: result.lane, // FIX: Use generation_lane not lane
        source_prompt: userPrompt, // Store original prompt for custom lane
        status: 'draft',
      })
      .select()
      .single();

    if (postError) {
      console.error('[Generate Prompt] Database error:', {
        error: postError,
        code: postError.code,
        message: postError.message,
        details: postError.details,
        hint: postError.hint,
      });
      return NextResponse.json(
        { 
          error: 'database_error', 
          message: 'Failed to save post',
          details: postError.message,
        },
        { status: 500 }
      );
    }

    // Create platform-specific entries
    const platformEntries = result.content.map((text) => ({
      post_id: post.id,
      platform: text.platform === 'x' ? 'twitter' : text.platform,
      content: text.content,
      status: 'pending',
    }));

    if (platformEntries.length > 0) {
      const { error: platformError } = await supabaseAdmin
        .from('post_platforms')
        .insert(platformEntries);

      if (platformError) {
        console.error('[Generate Prompt] Platform entries error:', platformError);
      }
    }

    // Log activity
    await supabaseAdmin.from('activity_log').insert({
      user_id: userId,
      activity_type: 'post_created',
      description: 'Generated post from custom prompt',
      metadata: {
        post_id: post.id,
        lane: 'custom',
        category: result.category,
      },
    } as any);

    return NextResponse.json({
      success: true,
      postId: post.id,
      result: {
        title: result.title,
        content: result.content,
        image: result.image,
        qualityScore: result.qualityScore,
      },
    });
  } catch (error: any) {
    console.error('[Generate Prompt] Error:', error);
    return NextResponse.json(
      {
        error: 'generation_failed',
        message: error.message || 'Content generation failed',
      },
      { status: 500 }
    );
  }
}

