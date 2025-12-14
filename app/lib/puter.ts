/**
 * A4F Image Generation Service
 * Free image generation using A4F's unified API
 * Supports multiple free tier models: imagen-3.5, imagen-4, dall-e-2, flux-schnell, sdxl-lite, phoenix
 */

interface PuterImageOptions {
  model?: string;
  quality?: 'low' | 'medium' | 'high';
  width?: number;
  height?: number;
}

interface PuterImageResponse {
  imageUrl: string;
  model: string;
  quality: string;
}

interface A4FImageResponse {
  created: number;
  data: Array<{
    url: string;
    revised_prompt?: string;
  }>;
}

// Free tier models available on A4F
// Models may need provider prefix (e.g., 'provider-4/imagen-4') or just model name
// Try without prefix first, add prefix if API returns model not found
const FREE_TIER_MODELS = {
  high: 'imagen-4', // Google's Imagen 4 - high quality
  medium: 'imagen-4-fast', // Fast version of Imagen 4
  low: 'flux-schnell', // Black Forest Labs - fast and efficient
  // Alternative models available:
  // 'imagen-3.5', 'dall-e-2', 'sdxl-lite', 'phoenix', 'flux-fast'
};

// Alternative model formats with provider prefixes (fallback)
const FREE_TIER_MODELS_WITH_PROVIDER = {
  high: 'provider-4/imagen-4',
  medium: 'provider-4/imagen-4-fast',
  low: 'provider-4/flux-schnell',
};

/**
 * Generate image using A4F API
 * Uses OpenAI-compatible endpoint with free tier models
 */
export async function generateImage(
  prompt: string,
  options: PuterImageOptions = {}
): Promise<PuterImageResponse> {
  const {
    model,
    quality = 'high',
    width = 1200,
    height = 630,
  } = options;

  try {
    const apiKey = process.env.A4F_API_KEY;
    if (!apiKey) {
      throw new Error('A4F_API_KEY is not configured. Please add it to your .env.local file.');
    }

    // Select model based on quality or use provided model
    // Try without provider prefix first, fallback to with prefix if needed
    let selectedModel = model || FREE_TIER_MODELS[quality];
    let useProviderPrefix = false;
    
    // Convert dimensions to A4F size format (must be specific sizes)
    // A4F supports: 256x256, 512x512, 1024x1024, 1792x1024, 1024x1792
    // For social media, we'll use closest match
    let size: string;
    if (width === 1080 && height === 1080) {
      size = '1024x1024'; // Instagram square
    } else if (width === 1200 && height === 630) {
      size = '1024x1024'; // LinkedIn/Facebook - closest match
    } else if (width === 1200 && height === 675) {
      size = '1024x1024'; // X/Twitter - closest match
    } else {
      size = '1024x1024'; // Default
    }
    
    console.log(`[A4F] Generating image with model: ${selectedModel}, size: ${size}, quality: ${quality}`);

    let response = await fetch('https://api.a4f.co/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: selectedModel,
        prompt: prompt,
        n: 1, // Number of images
        size: size,
        response_format: 'url', // Returns image URL
      }),
    });

    // If model not found, try with provider prefix
    if (!response.ok) {
      const errorText = await response.text();
      const errorLower = errorText.toLowerCase();
      
      // Check if it's a model not found error
      if ((response.status === 404 || errorLower.includes('model') || errorLower.includes('not found')) && !model && !useProviderPrefix) {
        // Try with provider prefix
        selectedModel = FREE_TIER_MODELS_WITH_PROVIDER[quality];
        useProviderPrefix = true;
        console.log(`[A4F] Retrying with provider prefix: ${selectedModel}`);
        
        response = await fetch('https://api.a4f.co/v1/images/generations', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: selectedModel,
            prompt: prompt,
            n: 1,
            size: size,
            response_format: 'url',
          }),
        });
      }
      
      if (!response.ok) {
        const finalErrorText = await response.text();
        console.error('[A4F] API Error:', response.status, finalErrorText);
        throw new Error(`A4F API error (${response.status}): ${finalErrorText}`);
      }
    }

    const result: A4FImageResponse = await response.json();
    
    if (!result.data || result.data.length === 0) {
      throw new Error('A4F returned no image data');
    }

    const imageUrl = result.data[0].url;
    
    console.log(`[A4F] Image generated successfully: ${imageUrl.substring(0, 50)}...`);

    return {
      imageUrl,
      model: selectedModel,
      quality,
    };
  } catch (error: any) {
    console.error('[A4F] Image generation failed:', error);
    throw new Error(`Image generation failed: ${error.message}`);
  }
}

/**
 * Generate image with automatic quality optimization
 * Tries high quality first, falls back to medium, then low
 * Also tries alternative models if primary model fails
 */
export async function generateImageWithFallback(
  prompt: string,
  options: Omit<PuterImageOptions, 'quality'> = {}
): Promise<PuterImageResponse> {
  const qualities: Array<'high' | 'medium' | 'low'> = ['high', 'medium', 'low'];
  
  // Alternative models to try if primary fails (try both formats)
  const alternativeModels = [
    'imagen-4',
    'imagen-4-fast',
    'imagen-3.5',
    'flux-schnell',
    'dall-e-2',
    'sdxl-lite',
    'phoenix',
    'flux-fast',
    // Also try with provider prefix
    'provider-4/imagen-4',
    'provider-4/imagen-4-fast',
    'provider-4/imagen-3.5',
    'provider-4/flux-schnell',
  ];
  
  for (const quality of qualities) {
    // Try primary model for this quality
    try {
      console.log(`[A4F] Trying quality: ${quality} with model: ${FREE_TIER_MODELS[quality]}`);
      const result = await generateImage(prompt, { ...options, quality });
      console.log(`[A4F] Success with quality: ${quality}`);
      return result;
    } catch (error: any) {
      console.warn(`[A4F] Quality ${quality} failed with primary model: ${error.message}`);
      
      // Try alternative models
      for (const altModel of alternativeModels) {
        if (altModel === FREE_TIER_MODELS[quality]) continue; // Skip if already tried
        
        try {
          console.log(`[A4F] Trying alternative model: ${altModel}`);
          const result = await generateImage(prompt, { ...options, model: altModel, quality });
          console.log(`[A4F] Success with alternative model: ${altModel}`);
          return result;
        } catch (altError: any) {
          console.warn(`[A4F] Alternative model ${altModel} failed: ${altError.message}`);
          continue;
        }
      }
      
      if (quality === 'low') {
        // All qualities and models failed
        throw new Error(`All image generation attempts failed. Last error: ${error.message}`);
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

