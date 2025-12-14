/**
 * Content Optimization Service
 * Platform-specific content optimization and validation
 */

// Platform type for content optimization
type Platform = 'linkedin' | 'x' | 'facebook' | 'instagram';

const PLATFORM_LIMITS: Record<Platform, number> = {
  linkedin: 3000,
  x: 280,
  facebook: 63206,
  instagram: 2200,
};

const PLATFORM_HASHTAG_COUNTS: Record<Platform, { min: number; max: number }> = {
  linkedin: { min: 3, max: 5 },
  x: { min: 1, max: 2 },
  facebook: { min: 1, max: 3 },
  instagram: { min: 5, max: 10 },
};

/**
 * Extract hashtags from content
 */
export function extractHashtags(content: string): string[] {
  const hashtagRegex = /#[\w]+/g;
  return content.match(hashtagRegex) || [];
}

/**
 * Validate content for platform
 */
export function validateContentForPlatform(
  content: string,
  platform: Platform
): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  const limit = PLATFORM_LIMITS[platform];
  const characterCount = content.length;

  // Check character limit
  if (characterCount > limit) {
    errors.push(`Content exceeds ${platform} limit of ${limit} characters (${characterCount})`);
  }

  // Check hashtags
  const hashtags = extractHashtags(content);
  const hashtagCount = hashtags.length;
  const hashtagRange = PLATFORM_HASHTAG_COUNTS[platform];

  if (hashtagCount < hashtagRange.min) {
    warnings.push(`Consider adding more hashtags (${hashtagCount}/${hashtagRange.min}-${hashtagRange.max} recommended)`);
  } else if (hashtagCount > hashtagRange.max) {
    warnings.push(`Too many hashtags for ${platform} (${hashtagCount}/${hashtagRange.max} recommended)`);
  }

  // Platform-specific validations
  if (platform === 'x' && characterCount > 280) {
    errors.push('X (Twitter) posts must be 280 characters or less');
  }

  if (platform === 'linkedin' && characterCount < 150) {
    warnings.push('LinkedIn posts perform better with 150+ characters');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Optimize content for platform (truncate, format, etc.)
 */
export function optimizeContentFormatForPlatform(
  content: string,
  platform: Platform
): string {
  const limit = PLATFORM_LIMITS[platform];
  let optimized = content.trim();

  // Extract hashtags first
  const hashtags = extractHashtags(optimized);
  const contentWithoutHashtags = optimized.replace(/#[\w]+/g, '').trim();

  // Truncate content if needed
  if (contentWithoutHashtags.length > limit - 50) {
    // Leave room for hashtags
    const maxContentLength = limit - 50;
    const truncated = contentWithoutHashtags.substring(0, maxContentLength);
    
    // Try to truncate at sentence boundary
    const lastSentence = truncated.lastIndexOf('.');
    const lastNewline = truncated.lastIndexOf('\n');
    const breakPoint = Math.max(lastSentence, lastNewline);
    
    optimized = breakPoint > 0 
      ? truncated.substring(0, breakPoint + 1)
      : truncated + '...';
  } else {
    optimized = contentWithoutHashtags;
  }

  // Add hashtags back
  if (hashtags.length > 0) {
    optimized += '\n\n' + hashtags.join(' ');
  }

  // Ensure final length is within limit
  if (optimized.length > limit) {
    optimized = optimized.substring(0, limit - 3) + '...';
  }

  return optimized;
}

/**
 * Format content for platform (add line breaks, emojis, etc.)
 */
export function formatContentForPlatform(
  content: string,
  platform: Platform
): string {
  let formatted = content;

  // Platform-specific formatting
  switch (platform) {
    case 'linkedin':
      // Add line breaks for readability
      formatted = formatted.replace(/\. /g, '.\n\n');
      break;
    
    case 'x':
      // Keep it compact
      formatted = formatted.replace(/\n{2,}/g, '\n');
      break;
    
    case 'facebook':
      // Friendly formatting
      formatted = formatted.replace(/\. /g, '.\n');
      break;
    
    case 'instagram':
      // Visual formatting with line breaks
      formatted = formatted.replace(/\. /g, '.\n');
      break;
  }

  return formatted.trim();
}

/**
 * Get platform-specific recommendations
 */
export function getPlatformRecommendations(platform: Platform): string[] {
  const recommendations: Record<Platform, string[]> = {
    linkedin: [
      'Use a professional tone',
      'Include 3-5 relevant hashtags',
      'Ask questions to drive engagement',
      'Share insights or thought leadership',
      'Keep it between 150-300 words for optimal engagement',
    ],
    x: [
      'Keep it under 280 characters',
      'Use 1-2 relevant hashtags',
      'Make it punchy and shareable',
      'Start with a hook',
      'Include a call-to-action',
    ],
    facebook: [
      'Use a friendly, conversational tone',
      'Include 1-3 relevant hashtags',
      'Tell a story or share insights',
      'Ask questions to encourage comments',
      'Keep it between 100-500 words',
    ],
    instagram: [
      'Use a creative, engaging tone',
      'Include 5-10 relevant hashtags',
      'Be visually descriptive',
      'Tell a story',
      'Encourage engagement (likes, comments, saves)',
    ],
  };

  return recommendations[platform] || [];
}

