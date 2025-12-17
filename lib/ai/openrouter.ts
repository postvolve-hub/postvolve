/**
 * Minimal OpenRouter types shim to resolve duplicate export issues.
 * This file intentionally exports TaskType once to avoid conflicts.
 */

// Supported task types for OpenRouter calls in this project
export type TaskType = 'text' | 'prompt-refine' | 'url-summarization';

// Re-export helper shapes used elsewhere (keep minimal to avoid conflicts)
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenRouterResponse {
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}



