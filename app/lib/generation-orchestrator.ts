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
  uploadedImageUrl?: string;
}

/**
 * Main generation orchestrator
 * Handles the complete pipeline: extraction → refinement → generation → optimization → validation
 */
export async function generateContent(
  options: GenerationOptions
): Promise<GenerationResult> {
  const { lane, category, platforms, url, userPrompt, baseContent, uploadedImageUrl } = options;

  // Step 1: Content Extraction (for URL lane) or Auto Generation
  let extractedContent: string | undefined;
  let title = 'Generated Post';

  if (lane === 'url' && url) {
    console.log('[Orchestrator] Extracting content from URL...');
    const extracted = await extractUrlContent(url);
    title = extracted.title;
    extractedContent = prepareContentForAI(extracted);
  } else if (lane === 'auto') {
    // For auto lane, generate content based on category and trends
    // No URL or user prompt needed - AI generates from category context
    const categoryName = category || 'tech';
    console.log('[Orchestrator] Auto-generating content for category:', categoryName);
    title = `AI-Generated ${categoryName.charAt(0).toUpperCase() + categoryName.slice(1)} Content`;
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
  const [textResults, imageResult] = await Promise.all([
    // Generate text for all platforms
    generateMultiPlatformText({
      category: category || 'tech',
      platforms: platforms || ['linkedin'],
      baseContent: refinedPrompt,
      urlContent: extractedContent,
      userPrompt,
    }),
    // Generate image (if not uploaded)
    uploadedImageUrl
      ? Promise.resolve({
          imageUrl: uploadedImageUrl,
          model: 'uploaded',
          quality: 'high',
          prompt: 'User uploaded image',
        } as GeneratedImage)
      : generatePostImage({
          textContent: refinedPrompt || title,
          category: category || 'tech',
          platform: platforms?.[0] || 'linkedin',
          quality: 'high',
        }),
  ]);

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

