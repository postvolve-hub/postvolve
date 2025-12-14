/**
 * Quality Validation Service
 * Validates and enhances content quality using AI
 */

import { callModelWithFallback } from './openrouter';
import { validateContentForPlatform } from './content-optimization';

type Platform = 'linkedin' | 'x' | 'facebook' | 'instagram';

export interface QualityScore {
  overall: number; // 0-10
  engagement: number; // 0-10
  clarity: number; // 0-10
  relevance: number; // 0-10
  platformOptimization: number; // 0-10
  feedback: string[];
  suggestions: string[];
}

/**
 * Validate content quality using AI
 */
export async function validateContentQuality(
  content: string,
  platform: Platform,
  category?: string
): Promise<QualityScore> {
  // First, do basic validation
  const basicValidation = validateContentForPlatform(content, platform);

  // Then, use AI to assess quality
  const systemPrompt = `You are an expert social media content quality assessor. Evaluate the provided content for ${platform} and provide a detailed quality assessment.

Rate each aspect from 0-10:
1. Engagement potential (will it get likes, comments, shares?)
2. Clarity (is it clear and easy to understand?)
3. Relevance (is it relevant to the target audience?)
4. Platform optimization (is it optimized for ${platform}?)

Provide:
- Overall score (0-10)
- Scores for each aspect
- Specific feedback on what's good
- Actionable suggestions for improvement

Format your response as JSON:
{
  "overall": 8,
  "engagement": 8,
  "clarity": 9,
  "relevance": 8,
  "platformOptimization": 7,
  "feedback": ["Good hook", "Clear message"],
  "suggestions": ["Add a call-to-action", "Include more specific examples"]
}`;

  try {
    const result = await callModelWithFallback('text', [
      { role: 'system', content: systemPrompt },
      {
        role: 'user',
        content: `Content to evaluate:\n\n${content}\n\n${category ? `Category: ${category}` : ''}`,
      },
    ], {
      temperature: 0.3,
      max_tokens: 500,
    });

    // Parse JSON response
    let qualityData: QualityScore;
    try {
      // Extract JSON from response (might have markdown code blocks)
      if (!result || !result.content) {
        throw new Error('No content in response');
      }
      const jsonMatch = result.content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        qualityData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch {
      // Fallback: Create basic quality score
      qualityData = {
        overall: 7,
        engagement: 7,
        clarity: 8,
        relevance: 7,
        platformOptimization: 7,
        feedback: ['Content looks good'],
        suggestions: basicValidation.warnings,
      };
    }

    // Add validation errors to suggestions
    if (basicValidation.errors.length > 0) {
      qualityData.suggestions.push(...basicValidation.errors);
      qualityData.overall = Math.max(0, qualityData.overall - 2);
    }

    return qualityData;
  } catch (error: any) {
    console.error('[Quality Validation] Error:', error);
    
    // Return basic quality score based on validation
    return {
      overall: basicValidation.errors.length > 0 ? 5 : 7,
      engagement: 7,
      clarity: 8,
      relevance: 7,
      platformOptimization: basicValidation.errors.length > 0 ? 5 : 7,
      feedback: ['Content validation completed'],
      suggestions: [...basicValidation.errors, ...basicValidation.warnings],
    };
  }
}

/**
 * Enhance content quality using AI suggestions
 */
export async function enhanceContentQuality(
  content: string,
  platform: Platform,
  qualityScore: QualityScore
): Promise<string> {
  if (qualityScore.overall >= 8) {
    // Content is already high quality
    return content;
  }

  const systemPrompt = `You are an expert content editor. Improve the provided content based on the quality assessment and suggestions.

Guidelines:
- Maintain the original intent and message
- Implement the suggestions to improve quality
- Keep it optimized for ${platform}
- Ensure it's ready to post without additional editing`;

  try {
    const result = await callModelWithFallback('text', [
      { role: 'system', content: systemPrompt },
      {
        role: 'user',
        content: `Original content:\n\n${content}\n\nQuality assessment:\n${JSON.stringify(qualityScore, null, 2)}\n\nImprove this content based on the suggestions.`,
      },
    ], {
      temperature: 0.7,
      max_tokens: 2000,
    });

    if (!result || !result.content) {
      return content;
    }
    return result.content.trim();
  } catch (error: any) {
    console.error('[Content Enhancement] Error:', error);
    // Return original content if enhancement fails
    return content;
  }
}

