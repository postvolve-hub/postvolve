/**
 * Content Optimization Service
 * Platform-specific content optimization and validation
 */

// Platform type for content optimization
type Platform = 'linkedin' | 'x' | 'facebook' | 'instagram';

// Universal limit for all platforms (X's 280 char limit)
const UNIVERSAL_LIMIT = 280;

const PLATFORM_LIMITS: Record<Platform, number> = {
  linkedin: UNIVERSAL_LIMIT,
  x: UNIVERSAL_LIMIT,
  facebook: UNIVERSAL_LIMIT,
  instagram: UNIVERSAL_LIMIT,
};

// Universal hashtag recommendation (3-5 for all platforms)
const UNIVERSAL_HASHTAG_COUNTS = { min: 3, max: 5 };

const PLATFORM_HASHTAG_COUNTS: Record<Platform, { min: number; max: number }> = {
  linkedin: UNIVERSAL_HASHTAG_COUNTS,
  x: UNIVERSAL_HASHTAG_COUNTS,
  facebook: UNIVERSAL_HASHTAG_COUNTS,
  instagram: UNIVERSAL_HASHTAG_COUNTS,
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

  const limit = UNIVERSAL_LIMIT; // Universal 280 char limit for all platforms
  const characterCount = content.length;

  // Check universal character limit
  if (characterCount > limit) {
    errors.push(`Content exceeds universal limit of ${limit} characters (${characterCount})`);
  }

  // Check hashtags (universal 3-5 recommendation)
  const hashtags = extractHashtags(content);
  const hashtagCount = hashtags.length;
  const hashtagRange = UNIVERSAL_HASHTAG_COUNTS;

  if (hashtagCount < hashtagRange.min) {
    warnings.push(`Consider adding more hashtags (${hashtagCount}/${hashtagRange.min}-${hashtagRange.max} recommended)`);
  } else if (hashtagCount > hashtagRange.max) {
    warnings.push(`Too many hashtags (${hashtagCount}/${hashtagRange.max} recommended)`);
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
  const limit = UNIVERSAL_LIMIT; // Universal 280 char limit
  let optimized = content.trim();

  // Extract hashtags first
  const hashtags = extractHashtags(optimized);
  const contentWithoutHashtags = optimized.replace(/#[\w]+/g, '').trim();

  // Truncate content if needed (universal limit)
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
      : truncated.trim();
  } else {
    optimized = contentWithoutHashtags;
  }

  // Add hashtags back (max 5)
  if (hashtags.length > 0) {
    const hashtagPart = ' ' + hashtags.slice(0, 5).join(' ');
    const remainingSpace = limit - optimized.length - hashtagPart.length;
    if (remainingSpace > 0) {
      optimized += hashtagPart;
    }
  }

  // Ensure final length is within universal limit
  if (optimized.length > limit) {
    optimized = optimized.substring(0, limit).trim();
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
  // Universal formatting - no platform-specific changes
  // Just ensure clean formatting
  return content.trim();
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

