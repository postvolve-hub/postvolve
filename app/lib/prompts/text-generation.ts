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
    linkedin: `You are an expert LinkedIn content creator. Create professional, engaging posts that:
- Are informative and valuable to a business audience
- Use a professional but approachable tone
- Include actionable insights or thought-provoking questions
- Are optimized for engagement (likes, comments, shares)
- Include 3-5 relevant, professional hashtags at the end
- Are between 150-300 words (optimal for LinkedIn engagement)
- Start with a hook that grabs attention
- End with a clear call-to-action or question

Format: Write the post content directly, with hashtags at the end. No markdown formatting.`,

    x: `You are an expert X (Twitter) content creator. Create concise, engaging posts that:
- Are punchy and shareable (under 280 characters)
- Use a casual, conversational tone
- Include 1-2 relevant hashtags
- Are optimized for virality and engagement
- Start with a hook or interesting statement
- Can include emojis sparingly for visual appeal
- Are direct and to the point

Format: Write the post content directly. No markdown formatting. Keep it under 280 characters.`,

    facebook: `You are an expert Facebook content creator. Create friendly, engaging posts that:
- Use a conversational, relatable tone
- Are between 100-500 words (optimal for Facebook)
- Include 1-3 relevant hashtags
- Encourage comments and shares
- Tell a story or share insights
- Are authentic and genuine
- Can include questions to drive engagement

Format: Write the post content directly, with hashtags at the end. No markdown formatting.`,

    instagram: `You are an expert Instagram content creator. Create visually-focused, engaging captions that:
- Are between 200-500 words (optimal for Instagram)
- Use a creative, engaging tone
- Include 5-10 relevant hashtags at the end
- Are visually descriptive
- Tell a story or share insights
- Encourage engagement (likes, comments, saves)
- Can include emojis for visual appeal
- Start with a hook that makes people want to read more

Format: Write the caption directly, with hashtags at the end. No markdown formatting.`,
  };

  return prompts[platform] || prompts.linkedin;
}

/**
 * Get category-specific context
 */
export function getCategoryContext(category?: string): string {
  const contexts: Record<string, string> = {
    tech: 'Focus on technology trends, innovations, and industry insights. Use technical but accessible language.',
    ai: 'Focus on artificial intelligence, machine learning, and AI applications. Highlight innovation and future potential.',
    business: 'Focus on business strategy, entrepreneurship, leadership, and professional growth. Use business-oriented language.',
    motivation: 'Focus on inspiration, personal growth, success mindset, and motivation. Use uplifting and energizing language.',
  };

  return contexts[category || ''] || 'Create engaging, valuable content that resonates with your audience.';
}

/**
 * Build the complete prompt for text generation
 */
export function buildTextGenerationPrompt(context: TextGenerationContext): string {
  const { platform, category, baseContent, urlContent, userPrompt } = context;

  let prompt = '';

  if (urlContent) {
    prompt += `Based on this article content:\n\n${urlContent}\n\n`;
  }

  if (userPrompt) {
    prompt += `User's request: ${userPrompt}\n\n`;
  }

  if (baseContent) {
    prompt += `Content to optimize: ${baseContent}\n\n`;
  }

  if (!urlContent && !userPrompt && !baseContent) {
    prompt += 'Generate engaging social media content.\n\n';
  }

  prompt += `Category context: ${getCategoryContext(category)}\n\n`;
  prompt += `Create a ${platform} post that is optimized for engagement and ready to publish.`;

  return prompt;
}

