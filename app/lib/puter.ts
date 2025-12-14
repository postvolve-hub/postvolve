/**
 * Puter.js Image Generation Service
 * Free image generation using Puter.js API
 * Supports multiple models: gpt-image-1, gemini-2.5-flash-image-preview, dall-e-3
 */

interface PuterImageOptions {
  model?: 'gpt-image-1' | 'gpt-image-1-mini' | 'gemini-2.5-flash-image-preview' | 'dall-e-3';
  quality?: 'low' | 'medium' | 'high';
  width?: number;
  height?: number;
}

interface PuterImageResponse {
  imageUrl: string;
  model: string;
  quality: string;
}

/**
 * Generate image using Puter.js
 * Note: Puter.js is client-side, so we'll use a placeholder for now
 * TODO: Implement proper Puter.js integration or use alternative free image API
 */
export async function generateImage(
  prompt: string,
  options: PuterImageOptions = {}
): Promise<PuterImageResponse> {
  const {
    model = 'gpt-image-1',
    quality = 'high',
    width = 1200,
    height = 630,
  } = options;

  try {
    // TODO: Implement Puter.js server-side integration
    // For now, return a placeholder that indicates image generation is needed
    // In production, you would:
    // 1. Use Puter.js client-side API if available
    // 2. Use an alternative free image generation service
    // 3. Use Unsplash API as a fallback
    
    // Placeholder: Return a generated image URL
    // This should be replaced with actual Puter.js integration
    const placeholderUrl = `https://via.placeholder.com/${width}x${height}?text=${encodeURIComponent(prompt.substring(0, 50))}`;
    
    console.warn('[Puter] Using placeholder image. Implement Puter.js integration.');
    
    return {
      imageUrl: placeholderUrl,
      model,
      quality,
    };
  } catch (error: any) {
    console.error('[Puter] Image generation failed:', error);
    throw new Error(`Image generation failed: ${error.message}`);
  }
}

/**
 * Generate image with automatic quality optimization
 * Tries high quality first, falls back to medium, then low
 */
export async function generateImageWithFallback(
  prompt: string,
  options: Omit<PuterImageOptions, 'quality'> = {}
): Promise<PuterImageResponse> {
  const qualities: Array<'high' | 'medium' | 'low'> = ['high', 'medium', 'low'];
  
  for (const quality of qualities) {
    try {
      console.log(`[Puter] Trying quality: ${quality}`);
      const result = await generateImage(prompt, { ...options, quality });
      console.log(`[Puter] Success with quality: ${quality}`);
      return result;
    } catch (error: any) {
      console.warn(`[Puter] Quality ${quality} failed: ${error.message}`);
      if (quality === 'low') {
        // All qualities failed
        throw error;
      }
      // Try next quality
      continue;
    }
  }

  throw new Error('All image generation attempts failed');
}

/**
 * Generate optimized image prompt for social media
 */
export function createImagePrompt(
  textContent: string,
  category?: string,
  platform?: string
): string {
  const categoryStyles: Record<string, string> = {
    tech: 'modern, tech-focused, sleek, professional',
    ai: 'futuristic, AI-themed, digital, innovative',
    business: 'professional, corporate, clean, sophisticated',
    motivation: 'inspiring, energetic, uplifting, vibrant',
  };

  const platformStyles: Record<string, string> = {
    linkedin: 'professional, business-oriented, clean',
    x: 'bold, eye-catching, shareable',
    facebook: 'friendly, relatable, engaging',
    instagram: 'visually stunning, colorful, aesthetic',
  };

  const style = [
    categoryStyles[category || ''] || 'engaging, modern',
    platformStyles[platform || ''] || 'social media optimized',
  ].join(', ');

  return `Create a high-quality social media image for this content: "${textContent.substring(0, 200)}"

Style: ${style}
Format: Professional news card style, optimized for social media sharing
Requirements: 
- High quality, visually appealing
- Relevant to the content
- Brand-appropriate
- Eye-catching and shareable
- 1200x630 pixels aspect ratio`;
}

