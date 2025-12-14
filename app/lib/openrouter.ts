/**
 * OpenRouter API Client
 * Handles text generation with smart fallback strategy
 * Uses free models with automatic fallback on failure
 */

interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenRouterResponse {
  id: string;
  model: string;
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

interface ModelConfig {
  primary: string;
  fallback: string[];
  task: 'text' | 'prompt-refine' | 'url-summarization';
}

// Model configurations - optimized for free tier
const MODEL_CONFIGS: Record<string, ModelConfig> = {
  text: {
    primary: 'google/gemini-2.0-flash-exp:free',
    fallback: [
      'google/gemma-3-27b-it:free',
      'mistralai/devstral-2512:free',
      'qwen/qwen3-235b-a22b:free',
      // Removed: 'meta-llama/llama-3.1-8b-instruct:free' - returns 404
    ],
    task: 'text',
  },
  'prompt-refine': {
    primary: 'google/gemini-2.0-flash-exp:free',
    fallback: [
      'google/gemma-3-27b-it:free',
      'mistralai/devstral-2512:free',
      'qwen/qwen3-235b-a22b:free',
      // Removed: 'meta-llama/llama-3.1-8b-instruct:free' - returns 404
    ],
    task: 'prompt-refine',
  },
  'url-summarization': {
    primary: 'google/gemini-2.0-flash-exp:free',
    fallback: [
      'google/gemma-3-27b-it:free',
      'mistralai/devstral-2512:free',
      'qwen/qwen3-235b-a22b:free',
    ],
    task: 'url-summarization',
  },
};

/**
 * Check if error is a rate limit error
 */
function isRateLimitError(error: any): boolean {
  const errorMessage = error?.message || '';
  return (
    errorMessage.includes('429') ||
    errorMessage.includes('rate limit') ||
    errorMessage.includes('Rate limit') ||
    errorMessage.includes('Rate limit exceeded') ||
    errorMessage.includes('free-models-per-day')
  );
}

/**
 * Check if error is a model not found error
 */
function isModelNotFoundError(error: any): boolean {
  const errorMessage = error?.message || '';
  return (
    errorMessage.includes('404') ||
    errorMessage.includes('No endpoints found') ||
    errorMessage.includes('not found')
  );
}

/**
 * Call OpenRouter API with a specific model
 */
async function callOpenRouter(
  model: string,
  messages: OpenRouterMessage[],
  options?: {
    temperature?: number;
    max_tokens?: number;
    top_p?: number;
  }
): Promise<OpenRouterResponse> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not configured');
  }

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      'X-Title': 'PostVolve',
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.max_tokens ?? 2000,
      top_p: options?.top_p ?? 1,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenRouter API error (${response.status}): ${errorText}`);
  }

  return response.json();
}

/**
 * Call model with automatic fallback strategy
 * Tries primary model first, then falls back through fallback list
 * Optimized for best results while handling rate limits gracefully
 */
export async function callModelWithFallback(
  task: 'text' | 'prompt-refine' | 'url-summarization',
  messages: OpenRouterMessage[],
  options?: {
    temperature?: number;
    max_tokens?: number;
    top_p?: number;
    allowSkip?: boolean; // Allow graceful skip if all models are rate-limited
  }
): Promise<{
  content: string;
  model: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
} | null> {
  const config = MODEL_CONFIGS[task];
  if (!config) {
    throw new Error(`Unknown task: ${task}`);
  }

  const models = [config.primary, ...config.fallback];
  const errors: Array<{ model: string; error: string }> = [];
  let rateLimited = false;
  let allRateLimited = true;

  for (const model of models) {
    try {
      console.log(`[OpenRouter] Trying model: ${model} for task: ${task}`);
      const result = await callOpenRouter(model, messages, options);
      
      if (result.choices && result.choices.length > 0) {
        const content = result.choices[0].message.content;
        if (!content || content.trim().length === 0) {
          throw new Error('Empty response from model');
        }

        console.log(`[OpenRouter] Success with model: ${model}`);
        return {
          content: content.trim(),
          model,
          usage: result.usage,
        };
      } else {
        throw new Error('No choices in response');
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Unknown error';
      const isRateLimit = isRateLimitError(error);
      const isNotFound = isModelNotFoundError(error);
      
      if (isRateLimit) {
        rateLimited = true;
        console.warn(`[OpenRouter] Model ${model} rate-limited`);
      } else if (!isNotFound) {
        // If it's not a rate limit and not a 404, there might be other issues
        allRateLimited = false;
      }
      
      console.warn(`[OpenRouter] Model ${model} failed: ${errorMessage}`);
      errors.push({ model, error: errorMessage });
      
      // Skip 404 models immediately (don't waste time)
      if (isNotFound) {
        continue;
      }
      
      // Continue to next model
      continue;
    }
  }

  // All models failed
  // If all were rate-limited and allowSkip is true, return null for graceful degradation
  if (options?.allowSkip && rateLimited && allRateLimited) {
    console.warn(`[OpenRouter] All models rate-limited for task ${task}. Graceful skip enabled.`);
    return null;
  }

  throw new Error(
    `All models failed for task ${task}. Errors: ${JSON.stringify(errors)}`
  );
}

/**
 * Generate universal brief post for all platforms (max 280 chars)
 * Optimized prompt for best results
 */
export async function generateUniversalPost(
  prompt: string,
  options?: {
    category?: string;
    context?: string;
    temperature?: number;
    max_tokens?: number;
  }
): Promise<string> {
  // Ultra-optimized system prompt (perfection-focused)
  const systemPrompt = `Create brief social media post. Max 280 characters. Engaging, shareable. Include 3-5 hashtags. NO title. NO explanations. Output ONLY the post text.`;

  const messages: OpenRouterMessage[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: prompt },
  ];

  const result = await callModelWithFallback('text', messages, {
    temperature: options?.temperature ?? 0.8,
    max_tokens: options?.max_tokens ?? 150, // Very tight for 280 char limit
    allowSkip: false,
  });

  if (!result) {
    throw new Error('Text generation failed');
  }

  // Aggressive content cleaning
  let content = result.content.trim();
  
  // Remove markdown
  content = content.replace(/^```[\w]*\n?/gm, '').replace(/\n?```$/gm, '');
  content = content.replace(/\*\*/g, '');
  content = content.replace(/^#+\s*/gm, '');
  
  // Remove all explanation patterns
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
    /^\d+\.\s+/gm,
    /^[\*\*]*[🚀💡✨🔥⭐]+[\*\*]*\s*/gm, // Emoji titles
    /^\*\*[^*]+\*\*\s*/gm, // Bold titles
  ];
  
  patterns.forEach(pattern => {
    content = content.replace(pattern, '');
  });
  
  // Remove title patterns (short lines at start that look like titles)
  const lines = content.split('\n');
  if (lines.length > 1) {
    const firstLine = lines[0].trim();
    // If first line is short and looks like a title, remove it
    if (firstLine.length < 80 && (firstLine.endsWith('?') || firstLine.match(/^[A-Z][^.!?]*[.!?]$/))) {
      content = lines.slice(1).join('\n').trim();
    }
  }
  
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
    const index = content.search(marker);
    if (index > 0 && index < content.length * 0.7) {
      content = content.substring(0, index).trim();
      break;
    }
  }
  
  return content.trim();
}

/**
 * Refine and enhance a user prompt using AI
 * Gracefully falls back to original prompt if rate-limited or all models fail
 * Optimized to always return usable content
 */
export async function refinePrompt(
  userPrompt: string,
  context?: {
    category?: string;
    platform?: string;
    urlContent?: string;
  }
): Promise<string> {
  let systemPrompt = `Refine this prompt for social media content. Add relevant details. Keep it concise. Output ONLY the refined prompt.`;

  if (context?.category) {
    systemPrompt += ` Category: ${context.category}`;
  }
  if (context?.platform) {
    systemPrompt += ` Platform: ${context.platform}`;
  }
  if (context?.urlContent) {
    systemPrompt += ` Source: ${context.urlContent.substring(0, 300)}`;
  }

  const messages: OpenRouterMessage[] = [
    { role: 'system', content: systemPrompt },
    {
      role: 'user',
      content: `Refine this prompt to create the best social media content:\n\n${userPrompt}`,
    },
  ];

  try {
    const result = await callModelWithFallback('prompt-refine', messages, {
      temperature: 0.7,
      max_tokens: 500,
      allowSkip: true, // Allow graceful skip if rate-limited
    });

    // If null (rate-limited), return original prompt (graceful degradation)
    if (!result) {
      console.warn('[OpenRouter] Prompt refinement skipped due to rate limits. Using original prompt for best results.');
      return userPrompt;
    }

    // TypeScript: result is guaranteed to be non-null here
    return result.content;
  } catch (error: any) {
    // If all models failed, use original prompt (graceful degradation)
    console.warn('[OpenRouter] Prompt refinement failed. Using original prompt for best results:', error.message);
    return userPrompt;
  }
}

/**
 * Summarize and extract key points from URL content
 * Gracefully falls back to truncated content if rate-limited or all models fail
 * Optimized to always return usable content
 */
export async function summarizeUrlContent(
  urlContent: string,
  userPrompt?: string
): Promise<string> {
  const systemPrompt = `Summarize article. Extract key points. Brief. Output ONLY summary.`;

  const userMessage = userPrompt
    ? `Article: ${urlContent.substring(0, 1500)} Focus: ${userPrompt}`
    : `Article: ${urlContent.substring(0, 1500)}`;

  const messages: OpenRouterMessage[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userMessage },
  ];

  try {
    const result = await callModelWithFallback('url-summarization', messages, {
      temperature: 0.7,
      max_tokens: 1500,
      allowSkip: true, // Allow graceful skip if rate-limited
    });

    // If null (rate-limited), return truncated original content (graceful degradation)
    if (!result) {
      console.warn('[OpenRouter] URL summarization skipped due to rate limits. Using truncated content for best results.');
      // Return first 2000 characters of content as fallback
      return urlContent.length > 2000 ? urlContent.substring(0, 2000) + '...' : urlContent;
    }

    return result.content;
  } catch (error: any) {
    // If all models failed, return truncated original content (graceful degradation)
    console.warn('[OpenRouter] URL summarization failed. Using truncated content for best results:', error.message);
    return urlContent.length > 2000 ? urlContent.substring(0, 2000) + '...' : urlContent;
  }
}

