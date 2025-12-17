/**
 * React hook to check user's connected accounts
 */

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export interface ConnectedAccountStatus {
  platform: string;
  connected: boolean;
  status: 'connected' | 'expired' | 'disconnected';
  username?: string | null;
}

export function useConnectedAccounts(userId: string | null) {
  const [accounts, setAccounts] = useState<ConnectedAccountStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAccounts() {
      if (!userId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('connected_accounts')
          .select('platform, status, platform_username, platform_display_name')
          .eq('user_id', userId)
          .in('status', ['connected', 'expired']);

        if (error) throw error;

        const accountStatuses: ConnectedAccountStatus[] = (data || []).map((acc: any) => ({
          platform: acc.platform === 'twitter' ? 'x' : acc.platform,
          connected: acc.status === 'connected',
          status: acc.status,
          username: acc.platform_username || acc.platform_display_name || null,
        }));

        setAccounts(accountStatuses);
      } catch (error) {
        console.error('Error fetching connected accounts:', error);
        setAccounts([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAccounts();
  }, [userId]);

  const hasConnectedAccount = (platform: string): boolean => {
    const dbPlatform = platform === 'x' ? 'twitter' : platform;
    return accounts.some(
      acc => acc.platform === dbPlatform && acc.connected
    );
  };

  const hasAnyConnectedAccount = (): boolean => {
    return accounts.some(acc => acc.connected);
  };

  const getConnectedPlatforms = (): string[] => {
    return accounts
      .filter(acc => acc.connected)
      .map(acc => acc.platform);
  };

  return {
    accounts,
    isLoading,
    hasConnectedAccount,
    hasAnyConnectedAccount,
    getConnectedPlatforms,
  };
}



