"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Clock,
  Link2,
  Bell,
  Check,
  ExternalLink,
  MoreHorizontal,
  Plus,
  Trash2,
  Calendar,
  Settings as GearIcon,
  AlertCircle,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ConnectAccountModal } from "@/components/dashboard/ConnectAccountModal";
import { ConfirmationModal } from "@/components/dashboard/ConfirmationModal";
import { PaymentUpdatePrompt } from "@/components/dashboard/PaymentUpdatePrompt";
import { LockOverlay } from "@/components/dashboard/LockOverlay";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabaseClient";
import { getAccessPermissions, type Subscription } from "@/lib/subscription-access";

// Custom Icons
const IconZap = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const IconSettings = ({ className = "h-4 w-4" }: { className?: string }) => (
  <GearIcon className={className} />
);

// Social Icons
const IconLinkedIn = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className={className}>
    <path d="M26.111,3H5.889c-1.595,0-2.889,1.293-2.889,2.889V26.111c0,1.595,1.293,2.889,2.889,2.889H26.111c1.595,0,2.889-1.293,2.889-2.889V5.889c0-1.595-1.293-2.889-2.889-2.889ZM10.861,25.389h-3.877V12.87h3.877v12.519Zm-1.957-14.158c-1.267,0-2.293-1.034-2.293-2.31s1.026-2.31,2.293-2.31,2.292,1.034,2.292,2.31-1.026,2.31-2.292,2.31Zm16.485,14.158h-3.858v-6.571c0-1.802-.685-2.809-2.111-2.809-1.551,0-2.362,1.048-2.362,2.809v6.571h-3.718V12.87h3.718v1.686s1.118-2.069,3.775-2.069,4.556,1.621,4.556,4.975v7.926Z" fill="currentColor" fillRule="evenodd" />
  </svg>
);

const IconX = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" className={className}>
    <path d="M 6.9199219 6 L 21.136719 26.726562 L 6.2285156 44 L 9.40625 44 L 22.544922 28.777344 L 32.986328 44 L 43 44 L 28.123047 22.3125 L 42.203125 6 L 39.027344 6 L 26.716797 20.261719 L 16.933594 6 L 6.9199219 6 z" fill="currentColor" />
  </svg>
);

const IconFacebook = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" className={className}>
    <path d="M25,3C12.85,3,3,12.85,3,25c0,11.03,8.125,20.137,18.712,21.728V30.831h-5.443v-5.783h5.443v-3.848 c0-6.371,3.104-9.168,8.399-9.168c2.536,0,3.877,0.188,4.512,0.274v5.048h-3.612c-2.248,0-3.033,2.131-3.033,4.533v3.161h6.588 l-0.894,5.783h-5.694v15.944C38.716,45.318,47,36.137,47,25C47,12.85,37.15,3,25,3z" fill="currentColor" />
  </svg>
);

const IconInstagram = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" className={className}>
    <path d="M 16 3 C 8.83 3 3 8.83 3 16 L 3 34 C 3 41.17 8.83 47 16 47 L 34 47 C 41.17 47 47 41.17 47 34 L 47 16 C 47 8.83 41.17 3 34 3 L 16 3 z M 37 11 C 38.1 11 39 11.9 39 13 C 39 14.1 38.1 15 37 15 C 35.9 15 35 14.1 35 13 C 35 11.9 35.9 11 37 11 z M 25 14 C 31.07 14 36 18.93 36 25 C 36 31.07 31.07 36 25 36 C 18.93 36 14 31.07 14 25 C 14 18.93 18.93 14 25 14 z M 25 16 C 20.04 16 16 20.04 16 25 C 16 29.96 20.04 34 25 34 C 29.96 34 34 29.96 34 25 C 34 20.04 29.96 16 25 16 z" fill="currentColor" />
  </svg>
);

const CATEGORIES = [
  { id: "tech", label: "Tech", description: "Technology news and updates" },
  { id: "ai", label: "AI", description: "Artificial intelligence insights" },
  { id: "business", label: "Business", description: "Business strategies and tips" },
  { id: "motivation", label: "Motivation", description: "Inspirational content" },
];

type Platform = "linkedin" | "x" | "facebook" | "instagram";

const CONNECTED_ACCOUNTS_INIT: Array<{
  id: number;
  platformId: Platform;
  name: string;
  icon: ({ className }: { className?: string }) => React.ReactElement;
  connected: boolean;
  username: string | null;
  color: string;
}> = [
  { id: 1, platformId: "linkedin", name: "LinkedIn", icon: IconLinkedIn, connected: false, username: null, color: "text-blue-600" },
  { id: 2, platformId: "x", name: "X", icon: IconX, connected: false, username: null, color: "text-gray-900" },
  { id: 3, platformId: "facebook", name: "Facebook", icon: IconFacebook, connected: false, username: null, color: "text-blue-600" },
  { id: 4, platformId: "instagram", name: "Instagram", icon: IconInstagram, connected: false, username: null, color: "text-pink-600" },
];

// Time options for schedule dropdown
const TIME_OPTIONS = [
  "6:00 AM", "7:00 AM", "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM"
];

const DAYS_OF_WEEK = [
  { id: "mon", label: "M", fullName: "Monday" },
  { id: "tue", label: "T", fullName: "Tuesday" },
  { id: "wed", label: "W", fullName: "Wednesday" },
  { id: "thu", label: "T", fullName: "Thursday" },
  { id: "fri", label: "F", fullName: "Friday" },
  { id: "sat", label: "S", fullName: "Saturday" },
  { id: "sun", label: "S", fullName: "Sunday" },
];

interface Schedule {
  id: string;
  time: string;
  days: string[];
  platforms: string[];
  enabled: boolean;
}

interface ConnectedAccount {
  id: number;
  platformId: Platform;
  name: string;
  icon: ({ className }: { className?: string }) => React.ReactElement;
  connected: boolean;
  username: string | null;
  color: string;
  tokenExpiresAt?: string | null;
  isExpired?: boolean;
  expiresSoon?: boolean; // Expires within 7 days
}

export default function Settings() {
  const { user } = useAuth();
  const [autoPosting, setAutoPosting] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState(["tech", "ai", "business"]);
  const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccount[]>(CONNECTED_ACCOUNTS_INIT);
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [disconnectModalOpen, setDisconnectModalOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    weekly: false,
  });
  const [schedules, setSchedules] = useState<Schedule[]>([
    { id: "1", time: "9:00 AM", days: ["mon", "tue", "wed", "thu", "fri"], platforms: ["linkedin"], enabled: true },
    { id: "2", time: "3:00 PM", days: ["mon", "wed", "fri"], platforms: ["x"], enabled: true },
  ]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [permissions, setPermissions] = useState<any>(null);

  // Fetch subscription and check permissions
  useEffect(() => {
    async function fetchSubscription() {
      if (!user) return;

      try {
        const { data: subData, error } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (!error && subData) {
          setSubscription(subData);
          const perms = getAccessPermissions(subData);
          setPermissions(perms);
        } else {
          setPermissions(getAccessPermissions(null));
        }
      } catch (error) {
        console.error("Error fetching subscription:", error);
        setPermissions(getAccessPermissions(null));
      }
    }

    fetchSubscription();
  }, [user]);

  // Helper function to check if token is expired or expiring soon
  const checkTokenExpiration = (tokenExpiresAt: string | null | undefined) => {
    if (!tokenExpiresAt) return { isExpired: false, expiresSoon: false, daysUntilExpiry: null };
    
    const expiresAt = new Date(tokenExpiresAt);
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    const isExpired = expiresAt < now;
    const expiresSoon = !isExpired && expiresAt < sevenDaysFromNow;
    const daysUntilExpiry = Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    return { isExpired, expiresSoon, daysUntilExpiry };
  };

  // Helper function to refresh X tokens on-demand (no cron needed)
  const refreshXTokensIfNeeded = useCallback(async () => {
    if (!user) return;

    try {
      // Call API to refresh expiring X tokens
      const response = await fetch("/api/auth/refresh-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user.id }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.refreshed > 0) {
          console.log(`Refreshed ${result.refreshed} X token(s)`);
        }
      }
    } catch (error) {
      console.error("Error refreshing X tokens:", error);
      // Don't block the UI if refresh fails
    }
  }, [user]);

  // Helper function to update connected accounts from database
  const updateConnectedAccountsFromDB = useCallback(async () => {
    if (!user) return;

    try {
      // First, refresh X tokens if needed (on-demand, no cron)
      await refreshXTokensIfNeeded();

      // Fetch all accounts (including expired ones) to check expiration
      const { data: accounts, error } = await supabase
        .from("connected_accounts")
        .select("*")
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching connected accounts:", error);
        return;
      }

      console.log("Fetched connected accounts from DB:", accounts);

      // Check for expired tokens and update status if needed
      if (accounts) {
        for (const account of accounts) {
          if (account.status === "connected" && account.token_expires_at) {
            const { isExpired } = checkTokenExpiration(account.token_expires_at);
            
            if (isExpired) {
              // Update status to expired in database
              await supabase
                .from("connected_accounts")
                .update({ 
                  status: "expired",
                  updated_at: new Date().toISOString(),
                })
                .eq("id", account.id);
              
              console.log(`Token expired for ${account.platform}, updating status to expired`);
            }
          }
        }
      }

      // Now fetch connected and expired accounts for display
      const { data: connectedAccounts, error: connectedError } = await supabase
        .from("connected_accounts")
        .select("*")
        .eq("user_id", user.id)
        .in("status", ["connected", "expired"]);

      if (connectedError) {
        console.error("Error fetching connected accounts:", connectedError);
        return;
      }

      // Update connected accounts state - reset all to disconnected first, then update with database data
      setConnectedAccounts(prev => prev.map(acc => {
        // Map UI platform ID to database platform value
        // 'x' in UI maps to 'twitter' in database
        const dbPlatform = acc.platformId === "x" ? "twitter" : acc.platformId;
        const dbAccount = connectedAccounts?.find(a => a.platform === dbPlatform);
        
        // Handle both connected and expired accounts
        if (dbAccount && (dbAccount.status === "connected" || dbAccount.status === "expired")) {
          // If status is expired, treat as disconnected but show reconnect option
          const isAccountExpired = dbAccount.status === "expired";
          
          // Check token expiration (for connected accounts only)
          const { isExpired, expiresSoon } = dbAccount.status === "connected" 
            ? checkTokenExpiration(dbAccount.token_expires_at)
            : { isExpired: true, expiresSoon: false };
          
          // Format username for display
          let displayUsername = dbAccount.platform_username || dbAccount.platform_display_name;
          if (!displayUsername) {
            // Fallback: use platform_user_id or a default
            const userId = dbAccount.platform_user_id;
            displayUsername = userId && userId.length > 8 
              ? `@${userId.slice(-8)}` 
              : "@connected";
          } else if (!displayUsername.startsWith("@")) {
            // Ensure username starts with @
            displayUsername = `@${displayUsername}`;
          }
          
          console.log(`Updating ${acc.platformId} to ${isAccountExpired ? 'expired' : 'connected'} with username: ${displayUsername}, expired: ${isAccountExpired || isExpired}, expiresSoon: ${expiresSoon}`);
          
          return {
            ...acc,
            connected: !isAccountExpired, // Show as disconnected if account status is expired
            username: displayUsername,
            tokenExpiresAt: dbAccount.token_expires_at,
            isExpired: isAccountExpired || isExpired, // Mark as expired if account status is expired
            expiresSoon: expiresSoon,
          };
        }
        // Reset to disconnected if not found in database
        return {
          ...acc,
          connected: false,
          username: null,
          tokenExpiresAt: null,
          isExpired: false,
          expiresSoon: false,
        };
      }));
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  }, [user, refreshXTokensIfNeeded]);

  // Fetch connected accounts from database on mount
  useEffect(() => {
    updateConnectedAccountsFromDB();
  }, [updateConnectedAccountsFromDB]);

  // Handle OAuth callback success/error
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const connected = searchParams.get("connected");
    const error = searchParams.get("error");

    if (connected === "linkedin") {
      toast({
        title: "Account Connected",
        description: "Your LinkedIn account has been connected successfully.",
      });
      // Clear URL params
      window.history.replaceState({}, "", window.location.pathname);
      // Refresh connected accounts
      updateConnectedAccountsFromDB();
    }

    if (connected === "x") {
      toast({
        title: "Account Connected",
        description: "Your X account has been connected successfully.",
      });
      // Clear URL params
      window.history.replaceState({}, "", window.location.pathname);
      // Refresh connected accounts
      updateConnectedAccountsFromDB();
    }

    if (connected === "facebook") {
      toast({
        title: "Account Connected",
        description: "Your Facebook account has been connected successfully.",
      });
      // Clear URL params
      window.history.replaceState({}, "", window.location.pathname);
      // Refresh connected accounts
      updateConnectedAccountsFromDB();
    }

    if (connected === "instagram") {
      toast({
        title: "Account Connected",
        description: "Your Instagram account has been connected successfully.",
      });
      // Clear URL params
      window.history.replaceState({}, "", window.location.pathname);
      // Refresh connected accounts
      updateConnectedAccountsFromDB();
    }

    if (error) {
      const errorMessages: Record<string, string> = {
        linkedin_auth_failed: "LinkedIn authorization was cancelled or failed.",
        x_auth_failed: "X authorization was cancelled or failed.",
        facebook_auth_failed: "Facebook authorization was cancelled or failed.",
        facebook_pages_auth_failed: "Facebook Pages authorization was cancelled or failed.",
        instagram_auth_failed: "Instagram authorization was cancelled or failed.",
        missing_params: "Missing required parameters. Please try again.",
        invalid_state: "Invalid authorization state. Please try again.",
        oauth_not_configured: "OAuth is not properly configured.",
        token_exchange_failed: "Failed to exchange authorization code. Please try again.",
        no_access_token: "No access token received. Please try again.",
        callback_failed: "Connection failed. Please check server logs and try again.",
        database_error: "Database error occurred. Please check server logs.",
        token_error: "Token processing error. Please try again.",
      };

      toast({
        title: "Connection Failed",
        description: errorMessages[error] || "An error occurred during connection.",
        variant: "destructive",
      });
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [updateConnectedAccountsFromDB]);

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const addSchedule = () => {
    const newSchedule: Schedule = {
      id: Date.now().toString(),
      time: "12:00 PM",
      days: ["mon", "tue", "wed", "thu", "fri"],
      platforms: ["linkedin"],
      enabled: true,
    };
    setSchedules(prev => [...prev, newSchedule]);
  };

  const removeSchedule = (scheduleId: string) => {
    if (schedules.length > 1) {
      setSchedules(prev => prev.filter(s => s.id !== scheduleId));
    }
  };

  const updateSchedule = (scheduleId: string, updates: Partial<Schedule>) => {
    setSchedules(prev => prev.map(s => 
      s.id === scheduleId ? { ...s, ...updates } : s
    ));
  };

  const toggleScheduleDay = (scheduleId: string, dayId: string) => {
    setSchedules(prev => prev.map(s => {
      if (s.id !== scheduleId) return s;
      const newDays = s.days.includes(dayId)
        ? s.days.filter(d => d !== dayId)
        : [...s.days, dayId];
      return { ...s, days: newDays.length > 0 ? newDays : s.days };
    }));
  };

  const handleConnectAccount = (platform: Platform) => {
    if (!permissions?.canConnectAccounts) {
      toast({
        title: "Access Restricted",
        description: permissions?.message || "Update your payment method to connect accounts.",
        variant: "destructive",
      });
      return;
    }
    setSelectedPlatform(platform);
    setConnectModalOpen(true);
  };

  const handleConnectSuccess = async (platform: Platform) => {
    // Refresh accounts from database
    await updateConnectedAccountsFromDB();
  };

  const handleDisconnectAccount = (platform: Platform) => {
    setSelectedPlatform(platform);
    setDisconnectModalOpen(true);
  };

  const handleDisconnectConfirm = async () => {
    if (!selectedPlatform || !user) return;

    try {
      // Map UI platform ID to database platform value
      // 'x' in UI maps to 'twitter' in database
      const dbPlatform = selectedPlatform === "x" ? "twitter" : selectedPlatform;
      
      // Update account status in database
      const { error } = await supabase
        .from("connected_accounts")
        .update({ 
          status: "disconnected",
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id)
        .eq("platform", dbPlatform);

      if (error) {
        console.error("Error disconnecting account:", error);
        toast({
          title: "Error",
          description: "Failed to disconnect account. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Get display name for platform
      const platformName = selectedPlatform === "x" ? "X" : selectedPlatform.charAt(0).toUpperCase() + selectedPlatform.slice(1);
      
      toast({
        title: "Account Disconnected",
        description: `Your ${platformName} account has been disconnected successfully.`,
      });

      // Update local state immediately
      setConnectedAccounts(prev => prev.map(acc => 
        acc.platformId === selectedPlatform 
          ? { ...acc, connected: false, username: null }
          : acc
      ));

      // Log activity
      await supabase.from("activity_log").insert({
        user_id: user.id,
        activity_type: "account_disconnected",
        description: `${platformName} account disconnected`,
        metadata: { platform: selectedPlatform },
      } as any);
    } catch (error) {
      console.error("Disconnect error:", error);
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    }

    setDisconnectModalOpen(false);
    setSelectedPlatform(null);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-500">
        {/* Header */}
        <div className="animate-in slide-in-from-bottom-2 duration-500">
          <h2 className="text-xl font-bold text-gray-900">Settings</h2>
          <p className="text-sm text-gray-500 mt-1">Manage your account preferences and integrations.</p>
        </div>

        {/* Auto Posting */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-in slide-in-from-bottom-2 duration-500 delay-75">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#6D28D9]/10 rounded-xl">
                <IconZap className="text-[#6D28D9]" />
          </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Auto Posting</h3>
                <p className="text-xs text-gray-500">Automatically publish approved drafts</p>
              </div>
              </div>
              <div className="relative">
                {permissions && !permissions.canUseAutoPosting && (
                  <LockOverlay
                    message={permissions.message || "Your subscription is inactive. Update your payment method to enable auto-posting."}
                    actionLabel="Update Payment"
                    actionPath="/dashboard/billing"
                    showIcon={false}
                  />
                )}
                <Switch
                  checked={autoPosting}
                  onCheckedChange={(checked) => {
                    if (permissions?.canUseAutoPosting) {
                      setAutoPosting(checked);
                    }
                  }}
                  disabled={!permissions?.canUseAutoPosting}
                  className="data-[state=checked]:bg-[#6D28D9]"
                />
              </div>
            </div>
          
            {autoPosting && (
            <div className="p-5 space-y-4">
              {/* Schedules Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-900">Posting Schedules</span>
                  <Badge variant="outline" className="text-xs text-[#6D28D9] border-[#6D28D9]/20 bg-[#6D28D9]/5">
                    {schedules.length} active
                  </Badge>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs rounded-xl h-8 border-[#6D28D9]/30 text-[#6D28D9] hover:bg-[#6D28D9]/5"
                  onClick={addSchedule}
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Add Schedule
                </Button>
              </div>

              {/* Schedule Cards */}
              <div className="space-y-3">
                {schedules.map((schedule, index) => (
                  <div 
                    key={schedule.id}
                    className={`p-4 border rounded-xl transition-all duration-200 ${
                      schedule.enabled 
                        ? "border-[#6D28D9]/20 bg-[#6D28D9]/5" 
                        : "border-gray-200 bg-gray-50 opacity-60"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      {/* Time & Days */}
                      <div className="flex-1 space-y-3">
                        {/* Time Selector */}
                        <div className="flex items-center gap-3">
                          <Clock className={`h-4 w-4 ${schedule.enabled ? "text-[#6D28D9]" : "text-gray-400"}`} />
                          <select
                            value={schedule.time}
                            onChange={(e) => updateSchedule(schedule.id, { time: e.target.value })}
                            disabled={!schedule.enabled}
                            className="h-9 px-3 text-sm font-medium border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#6D28D9]/20 focus:border-[#6D28D9]/30 disabled:opacity-50"
                          >
                            {TIME_OPTIONS.map(time => (
                              <option key={time} value={time}>{time}</option>
                            ))}
                          </select>
                        </div>

                        {/* Days Selector */}
                        <div className="flex items-center gap-1">
                          {DAYS_OF_WEEK.map((day) => {
                            const isActive = schedule.days.includes(day.id);
                            return (
                              <button
                                key={day.id}
                                onClick={() => toggleScheduleDay(schedule.id, day.id)}
                                disabled={!schedule.enabled}
                                title={day.fullName}
                                className={`w-8 h-8 rounded-full text-xs font-medium transition-all duration-200 disabled:opacity-50 ${
                                  isActive
                                    ? "bg-[#6D28D9] text-white"
                                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                }`}
                              >
                                {day.label}
                              </button>
                            );
                          })}
                        </div>

                        {/* Platform Tags */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">Post to:</span>
                          <div className="flex gap-1">
                            {["linkedin", "twitter"].map(platform => {
                              const isSelected = schedule.platforms.includes(platform);
                              return (
                                <button
                                  key={platform}
                                  onClick={() => {
                                    const newPlatforms = isSelected
                                      ? schedule.platforms.filter(p => p !== platform)
                                      : [...schedule.platforms, platform];
                                    if (newPlatforms.length > 0) {
                                      updateSchedule(schedule.id, { platforms: newPlatforms });
                                    }
                                  }}
                                  disabled={!schedule.enabled}
                                  className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-200 disabled:opacity-50 ${
                                    isSelected
                                      ? platform === "linkedin" 
                                        ? "bg-blue-100 text-blue-700" 
                                        : "bg-gray-900 text-white"
                                      : "bg-gray-100 text-gray-500"
                                  }`}
                                >
                                  {platform === "linkedin" ? "LinkedIn" : "X"}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Controls */}
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={schedule.enabled}
                          onCheckedChange={(checked) => updateSchedule(schedule.id, { enabled: checked })}
                          className="data-[state=checked]:bg-[#6D28D9]"
                        />
                        {schedules.length > 1 && (
                          <button
                            onClick={() => removeSchedule(schedule.id)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                            title="Remove schedule"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pro tip */}
              <div className="p-3 bg-amber-50 border border-amber-200/50 rounded-xl">
                <p className="text-xs text-amber-700">
                  <strong>Pro tip:</strong> Posting at different times increases your reach across time zones. 
                  LinkedIn performs best between 9-11 AM, while X/Twitter sees higher engagement around 12-3 PM.
                </p>
              </div>
              </div>
            )}
        </div>

        {/* Content Categories */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-in slide-in-from-bottom-2 duration-500 delay-100">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
            <div className="p-2 bg-[#6D28D9]/10 rounded-xl">
              <IconSettings className="text-[#6D28D9]" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Content Categories</h3>
              <p className="text-xs text-gray-500">Select categories for content generation</p>
            </div>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CATEGORIES.map((category, index) => {
                const isSelected = selectedCategories.includes(category.id);
                return (
                  <button
                    key={category.id}
                    onClick={() => toggleCategory(category.id)}
                    className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                      isSelected
                        ? "border-[#6D28D9] bg-[#6D28D9]/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-medium ${isSelected ? 'text-[#6D28D9]' : 'text-gray-900'}`}>
                        {category.label}
                      </span>
                      {isSelected && (
                        <div className="w-4 h-4 rounded-full bg-[#6D28D9] flex items-center justify-center">
                          <Check className="h-2.5 w-2.5 text-white" />
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{category.description}</p>
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-gray-500 mt-3">
              {selectedCategories.length} of {CATEGORIES.length} categories selected
            </p>
          </div>
        </div>

        {/* Connected Accounts */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-in slide-in-from-bottom-2 duration-500 delay-150">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
            <div className="p-2 bg-[#6D28D9]/10 rounded-xl">
              <Link2 className="h-4 w-4 text-[#6D28D9]" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Connected Accounts</h3>
              <p className="text-xs text-gray-500">Manage your social media integrations</p>
            </div>
          </div>
          <div className="p-5">
            <div className="space-y-3">
              {connectedAccounts.map((account, index) => {
                const IconComponent = account.icon;
                return (
                <div
                  key={account.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-xl hover:border-gray-300 transition-all duration-200"
                    style={{ animationDelay: `${index * 50}ms` }}
                >
                    <div className="flex items-center gap-3">
                      <div className={account.color}>
                        <IconComponent />
                      </div>
                    <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">{account.name}</h4>
                      {account.connected || account.isExpired ? (
                          <>
                            <p className="text-xs text-gray-500">{account.username}</p>
                            {/* Show expiration warnings for all platforms when expired */}
                            {account.isExpired && (
                              <div className="flex items-center gap-1 mt-1">
                                <AlertCircle className="h-3 w-3 text-red-500" />
                                <p className="text-xs text-red-600 font-medium">
                                  {account.platformId === "x" 
                                    ? "Refresh token expired - Reconnect required" 
                                    : "Token expired - Reconnect required"}
                                </p>
                              </div>
                            )}
                            {/* Show expiration warning for LinkedIn when expiring soon (but not expired) */}
                            {account.platformId === "linkedin" && account.expiresSoon && !account.isExpired && account.tokenExpiresAt && (
                              <div className="flex items-center gap-1 mt-1">
                                <AlertTriangle className="h-3 w-3 text-amber-500" />
                                <p className="text-xs text-amber-600">
                                  Token expires in {checkTokenExpiration(account.tokenExpiresAt).daysUntilExpiry} {checkTokenExpiration(account.tokenExpiresAt).daysUntilExpiry === 1 ? 'day' : 'days'}
                                </p>
                              </div>
                            )}
                          </>
                      ) : (
                          <p className="text-xs text-gray-400">Not connected</p>
                      )}
                    </div>
                  </div>
                  {account.connected ? (
                      <div className="flex items-center gap-2">
                        {/* Show reconnect button when expired (for any platform) */}
                        {account.isExpired ? (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-red-500 text-red-600 hover:bg-red-50 rounded-xl h-7 text-xs transition-all duration-200"
                            onClick={() => handleConnectAccount(account.platformId)}
                          >
                            <ExternalLink className="h-3 w-3 mr-1.5" />
                            Reconnect
                          </Button>
                        ) : account.platformId === "linkedin" && account.expiresSoon ? (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-amber-500 text-amber-600 hover:bg-amber-50 rounded-xl h-7 text-xs transition-all duration-200"
                            onClick={() => handleConnectAccount(account.platformId)}
                          >
                            <ExternalLink className="h-3 w-3 mr-1.5" />
                            Reconnect
                          </Button>
                        ) : (
                          <>
                            <span className="flex items-center gap-1 text-xs text-emerald-600">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                              Connected
                            </span>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-xs text-gray-500 hover:text-red-500 rounded-xl h-7 transition-all duration-200"
                              onClick={() => handleDisconnectAccount(account.platformId)}
                            >
                              Disconnect
                            </Button>
                          </>
                        )}
                    </div>
                  ) : account.isExpired ? (
                      // Show reconnect button for expired accounts (even though not "connected")
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-red-500 text-red-600 hover:bg-red-50 rounded-xl h-7 text-xs transition-all duration-200"
                        onClick={() => handleConnectAccount(account.platformId)}
                      >
                        <ExternalLink className="h-3 w-3 mr-1.5" />
                        Reconnect
                      </Button>
                  ) : (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-[#6D28D9] text-[#6D28D9] hover:bg-[#6D28D9]/5 rounded-xl h-7 text-xs transition-all duration-200"
                        onClick={() => handleConnectAccount(account.platformId)}
                      >
                        <ExternalLink className="h-3 w-3 mr-1.5" />
                      Connect
                    </Button>
                  )}
                </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Connect Account Modal */}
        <ConnectAccountModal
          isOpen={connectModalOpen}
          onClose={() => {
            setConnectModalOpen(false);
            setSelectedPlatform(null);
          }}
          platform={selectedPlatform}
          onSuccess={handleConnectSuccess}
        />

        {/* Disconnect Confirmation Modal */}
        <ConfirmationModal
          isOpen={disconnectModalOpen}
          onClose={() => {
            setDisconnectModalOpen(false);
            setSelectedPlatform(null);
          }}
          onConfirm={handleDisconnectConfirm}
          title="Disconnect Account"
          description={`Are you sure you want to disconnect your ${selectedPlatform} account? You won't be able to post to this platform until you reconnect.`}
          confirmText="Disconnect"
          cancelText="Keep Connected"
          variant="danger"
        />

        {/* Notifications */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-in slide-in-from-bottom-2 duration-500 delay-200">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
            <div className="p-2 bg-[#6D28D9]/10 rounded-xl">
              <Bell className="h-4 w-4 text-[#6D28D9]" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
              <p className="text-xs text-gray-500">Configure how you receive updates</p>
            </div>
          </div>
          <div className="p-5 space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50/50 rounded-xl">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
                <p className="text-xs text-gray-500">Receive updates via email</p>
              </div>
              <Switch
                checked={notifications.email}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, email: checked }))}
                className="data-[state=checked]:bg-[#6D28D9]"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50/50 rounded-xl">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Push Notifications</h4>
                <p className="text-xs text-gray-500">Get instant alerts on your device</p>
              </div>
              <Switch
                checked={notifications.push}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, push: checked }))}
                className="data-[state=checked]:bg-[#6D28D9]"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50/50 rounded-xl">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Weekly Summary</h4>
                <p className="text-xs text-gray-500">Receive a weekly performance report</p>
              </div>
              <Switch
                checked={notifications.weekly}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, weekly: checked }))}
                className="data-[state=checked]:bg-[#6D28D9]"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end gap-3 animate-in slide-in-from-bottom-2 duration-500 delay-300">
          <Button variant="outline" className="border-gray-200 rounded-xl h-9 text-sm transition-all duration-200">
            Cancel
          </Button>
          <Button className="bg-[#6D28D9] hover:bg-[#5B21B6] text-white shadow-sm hover:shadow-md transition-all duration-200 rounded-xl h-9 text-sm">
            Save Changes
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
