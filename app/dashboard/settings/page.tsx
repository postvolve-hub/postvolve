"use client";

import { useState } from "react";
import { 
  Clock, 
  Link2, 
  Bell, 
  Check,
  ExternalLink,
  MoreHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

// Custom Icons
const IconZap = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const IconSettings = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
  </svg>
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

const CONNECTED_ACCOUNTS = [
  { id: 1, name: "LinkedIn", icon: IconLinkedIn, connected: true, username: "@johndoe", color: "text-blue-600" },
  { id: 2, name: "Twitter/X", icon: IconX, connected: true, username: "@johndoe", color: "text-gray-900" },
  { id: 3, name: "Facebook", icon: IconFacebook, connected: false, username: null, color: "text-blue-600" },
  { id: 4, name: "Instagram", icon: IconInstagram, connected: false, username: null, color: "text-pink-600" },
];

export default function Settings() {
  const [autoPosting, setAutoPosting] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState(["tech", "ai", "business"]);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    weekly: false,
  });

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
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
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
            <div className="p-2 bg-[#6D28D9]/10 rounded-xl">
              <IconZap className="text-[#6D28D9]" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Auto Posting</h3>
              <p className="text-xs text-gray-500">Automatically publish approved drafts</p>
            </div>
          </div>
          <div className="p-5">
            <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Enable Auto Posting</h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  Approved posts will be published at the scheduled time.
                </p>
              </div>
              <Switch
                checked={autoPosting}
                onCheckedChange={setAutoPosting}
                className="data-[state=checked]:bg-[#6D28D9]"
              />
            </div>
            {autoPosting && (
              <div className="mt-3 p-4 border border-[#6D28D9]/20 bg-[#6D28D9]/5 rounded-xl transition-all duration-300">
                <div className="flex items-center gap-2 text-[#6D28D9]">
                  <Clock className="h-3.5 w-3.5" />
                  <span className="text-xs font-medium">Posting Schedule</span>
                </div>
                <p className="text-xs text-gray-600 mt-1.5">
                  Posts will be automatically published at <strong>3:00 PM</strong> daily.
                </p>
              </div>
            )}
          </div>
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
              {CONNECTED_ACCOUNTS.map((account, index) => {
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
                        <Button variant="ghost" size="sm" className="text-xs text-gray-500 hover:text-red-500 rounded-xl h-7 transition-all duration-200">
                          Disconnect
                        </Button>
                      </div>
                    ) : (
                      <Button variant="outline" size="sm" className="border-[#6D28D9] text-[#6D28D9] hover:bg-[#6D28D9]/5 rounded-xl h-7 text-xs transition-all duration-200">
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
