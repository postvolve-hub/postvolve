/**
 * POST /api/generate/image
 * Standalone image generation endpoint
 */

import { NextRequest, NextResponse } from 'next/server';
import { generatePostImage } from '@/lib/image-generation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const textContent = body?.textContent as string | undefined;
    const category = body?.category as 'tech' | 'ai' | 'business' | 'motivation' | undefined;
    const platform = body?.platform as 'linkedin' | 'x' | 'facebook' | 'instagram' | undefined;
    const quality = body?.quality as 'low' | 'medium' | 'high' | undefined;

    if (!textContent) {
      return NextResponse.json(
        { error: 'missing_params', message: 'textContent is required' },
        { status: 400 }
      );
    }

    console.log('[Generate Image] Starting image generation');
    const result = await generatePostImage({
      textContent,
      category,
      platform: platform || 'linkedin',
      quality: quality || 'high',
    });

    return NextResponse.json({
      success: true,
      image: result,
    });
  } catch (error: any) {
    console.error('[Generate Image] Error:', error);
    return NextResponse.json(
      {
        error: 'generation_failed',
        message: error.message || 'Image generation failed',
      },
      { status: 500 }
    );
  }
}

