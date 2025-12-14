/**
 * Text Generation Service
 * Orchestrates multi-platform text generation with optimization
 */

import { generateText, refinePrompt, summarizeUrlContent } from './openrouter';
import { buildTextGenerationPrompt, getPlatformSystemPrompt, type TextGenerationContext } from './prompts/text-generation';
import type { PlatformType } from '@/shared/types/database.types';

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

const PLATFORM_LIMITS: Record<Platform, number> = {
  linkedin: 3000,
  x: 280,
  facebook: 63206,
  instagram: 2200,
};

/**
 * Generate optimized text for multiple platforms
 */
export async function generateMultiPlatformText(
  options: TextGenerationOptions
): Promise<GeneratedText[]> {
  const platforms: Platform[] = options.platforms || ['linkedin', 'x', 'facebook', 'instagram'];
  const results: GeneratedText[] = [];

  // Step 1: Refine the base prompt if we have user input or URL content
  // Gracefully handles rate limits and failures for best results
  let refinedPrompt = options.userPrompt || options.baseContent || '';
  
  if (options.urlContent) {
    try {
      // Summarize URL content first
      const summary = await summarizeUrlContent(
        options.urlContent,
        options.userPrompt
      );
      refinedPrompt = summary;
      console.log('[Text Generation] URL content summarized successfully');
    } catch (error: any) {
      console.warn('[Text Generation] URL summarization failed, using raw content for best results:', error.message);
      refinedPrompt = options.urlContent; // Use raw content as fallback
    }
  }

  if (refinedPrompt && (options.userPrompt || options.urlContent)) {
    try {
      // Refine the prompt for better results
      refinedPrompt = await refinePrompt(refinedPrompt, {
        category: options.category,
      });
      console.log('[Text Generation] Prompt refined successfully');
    } catch (error: any) {
      console.warn('[Text Generation] Prompt refinement failed, using current prompt for best results:', error.message);
      // Continue with current refinedPrompt (graceful degradation)
    }
  }

  // Step 2: Generate content for each platform in parallel
  const generationPromises = platforms.map(async (platform) => {
    try {
      const context: TextGenerationContext = {
        platform,
        category: options.category,
        baseContent: refinedPrompt || options.baseContent,
        urlContent: options.urlContent,
        userPrompt: options.userPrompt,
        includeHashtags: true,
      };

      const prompt = buildTextGenerationPrompt(context);
      const content = await generateTextForPlatform(platform, prompt, {
        category: options.category,
        temperature: options.temperature ?? 0.8,
        max_tokens: Math.floor(PLATFORM_LIMITS[platform] * 1.5), // Allow some buffer
      });

      // Extract hashtags and content
      const hashtagRegex = /#[\w]+/g;
      const hashtags = content.match(hashtagRegex) || [];
      const cleanContent = content.replace(hashtagRegex, '').trim();

      // Ensure content fits platform limits
      let finalContent = cleanContent;
      if (finalContent.length > PLATFORM_LIMITS[platform]) {
        // Truncate intelligently (at sentence boundary if possible)
        const truncated = finalContent.substring(0, PLATFORM_LIMITS[platform] - 50);
        const lastSentence = truncated.lastIndexOf('.');
        finalContent = lastSentence > 0 
          ? truncated.substring(0, lastSentence + 1)
          : truncated + '...';
      }

      // Add hashtags back
      if (hashtags.length > 0) {
        finalContent += '\n\n' + hashtags.join(' ');
      }

      return {
        platform,
        content: finalContent,
        characterCount: finalContent.length,
        hashtags,
      };
    } catch (error: any) {
      console.error(`[Text Generation] Failed for ${platform}:`, error);
      // Return error content
      return {
        platform,
        content: `Error generating content for ${platform}. Please try again.`,
        characterCount: 0,
        hashtags: [],
      };
    }
  });

  const platformResults = await Promise.all(generationPromises);
  results.push(...platformResults);

  return results;
}

/**
 * Optimize existing content for a specific platform
 */
export async function optimizeExistingContentForPlatform(
  content: string,
  platform: Platform,
  category?: string
): Promise<string> {
  const { generateTextForPlatform } = await import('./openrouter');
  const optimized = await generateTextForPlatform(platform, `Optimize this content for ${platform}:\n\n${content}`, {
    category,
    temperature: 0.7,
  });

  // Ensure it fits platform limits
  if (optimized.length > PLATFORM_LIMITS[platform]) {
    const truncated = optimized.substring(0, PLATFORM_LIMITS[platform] - 10);
    return truncated + '...';
  }

  return optimized;
}

