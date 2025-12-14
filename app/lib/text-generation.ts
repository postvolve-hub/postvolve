/**
 * Text Generation Service
 * Orchestrates multi-platform text generation with optimization
 */

import { generateUniversalPost, refinePrompt, summarizeUrlContent } from './openrouter';
import { buildUniversalPostPrompt } from './prompts/text-generation';
import type { PlatformType } from '@shared/types/database.types';

// Map database platform type to our internal platform type
type Platform = 'linkedin' | 'x' | 'facebook' | 'instagram';

export interface GeneratedText {
  platform: Platform;
  content: string;
  characterCount: number;
  hashtags: string[];
}

export interface TextGenerationOptions {
  category?: 'tech' | 'ai' | 'business' | 'motivation';
  platforms?: Platform[];
  baseContent?: string;
  urlContent?: string;
  userPrompt?: string;
  temperature?: number;
}

// Universal limit for all platforms (280 chars - X's limit)
const UNIVERSAL_LIMIT = 280;

const PLATFORM_LIMITS: Record<Platform, number> = {
  linkedin: UNIVERSAL_LIMIT,
  x: UNIVERSAL_LIMIT,
  facebook: UNIVERSAL_LIMIT,
  instagram: UNIVERSAL_LIMIT,
};

/**
 * Generate ONE brief post for ALL platforms (max 280 chars - X limit)
 * Universal content that works across all social media platforms
 */
export async function generateMultiPlatformText(
  options: TextGenerationOptions
): Promise<GeneratedText[]> {
  const platforms: Platform[] = options.platforms || ['linkedin', 'x', 'facebook', 'instagram'];
  
  // Step 1: Refine the base prompt if we have user input or URL content
  let refinedPrompt = options.userPrompt || options.baseContent || '';
  
  if (options.urlContent) {
    try {
      const summary = await summarizeUrlContent(
        options.urlContent,
        options.userPrompt
      );
      refinedPrompt = summary;
      console.log('[Text Generation] URL content summarized');
    } catch (error: any) {
      console.warn('[Text Generation] URL summarization failed, using raw content:', error.message);
      refinedPrompt = options.urlContent.substring(0, 1000); // Truncate for efficiency
    }
  }

  if (refinedPrompt && (options.userPrompt || options.urlContent)) {
    try {
      refinedPrompt = await refinePrompt(refinedPrompt, {
        category: options.category,
      });
      console.log('[Text Generation] Prompt refined');
    } catch (error: any) {
      console.warn('[Text Generation] Prompt refinement failed:', error.message);
    }
  }

  // Step 2: Generate ONE universal brief post (max 280 chars)
  try {
    const prompt = buildUniversalPostPrompt({
      category: options.category,
      baseContent: refinedPrompt || options.baseContent,
      urlContent: options.urlContent,
      userPrompt: options.userPrompt,
    });

    const content = await generateUniversalPost(prompt, {
      category: options.category,
      temperature: options.temperature ?? 0.8,
    });

    // Clean content - remove explanations, titles, and metadata
    let cleanContent = cleanPostContent(content);
    
    // Extract hashtags
    const hashtagRegex = /#[\w]+/g;
    const hashtags = cleanContent.match(hashtagRegex) || [];
    let finalContent = cleanContent.replace(hashtagRegex, '').trim();
    
    // Enforce 280 char limit (X's limit - works for all platforms)
    const MAX_LENGTH = 280;
    if (finalContent.length > MAX_LENGTH) {
      const truncated = finalContent.substring(0, MAX_LENGTH - 30);
      const lastSentence = truncated.lastIndexOf('.');
      finalContent = lastSentence > 50 
        ? truncated.substring(0, lastSentence + 1)
        : truncated.trim();
    }

    // Add hashtags back (ensure total stays under 280)
    if (hashtags.length > 0) {
      const hashtagPart = ' ' + hashtags.slice(0, 5).join(' '); // Max 5 hashtags
      const remainingSpace = MAX_LENGTH - finalContent.length - hashtagPart.length;
      if (remainingSpace > 0) {
        finalContent += hashtagPart;
      }
    }
    
    // Final trim to ensure 280 limit
    if (finalContent.length > MAX_LENGTH) {
      finalContent = finalContent.substring(0, MAX_LENGTH).trim();
    }

    // Return same content for all platforms
    return platforms.map(platform => ({
      platform,
      content: finalContent,
      characterCount: finalContent.length,
      hashtags: hashtags.slice(0, 5),
    }));
  } catch (error: any) {
    console.error('[Text Generation] Failed:', error);
    // Return error content for all platforms
    return platforms.map(platform => ({
      platform,
      content: 'Error generating content. Please try again.',
      characterCount: 0,
      hashtags: [],
    }));
  }
}

/**
 * Clean post content - remove explanations, titles, metadata
 */
function cleanPostContent(content: string): string {
  let cleaned = content.trim();
  
  // Remove markdown
  cleaned = cleaned.replace(/^```[\w]*\n?/gm, '').replace(/\n?```$/gm, '');
  cleaned = cleaned.replace(/\*\*/g, '');
  cleaned = cleaned.replace(/^#+\s*/gm, '');
  
  // Remove explanation patterns
  const patterns = [
    /^Here's.*?:\s*/i,
    /^Here is.*?:\s*/i,
    /^Here.*?:\s*/i,
    /^---\s*/gm,
    /Why this works:/i,
    /Why This Works:/i,
    /Would you like.*$/i,
    /Happy to.*$/i,
    /Need a different.*$/i,
    /Share your.*$/i,
    /Format:.*$/i,
    /Requirements:.*$/i,
    /Note:.*$/i,
    /^###\s+/gm,
    /^\d+\.\s+/gm, // Numbered lists
  ];
  
  patterns.forEach(pattern => {
    cleaned = cleaned.replace(pattern, '');
  });
  
  // Remove title patterns (bold text at start, emoji + bold, etc.)
  cleaned = cleaned.replace(/^[\*\*]*[🚀💡✨🔥⭐]+[\*\*]*\s*/gm, '');
  cleaned = cleaned.replace(/^\*\*[^*]+\*\*\s*/gm, ''); // Remove bold titles
  cleaned = cleaned.replace(/^[A-Z][^.!?]*[.!?]\s*/gm, (match) => {
    // Remove if it looks like a title (short, ends with punctuation, followed by blank line)
    return match.length < 100 ? '' : match;
  });
  
  // Extract only post content (before explanations)
  const endMarkers = [
    /---/,
    /Why this works/i,
    /Why This Works/i,
    /Would you like/i,
    /Need a different/i,
    /Share your/i,
    /###/,
  ];
  
  for (const marker of endMarkers) {
    const index = cleaned.search(marker);
    if (index > 0 && index < cleaned.length * 0.7) { // Only if marker is in first 70%
      cleaned = cleaned.substring(0, index).trim();
      break;
    }
  }
  
  return cleaned.trim();
}

/**
 * Optimize existing content (universal, max 280 chars)
 */
export async function optimizeExistingContentForPlatform(
  content: string,
  platform: Platform,
  category?: string
): Promise<string> {
  const optimized = await generateUniversalPost(`Optimize: ${content.substring(0, 500)}`, {
    category: category as any,
    temperature: 0.7,
  });

  // Ensure it fits 280 char limit
  const cleaned = cleanPostContent(optimized);
  if (cleaned.length > 280) {
    return cleaned.substring(0, 277) + '...';
  }

  return cleaned;
}

