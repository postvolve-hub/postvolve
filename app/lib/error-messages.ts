/**
 * User-friendly error message utilities
 * Converts technical error codes to human-readable messages
 */

export interface ErrorContext {
  platform?: string;
  userId?: string;
  postId?: string;
  action?: string;
}

export function getUserFriendlyErrorMessage(
  error: string | Error | unknown,
  context?: ErrorContext
): string {
  const errorString = typeof error === 'string' 
    ? error 
    : error instanceof Error 
    ? error.message 
    : String(error);

  // Platform-specific errors
  if (errorString.includes('no_linkedin_account') || errorString.includes('LinkedIn')) {
    return 'LinkedIn account is not connected. Please connect your LinkedIn account in Settings.';
  }
  
  if (errorString.includes('no_x_account') || errorString.includes('no_twitter_account') || errorString.includes('X (Twitter)')) {
    return 'X (Twitter) account is not connected. Please connect your X account in Settings.';
  }
  
  if (errorString.includes('no_facebook_account') || errorString.includes('Facebook')) {
    return 'Facebook account is not connected. Please connect your Facebook account in Settings.';
  }
  
  if (errorString.includes('no_instagram_account')) {
    return 'Instagram account is not connected. Please connect your Instagram account in Settings.';
  }
  
  if (errorString.includes('publish_failed') && errorString.includes('Instagram')) {
    return 'Failed to publish to Instagram. Please check that your account is a Business or Creator account and try again.';
  }
  
  if (errorString.includes('container_creation_failed') || errorString.includes('image_required')) {
    return 'Instagram requires an image. Please ensure your post has an image attached.';
  }

  // Connection status errors
  if (errorString.includes('account_not_connected') || errorString.includes('not_connected')) {
    const platform = context?.platform || 'social media';
    return `${platform.charAt(0).toUpperCase() + platform.slice(1)} account is not connected. Please reconnect in Settings.`;
  }

  if (errorString.includes('expired') || errorString.includes('token expired')) {
    const platform = context?.platform || 'account';
    return `${platform.charAt(0).toUpperCase() + platform.slice(1)} connection has expired. Please reconnect in Settings.`;
  }

  // Validation errors
  if (errorString.includes('platforms_not_connected') || errorString.includes('not connected')) {
    return 'Some selected platforms are not connected. Please connect all selected platforms in Settings before publishing.';
  }

  if (errorString.includes('no_platforms') || errorString.includes('No platforms')) {
    return 'No platforms selected for publishing. Please select at least one platform.';
  }

  // Content errors
  if (errorString.includes('message_too_long') || errorString.includes('character limit')) {
    return 'Post content exceeds the character limit. Please shorten your content.';
  }

  if (errorString.includes('No content found')) {
    return 'Post content is missing. Please add content before publishing.';
  }

  // Image errors
  if (errorString.includes('image') && errorString.includes('required')) {
    return 'An image is required for this platform. Please add an image to your post.';
  }

  // Network errors
  if (errorString.includes('network') || errorString.includes('fetch') || errorString.includes('ECONNREFUSED')) {
    return 'Network error. Please check your internet connection and try again.';
  }

  if (errorString.includes('timeout') || errorString.includes('ETIMEDOUT')) {
    return 'Request timed out. Please try again.';
  }

  // Authentication errors
  if (errorString.includes('unauthorized') || errorString.includes('401')) {
    return 'You are not authorized to perform this action. Please sign in again.';
  }

  if (errorString.includes('forbidden') || errorString.includes('403')) {
    return 'You do not have permission to perform this action.';
  }

  // Not found errors
  if (errorString.includes('not_found') || errorString.includes('404')) {
    return context?.action 
      ? `${context.action} not found. It may have been deleted.`
      : 'Resource not found.';
  }

  // Server errors
  if (errorString.includes('server_error') || errorString.includes('500') || errorString.includes('Internal Server Error')) {
    return 'A server error occurred. Please try again in a few moments.';
  }

  // Database errors
  if (errorString.includes('database') || errorString.includes('PGRST')) {
    return 'Database error. Please try again.';
  }

  // OAuth errors
  if (errorString.includes('oauth_not_configured')) {
    return 'Social media integration is not configured. Please contact support.';
  }

  // Rate limit errors
  if (errorString.includes('rate limit') || errorString.includes('429') || errorString.includes('too many requests')) {
    return 'Too many requests. Please wait a moment and try again.';
  }

  // Generic fallback
  if (errorString.length > 0 && errorString.length < 200) {
    // Capitalize first letter and add period if missing
    let message = errorString.trim();
    if (message.length > 0) {
      message = message.charAt(0).toUpperCase() + message.slice(1);
      if (!message.endsWith('.') && !message.endsWith('!') && !message.endsWith('?')) {
        message += '.';
      }
    }
    return message;
  }

  return 'An unexpected error occurred. Please try again.';
}

/**
 * Get actionable error message with suggested fix
 */
export function getActionableErrorMessage(
  error: string | Error | unknown,
  context?: ErrorContext
): { message: string; action?: { label: string; href: string } } {
  const errorString = typeof error === 'string' 
    ? error 
    : error instanceof Error 
    ? error.message 
    : String(error);

  const baseMessage = getUserFriendlyErrorMessage(error, context);

  // Add actionable suggestions
  if (errorString.includes('not_connected') || errorString.includes('expired')) {
    return {
      message: baseMessage,
      action: {
        label: 'Go to Settings',
        href: '/dashboard/settings',
      },
    };
  }

  if (errorString.includes('subscription') || errorString.includes('payment')) {
    return {
      message: baseMessage,
      action: {
        label: 'Upgrade Plan',
        href: '/dashboard/billing',
      },
    };
  }

  return { message: baseMessage };
}







