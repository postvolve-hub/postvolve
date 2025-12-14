/**
 * Image Generation Prompts
 * Optimized prompts for generating social media images
 */

export interface ImageGenerationContext {
  textContent: string;
  category?: 'tech' | 'ai' | 'business' | 'motivation';
  platform?: 'linkedin' | 'x' | 'facebook' | 'instagram';
  style?: string;
}

/**
 * Get category-specific image style
 */
export function getCategoryImageStyle(category?: string): string {
  const styles: Record<string, string> = {
    tech: 'modern tech aesthetic, sleek design, digital elements, professional color scheme (blues, grays), futuristic',
    ai: 'futuristic AI theme, neural networks visualization, digital art, innovative design, tech-forward aesthetic',
    business: 'professional business style, clean corporate design, sophisticated color palette, executive aesthetic',
    motivation: 'energetic and inspiring, vibrant colors, uplifting imagery, motivational design, dynamic composition',
  };

  return styles[category || ''] || 'modern, engaging, professional social media design';
}

/**
 * Get platform-specific image requirements
 */
export function getPlatformImageRequirements(platform?: string): string {
  const requirements: Record<string, string> = {
    linkedin: 'Professional business aesthetic, clean design, corporate-friendly, 1200x627 pixels',
    x: 'Bold, eye-catching design, shareable format, 1200x675 pixels, Twitter-optimized',
    facebook: 'Friendly, engaging design, relatable imagery, 1200x630 pixels, Facebook feed optimized',
    instagram: 'Visually stunning, aesthetic design, Instagram-worthy, 1080x1080 pixels, square format',
  };

  return requirements[platform || ''] || 'Social media optimized, 1200x630 pixels';
}

/**
 * Build image generation prompt
 */
export function buildImagePrompt(context: ImageGenerationContext): string {
  const { textContent, category, platform, style } = context;

  const categoryStyle = getCategoryImageStyle(category);
  const platformReqs = getPlatformImageRequirements(platform);
  const customStyle = style || categoryStyle;

  // Extract key themes from text content
  const contentPreview = textContent.substring(0, 200);

  return `Create a high-quality social media image for this content: "${contentPreview}"

Style: ${customStyle}
Format: ${platformReqs}
Requirements:
- Professional news card style
- Visually appealing and shareable
- Relevant to the content theme
- Brand-appropriate and professional
- Eye-catching design that encourages engagement
- High quality, crisp imagery
- Optimized for social media sharing

The image should complement the text content and make the post more engaging and shareable.`;
}

