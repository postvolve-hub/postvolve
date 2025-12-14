/**
 * Image Generation Service
 * Orchestrates image generation with quality optimization
 */

import { generateImage, generateImageWithFallback, createImagePrompt } from './a4f';
import { buildImagePrompt, type ImageGenerationContext } from './prompts/image-generation';
import { downloadAndSaveImage, isExternalImageUrl } from './image-storage';

export interface GeneratedImage {
  imageUrl: string;
  model: string;
  quality: string;
  prompt: string;
}

export interface ImageGenerationOptions {
  textContent: string;
  category?: 'tech' | 'ai' | 'business' | 'motivation';
  platform?: 'linkedin' | 'x' | 'facebook' | 'instagram';
  quality?: 'low' | 'medium' | 'high';
  style?: string;
  userId?: string; // Optional: if provided, will download and save external images
}

/**
 * Generate image for social media post
 * If userId is provided, downloads external images and saves to Supabase Storage
 */
export async function generatePostImage(
  options: ImageGenerationOptions
): Promise<GeneratedImage> {
  const { textContent, category, platform, quality, style, userId } = options;

  // Build optimized image prompt
  const context: ImageGenerationContext = {
    textContent,
    category,
    platform,
    style,
  };

  const imagePrompt = buildImagePrompt(context);

  try {
    // Generate image with quality fallback
    const result = quality
      ? await generateImage(imagePrompt, {
          quality,
          width: platform === 'instagram' ? 1080 : 1200,
          height: platform === 'instagram' ? 1080 : platform === 'x' ? 675 : 630,
        })
      : await generateImageWithFallback(imagePrompt, {
          width: platform === 'instagram' ? 1080 : 1200,
          height: platform === 'instagram' ? 1080 : platform === 'x' ? 675 : 630,
        });

    let finalImageUrl = result.imageUrl;

    // If userId provided and image is external, download and save to our storage
    if (userId && isExternalImageUrl(result.imageUrl)) {
      try {
        console.log('[Image Generation] Downloading external image to our storage...');
        finalImageUrl = await downloadAndSaveImage(result.imageUrl, userId);
        console.log('[Image Generation] Image saved to our storage:', finalImageUrl);
      } catch (downloadError: any) {
        console.warn('[Image Generation] Failed to download image, using original URL:', downloadError.message);
        // Continue with original URL if download fails
      }
    }

    return {
      imageUrl: finalImageUrl,
      model: result.model,
      quality: result.quality,
      prompt: imagePrompt,
    };
  } catch (error: any) {
    console.error('[Image Generation] Error:', error);
    
    // Fallback: Return placeholder or error
    throw new Error(`Image generation failed: ${error.message}`);
  }
}

/**
 * Regenerate image with different quality
 */
export async function regenerateImage(
  textContent: string,
  quality: 'low' | 'medium' | 'high',
  category?: string,
  platform?: string
): Promise<GeneratedImage> {
  return generatePostImage({
    textContent,
    category: category as any,
    platform: platform as any,
    quality,
  });
}

