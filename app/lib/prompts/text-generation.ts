/**
 * Text Generation Prompts
 * Platform-specific prompts optimized for each social media platform
 */

export interface TextGenerationContext {
  category?: 'tech' | 'ai' | 'business' | 'motivation';
  platform: 'linkedin' | 'x' | 'facebook' | 'instagram';
  baseContent?: string;
  urlContent?: string;
  userPrompt?: string;
  includeHashtags?: boolean;
}

/**
 * Get platform-specific system prompt
 */
export function getPlatformSystemPrompt(platform: 'linkedin' | 'x' | 'facebook' | 'instagram'): string {
  const prompts: Record<string, string> = {
    linkedin: `Create a brief LinkedIn post (100-200 words). Professional tone. Include 3-5 hashtags at end. Output ONLY the post text, nothing else.`,

    x: `Create a brief X post (under 280 chars). Casual tone. Include 1-2 hashtags. Output ONLY the post text, nothing else.`,

    facebook: `Create a brief Facebook post (80-150 words). Conversational tone. Include 1-3 hashtags at end. Output ONLY the post text, nothing else.`,

    instagram: `Create a brief Instagram caption (100-200 words). Creative tone. Include 5-8 hashtags at end. Output ONLY the caption text, nothing else.`,
  };

  return prompts[platform] || prompts.linkedin;
}

/**
 * Get category-specific context
 */
export function getCategoryContext(category?: string): string {
  const contexts: Record<string, string> = {
    tech: 'Tech trends and innovations',
    ai: 'AI and machine learning applications',
    business: 'Business strategy and entrepreneurship',
    motivation: 'Inspiration and personal growth',
  };

  return contexts[category || ''] || 'Engaging content';
}

/**
 * Build the complete prompt for text generation
 */
export function buildTextGenerationPrompt(context: TextGenerationContext): string {
  const { platform, category, baseContent, urlContent, userPrompt } = context;

  let prompt = '';

  if (urlContent) {
    prompt += `Article: ${urlContent.substring(0, 1500)}\n\n`;
  }

  if (userPrompt) {
    prompt += `Request: ${userPrompt}\n\n`;
  }

  if (baseContent) {
    prompt += `Content: ${baseContent.substring(0, 1000)}\n\n`;
  }

  prompt += `Category: ${getCategoryContext(category)}\n`;
  prompt += `Platform: ${platform}\n`;
  prompt += `Create post. Output ONLY the post text with hashtags. No explanations.`;

  return prompt;
}

