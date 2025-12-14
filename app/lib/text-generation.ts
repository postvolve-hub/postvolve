/**
 * Text Generation Service
 * Orchestrates multi-platform text generation with optimization
 */

import { generateTextForPlatform, refinePrompt, summarizeUrlContent } from './openrouter';
import { buildTextGenerationPrompt, getPlatformSystemPrompt, type TextGenerationContext } from './prompts/text-generation';
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

      // Clean content - remove explanations and metadata
      let cleanContent = content.trim();
      
      // Remove markdown code blocks
      cleanContent = cleanContent.replace(/^```[\w]*\n?/gm, '').replace(/\n?```$/gm, '');
      
      // Remove explanation patterns
      const explanationPatterns = [
        /^Here's.*?:\s*/i,
        /^Here is.*?:\s*/i,
        /^---\s*/gm,
        /\*\*Why this works:\*\*/i,
        /\*\*.*?:\*\*/i,
        /^Would you like.*$/i,
        /^Happy to.*$/i,
        /^Format:.*$/i,
        /^Requirements:.*$/i,
        /^Note:.*$/i,
      ];
      
      explanationPatterns.forEach(pattern => {
        cleanContent = cleanContent.replace(pattern, '');
      });
      
      // Extract only post content (before any explanations)
      const postEndMarkers = [/---/, /\*\*Why/i, /Why this works/i, /Would you like/i];
      for (const marker of postEndMarkers) {
        const index = cleanContent.search(marker);
        if (index > 0) {
          cleanContent = cleanContent.substring(0, index).trim();
          break;
        }
      }
      
      // Extract hashtags
      const hashtagRegex = /#[\w]+/g;
      const hashtags = cleanContent.match(hashtagRegex) || [];
      let finalContent = cleanContent.replace(hashtagRegex, '').trim();
      
      // Ensure content fits platform limits (brief posts)
      const maxLength = platform === 'x' ? 280 : platform === 'linkedin' ? 200 : platform === 'instagram' ? 200 : 150;
      
      if (finalContent.length > maxLength) {
        const truncated = finalContent.substring(0, maxLength - 20);
        const lastSentence = truncated.lastIndexOf('.');
        finalContent = lastSentence > 50 
          ? truncated.substring(0, lastSentence + 1)
          : truncated.trim();
      }

      // Add hashtags back at end
      if (hashtags.length > 0) {
        finalContent += '\n\n' + hashtags.join(' ');
      }
      
      // Final length check including hashtags
      if (finalContent.length > PLATFORM_LIMITS[platform]) {
        const hashtagPart = '\n\n' + hashtags.join(' ');
        const maxContentLength = PLATFORM_LIMITS[platform] - hashtagPart.length - 10;
        finalContent = finalContent.substring(0, maxContentLength).trim() + hashtagPart;
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
  const optimized = await generateTextForPlatform(platform, `Optimize this content for ${platform}:\n\n${content}`, {
    category: category as any,
    temperature: 0.7,
  });

  // Ensure it fits platform limits
  if (optimized.length > PLATFORM_LIMITS[platform]) {
    const truncated = optimized.substring(0, PLATFORM_LIMITS[platform] - 10);
    return truncated + '...';
  }

  return optimized;
}

