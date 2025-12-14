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
 * Generate text content optimized for a specific platform
 */
export async function generateTextForPlatform(
  platform: 'linkedin' | 'x' | 'facebook' | 'instagram',
  prompt: string,
  options?: {
    category?: string;
    context?: string;
    temperature?: number;
    max_tokens?: number;
  }
): Promise<string> {
  const platformPrompts: Record<string, string> = {
    linkedin: 'Create a professional LinkedIn post that is engaging, informative, and suitable for a business audience. Include 3-5 relevant hashtags at the end.',
    x: 'Create a concise, engaging X (Twitter) post. Keep it under 280 characters. Include 1-2 relevant hashtags. Make it punchy and shareable.',
    facebook: 'Create a friendly, engaging Facebook post. Make it conversational and relatable. Include 1-3 relevant hashtags.',
    instagram: 'Create an engaging Instagram post caption. Make it visually descriptive and include 5-10 relevant hashtags at the end.',
  };

  const systemPrompt = `${platformPrompts[platform]}

${options?.category ? `Category: ${options.category}` : ''}
${options?.context ? `Additional context: ${options.context}` : ''}

Generate high-quality, engaging content that is optimized for ${platform}. Ensure it's ready to post without any additional editing.`;

  const messages: OpenRouterMessage[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: prompt },
  ];

  const result = await callModelWithFallback('text', messages, {
    temperature: options?.temperature ?? 0.8,
    max_tokens: options?.max_tokens ?? 2000,
    allowSkip: false, // Text generation is required, don't allow skip
  });

  // TypeScript: result cannot be null when allowSkip is false
  if (!result) {
    throw new Error('Text generation failed and cannot be skipped');
  }

  return result.content;
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
  let systemPrompt = `You are an expert content strategist. Your task is to refine and enhance user prompts to create the best possible social media content.

Guidelines:
- Expand vague prompts with relevant details
- Add context and depth
- Ensure the prompt will generate engaging, shareable content
- Maintain the user's original intent
- Add relevant keywords and topics
- Make it specific and actionable`;

  if (context?.category) {
    systemPrompt += `\n- Category: ${context.category}`;
  }
  if (context?.platform) {
    systemPrompt += `\n- Target platform: ${context.platform}`;
  }
  if (context?.urlContent) {
    systemPrompt += `\n- Source content context: ${context.urlContent.substring(0, 500)}...`;
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
  const systemPrompt = `You are an expert content curator. Extract and summarize the key points from the provided content to create engaging social media posts.

Guidelines:
- Extract the most important and shareable insights
- Identify the main topic and key takeaways
- Note any interesting statistics, quotes, or facts
- Identify the target audience
- Suggest angles for social media posts
- Keep it concise but comprehensive`;

  const userMessage = userPrompt
    ? `Content:\n${urlContent}\n\nUser's specific interest: ${userPrompt}\n\nExtract and summarize the key points.`
    : `Content:\n${urlContent}\n\nExtract and summarize the key points.`;

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

