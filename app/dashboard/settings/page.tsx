"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ConnectAccountModal } from "@/components/dashboard/ConnectAccountModal";
import { ConfirmationModal } from "@/components/dashboard/ConfirmationModal";
import { toast } from "@/hooks/use-toast";

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

type Platform = "linkedin" | "twitter" | "facebook" | "instagram";

const CONNECTED_ACCOUNTS_INIT: Array<{
  id: number;
  platformId: Platform;
  name: string;
  icon: ({ className }: { className?: string }) => React.ReactElement;
  connected: boolean;
  username: string | null;
  color: string;
}> = [
  { id: 1, platformId: "linkedin", name: "LinkedIn", icon: IconLinkedIn, connected: true, username: "@johndoe", color: "text-blue-600" },
  { id: 2, platformId: "twitter", name: "Twitter/X", icon: IconX, connected: true, username: "@johndoe", color: "text-gray-900" },
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
}

export default function Settings() {
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
    { id: "2", time: "3:00 PM", days: ["mon", "wed", "fri"], platforms: ["twitter"], enabled: true },
  ]);

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
    setSelectedPlatform(platform);
    setConnectModalOpen(true);
  };

  const handleConnectSuccess = (platform: Platform) => {
    setConnectedAccounts(prev => prev.map(acc => 
      acc.platformId === platform 
        ? { ...acc, connected: true, username: "@connected_user" }
        : acc
    ));
    toast({
      title: "Account Connected",
      description: `Your ${platform} account has been connected successfully.`,
    });
  };

  const handleDisconnectAccount = (platform: Platform) => {
    setSelectedPlatform(platform);
    setDisconnectModalOpen(true);
  };

  const handleDisconnectConfirm = () => {
    if (selectedPlatform) {
      setConnectedAccounts(prev => prev.map(acc => 
        acc.platformId === selectedPlatform 
          ? { ...acc, connected: false, username: null }
          : acc
      ));
      toast({
        title: "Account Disconnected",
        description: `Your ${selectedPlatform} account has been disconnected.`,
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
              <Switch
                checked={autoPosting}
                onCheckedChange={setAutoPosting}
                className="data-[state=checked]:bg-[#6D28D9]"
              />
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
                    <div>
                        <h4 className="text-sm font-medium text-gray-900">{account.name}</h4>
                      {account.connected ? (
                          <p className="text-xs text-gray-500">{account.username}</p>
                      ) : (
                          <p className="text-xs text-gray-400">Not connected</p>
                      )}
                    </div>
                  </div>
                  {account.connected ? (
                      <div className="flex items-center gap-2">
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
                    </div>
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
