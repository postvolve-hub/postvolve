/**
 * Generation Orchestrator
 * Main service that orchestrates the entire content generation pipeline
 */

import { extractUrlContent, prepareContentForAI } from './content-extraction';
import { refinePrompt } from './openrouter';
import { generateMultiPlatformText, type GeneratedText } from './text-generation';
import { generatePostImage, type GeneratedImage } from './image-generation';
import { validateContentQuality, enhanceContentQuality } from './quality-validation';
import { optimizeContentFormatForPlatform } from './content-optimization';
// Platform type for generation
type Platform = 'linkedin' | 'x' | 'facebook' | 'instagram';

export interface GenerationResult {
  title: string;
  content: GeneratedText[];
  image: GeneratedImage;
  category: string;
  lane: 'auto' | 'url' | 'custom';
  qualityScore?: {
    overall: number;
    feedback: string[];
    suggestions: string[];
  };
}

export interface GenerationOptions {
  lane: 'auto' | 'url' | 'custom';
  category?: 'tech' | 'ai' | 'business' | 'motivation';
  platforms?: Platform[];
  url?: string;
  userPrompt?: string;
  baseContent?: string;
  userId?: string; // For downloading external images to our storage
  uploadedImageUrl?: string;
}

/**
 * Main generation orchestrator
 * Handles the complete pipeline: extraction → refinement → generation → optimization → validation
 */
export async function generateContent(
  options: GenerationOptions
): Promise<GenerationResult> {
  const { lane, category, platforms, url, userPrompt, baseContent, uploadedImageUrl, userId } = options;

  // Step 1: Content Extraction (for URL lane) or Auto Generation
  let extractedContent: string | undefined;
  let title = 'Generated Post'; // Title only for image generation, not in post content

  if (lane === 'url' && url) {
    console.log('[Orchestrator] Extracting content from URL...');
    const extracted = await extractUrlContent(url);
    title = extracted.title; // Use for image only
    extractedContent = prepareContentForAI(extracted);
  } else if (lane === 'auto') {
    // For auto lane, generate content based on category and trends
    const categoryName = category || 'tech';
    console.log('[Orchestrator] Auto-generating content for category:', categoryName);
    title = `${categoryName.charAt(0).toUpperCase() + categoryName.slice(1)} News`; // For image only
  }

  // Step 2: Prompt Refinement (optional - gracefully handles rate limits)
  console.log('[Orchestrator] Refining prompt...');
  let refinedPrompt = userPrompt || baseContent || extractedContent || '';
  
  if (refinedPrompt && (userPrompt || extractedContent)) {
    try {
      const refined = await refinePrompt(refinedPrompt, {
        category,
        urlContent: extractedContent,
      });
      refinedPrompt = refined; // Use refined or original if refinement failed/rate-limited
      console.log('[Orchestrator] Prompt refined successfully');
    } catch (error: any) {
      console.warn('[Orchestrator] Prompt refinement failed, using original for best results:', error.message);
      // Continue with original prompt (graceful degradation)
    }
  }

  // Step 3: Parallel Generation (Text + Image)
  console.log('[Orchestrator] Generating content...');
  
  // Generate text (required)
  const textResults = await generateMultiPlatformText({
    category: category || 'tech',
    platforms: platforms || ['linkedin'],
    baseContent: refinedPrompt,
    urlContent: extractedContent,
    userPrompt,
  });

  // Generate image (optional - graceful fallback on failure)
  let imageResult: GeneratedImage;
  if (uploadedImageUrl) {
    imageResult = {
      imageUrl: uploadedImageUrl,
      model: 'uploaded',
      quality: 'high',
      prompt: 'User uploaded image',
    };
  } else {
    try {
      imageResult = await generatePostImage({
        textContent: title || refinedPrompt || 'Social Media Post',
        category: category || 'tech',
        platform: platforms?.[0] || 'linkedin',
        quality: 'high',
        userId: options.userId, // Pass userId to download external images
      });
    } catch (error: any) {
      console.warn('[Orchestrator] Image generation failed, using placeholder:', error.message);
      // Fallback to placeholder image
      imageResult = {
        imageUrl: 'https://via.placeholder.com/1200x630?text=Image+Generation+Failed',
        model: 'placeholder',
        quality: 'low',
        prompt: 'Placeholder - generation failed',
      };
    }
  }

  // Step 4: Quality Validation & Enhancement
  console.log('[Orchestrator] Validating quality...');
  const qualityScores = await Promise.all(
    textResults.map(async (text) => {
      const score = await validateContentQuality(text.content, text.platform, category);
      
      // Enhance if quality is below threshold
      if (score.overall < 7) {
        const enhanced = await enhanceContentQuality(
          text.content,
          text.platform,
          score
        );
        return {
          ...text,
          content: enhanced,
          qualityScore: score,
        };
      }
      
      return {
        ...text,
        qualityScore: score,
      };
    })
  );

  // Step 5: Final Optimization
  console.log('[Orchestrator] Final optimization...');
  const optimizedContent = qualityScores.map((text) => ({
    ...text,
    content: optimizeContentFormatForPlatform(text.content, text.platform),
  }));

  // Calculate average quality score
  const avgQualityScore = qualityScores.reduce(
    (sum, text) => sum + (text.qualityScore?.overall || 7),
    0
  ) / qualityScores.length;

  return {
    title,
    content: optimizedContent,
    image: imageResult,
    category: category || 'tech',
    lane,
    qualityScore: {
      overall: avgQualityScore,
      feedback: qualityScores.flatMap((t) => t.qualityScore?.feedback || []),
      suggestions: qualityScores.flatMap((t) => t.qualityScore?.suggestions || []),
    },
  };
}

