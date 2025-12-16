/**
 * Platform validation utilities
 * Checks if user has connected accounts for specific platforms
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

export interface PlatformValidationResult {
  platform: string;
  connected: boolean;
  status: 'connected' | 'expired' | 'disconnected';
  username?: string | null;
  error?: string;
}

export interface ValidationSummary {
  allConnected: boolean;
  connectedPlatforms: string[];
  missingPlatforms: string[];
  expiredPlatforms: string[];
  results: PlatformValidationResult[];
}

/**
 * Validate if user has connected accounts for the specified platforms
 */
export async function validatePlatformConnections(
  userId: string,
  platforms: string[]
): Promise<ValidationSummary> {
  const results: PlatformValidationResult[] = [];
  const connectedPlatforms: string[] = [];
  const missingPlatforms: string[] = [];
  const expiredPlatforms: string[] = [];

  // Map UI platform names to database platform names
  const platformMap: Record<string, string> = {
    linkedin: 'linkedin',
    x: 'twitter',
    twitter: 'twitter',
    facebook: 'facebook',
    instagram: 'instagram',
  };

  for (const platform of platforms) {
    const dbPlatform = platformMap[platform] || platform;

    try {
      const { data: account, error } = await supabaseAdmin
        .from('connected_accounts')
        .select('status, platform_username, platform_display_name')
        .eq('user_id', userId)
        .eq('platform', dbPlatform)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        results.push({
          platform,
          connected: false,
          status: 'disconnected',
          error: 'Database error',
        });
        missingPlatforms.push(platform);
        continue;
      }

      if (!account) {
        results.push({
          platform,
          connected: false,
          status: 'disconnected',
          error: 'Account not connected',
        });
        missingPlatforms.push(platform);
        continue;
      }

      if (account.status === 'connected') {
        results.push({
          platform,
          connected: true,
          status: 'connected',
          username: account.platform_username || account.platform_display_name || null,
        });
        connectedPlatforms.push(platform);
      } else if (account.status === 'expired') {
        results.push({
          platform,
          connected: false,
          status: 'expired',
          username: account.platform_username || account.platform_display_name || null,
          error: 'Token expired - reconnect required',
        });
        expiredPlatforms.push(platform);
      } else {
        results.push({
          platform,
          connected: false,
          status: 'disconnected',
          username: account.platform_username || account.platform_display_name || null,
          error: 'Account not connected',
        });
        missingPlatforms.push(platform);
      }
    } catch (error: any) {
      results.push({
        platform,
        connected: false,
        status: 'disconnected',
        error: error.message || 'Unknown error',
      });
      missingPlatforms.push(platform);
    }
  }

  return {
    allConnected: missingPlatforms.length === 0 && expiredPlatforms.length === 0,
    connectedPlatforms,
    missingPlatforms,
    expiredPlatforms,
    results,
  };
}

/**
 * Get user-friendly error message for validation failures
 */
export function getValidationErrorMessage(summary: ValidationSummary): string {
  if (summary.allConnected) {
    return '';
  }

  const missing = summary.missingPlatforms.length;
  const expired = summary.expiredPlatforms.length;

  if (missing > 0 && expired > 0) {
    return `Please connect ${summary.missingPlatforms.join(', ')} and reconnect ${summary.expiredPlatforms.join(', ')} before publishing.`;
  } else if (missing > 0) {
    return `Please connect ${summary.missingPlatforms.join(', ')} before publishing.`;
  } else if (expired > 0) {
    return `Please reconnect ${summary.expiredPlatforms.join(', ')} - your tokens have expired.`;
  }

  return 'Please connect at least one social media account before publishing.';
}

