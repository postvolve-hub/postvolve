/**
 * A4F Image Generation Service
 * Free image generation using A4F's unified API
 * Supports multiple free tier models: imagen-3.5, imagen-4, dall-e-2, flux-schnell, sdxl-lite, phoenix
 */

interface A4FImageOptions {
  model?: string;
  quality?: 'low' | 'medium' | 'high';
  width?: number;
  height?: number;
}

interface A4FImageResponse {
  imageUrl: string;
  model: string;
  quality: string;
  prompt?: string;
}

interface A4FAPIResponse {
  created: number;
  data: Array<{
    url: string;
    revised_prompt?: string;
  }>;
}

// Free tier models available on A4F
// Use full model IDs as specified by A4F
const FREE_TIER_MODELS = {
  high: 'provider-4/phoenix', // Phoenix model - high quality
  medium: 'provider-4/phoenix', // Phoenix model
  low: 'flux-schnell', // Black Forest Labs - fast and efficient
};

/**
 * Generate image using A4F API
 * Uses OpenAI-compatible endpoint with free tier models
 */
export async function generateImage(
  prompt: string,
  options: A4FImageOptions = {}
): Promise<A4FImageResponse> {
  let {
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
    let selectedModel = model || FREE_TIER_MODELS[quality];

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
        quality: quality === 'high' ? 'hd' : 'standard',
        response_format: 'url', // Returns image URL
      }),
    });

    // Handle errors
    if (!response.ok) {
      const errorText = await response.text();
      console.error('[A4F] API Error:', response.status, errorText);
      throw new Error(`A4F API error (${response.status}): ${errorText}`);
    }

    const result: A4FAPIResponse = await response.json();
    
    if (!result.data || result.data.length === 0) {
      throw new Error('A4F returned no image data');
    }

    const imageUrl = result.data[0].url;
    const revisedPrompt = result.data[0].revised_prompt;
    
    console.log(`[A4F] Image generated successfully: ${imageUrl.substring(0, 50)}...`);

    return {
      imageUrl,
      model: selectedModel,
      quality,
      prompt: revisedPrompt || prompt,
    };
  } catch (error: any) {
    console.error('[A4F] Image generation failed:', error);
    throw new Error(`Image generation failed: ${error.message}`);
  }
}

/**
 * Generate image with automatic fallback if primary model fails
 */
export async function generateImageWithFallback(
  prompt: string,
  options: A4FImageOptions = {}
): Promise<A4FImageResponse> {
  const qualities: Array<'high' | 'medium' | 'low'> = ['high', 'medium', 'low'];
  
  for (const quality of qualities) {
    try {
      return await generateImage(prompt, { ...options, quality });
    } catch (error: any) {
      console.warn(`[A4F] Failed with ${quality} quality, trying next...`, error.message);
      if (quality === 'low') {
        // Last attempt failed
        throw error;
      }
    }
  }
  
  throw new Error('All image generation attempts failed');
}

/**
 * Create optimized image prompt from text content
 */
export function createImagePrompt(
  textContent: string,
  category?: string,
  style?: string
): string {
  let prompt = textContent;
  
  // Add category-specific styling
  if (category) {
    const categoryStyles: Record<string, string> = {
      tech: 'modern tech aesthetic, clean design, digital innovation',
      ai: 'futuristic AI theme, neural networks, cutting-edge technology',
      business: 'professional business setting, corporate elegance, success',
      motivation: 'inspiring, uplifting, motivational, positive energy',
    };
    
    if (categoryStyles[category]) {
      prompt += `, ${categoryStyles[category]}`;
    }
  }
  
  // Add style if provided
  if (style) {
    prompt += `, ${style}`;
  }
  
  // Ensure it's suitable for social media
  prompt += ', social media post, high quality, professional';
  
  return prompt;
}

