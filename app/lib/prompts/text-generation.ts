/**
 * Text Generation Prompts
 * Optimized for universal brief posts (max 280 chars - X limit)
 * Works for all platforms: LinkedIn, X, Facebook, Instagram
 */

export interface UniversalPostContext {
  category?: 'tech' | 'ai' | 'business' | 'motivation';
  baseContent?: string;
  urlContent?: string;
  userPrompt?: string;
}

/**
 * Get category-specific context (brief)
 */
export function getCategoryContext(category?: string): string {
  const contexts: Record<string, string> = {
    tech: 'tech',
    ai: 'AI',
    business: 'business',
    motivation: 'motivation',
  };

  return contexts[category || ''] || 'general';
}

/**
 * Build universal post prompt (one post for all platforms)
 */
export function buildUniversalPostPrompt(context: UniversalPostContext): string {
  const { category, baseContent, urlContent, userPrompt } = context;

  let prompt = '';

  if (urlContent) {
    prompt += `Article: ${urlContent.substring(0, 800)}\n`;
  }

  if (userPrompt) {
    prompt += `Request: ${userPrompt}\n`;
  }

  if (baseContent) {
    prompt += `Content: ${baseContent.substring(0, 600)}\n`;
  }

  prompt += `Category: ${getCategoryContext(category)}\n`;
  prompt += `Create brief social media post. Max 280 chars. Include 3-5 hashtags. No title. Output ONLY post text.`;

  return prompt;
}

