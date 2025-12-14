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
    tech: 'modern tech aesthetic, digital elements, blue/gray palette, futuristic',
    ai: 'futuristic AI theme, neural networks, innovative tech visuals',
    business: 'professional corporate style, sophisticated, executive aesthetic',
    motivation: 'energetic, vibrant colors, uplifting, dynamic composition',
  };

  return styles[category || ''] || 'modern, professional social media design';
}

/**
 * Get category-specific visual elements
 */
export function getCategoryVisualElements(category?: string): string {
  const elements: Record<string, string> = {
    tech: 'tech graphics, digital elements, modern technology visuals',
    ai: 'AI visuals, neural network patterns, futuristic tech graphics',
    business: 'corporate graphics, professional business imagery, executive setting',
    motivation: 'inspiring imagery, dynamic visuals, energetic composition',
  };

  return elements[category || ''] || 'professional graphics, engaging visuals';
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
 * Optimized for news card style: text-heavy, bold headlines, professional typography
 */
export function buildImagePrompt(context: ImageGenerationContext): string {
  const { textContent, category, platform } = context;

  const categoryStyle = getCategoryImageStyle(category);
  const visualElements = getCategoryVisualElements(category);
  
  // Extract headline/key text (first 80 chars for token efficiency)
  // Remove hashtags and clean up for headline
  const headline = textContent
    .substring(0, 80)
    .replace(/\n/g, ' ')
    .replace(/#[\w]+/g, '')
    .trim();

  // Build specific news card prompt matching the style from examples
  return `Professional social media news card. Large bold headline text overlay: "${headline}". Dark background with white/yellow text overlay. ${visualElements}. ${categoryStyle}. Text-dominant design, shareable format, high quality typography, news card aesthetic.`;
}

