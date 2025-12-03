import { useState } from "react";
import { 
  Settings as SettingsIcon, 
  Zap, 
  Clock, 
  Link2, 
  Bell, 
  Shield,
  Check,
  X as XIcon,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

const CATEGORIES = [
  { id: "tech", label: "Tech", description: "Technology news and updates" },
  { id: "ai", label: "AI", description: "Artificial intelligence insights" },
  { id: "business", label: "Business", description: "Business strategies and tips" },
  { id: "motivation", label: "Motivation", description: "Inspirational content" },
];

const CONNECTED_ACCOUNTS = [
  { id: 1, name: "LinkedIn", icon: "🔗", connected: true, username: "@johndoe" },
  { id: 2, name: "Twitter/X", icon: "𝕏", connected: true, username: "@johndoe" },
  { id: 3, name: "Facebook", icon: "📘", connected: false, username: null },
  { id: 4, name: "Instagram", icon: "📷", connected: false, username: null },
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
      <div className="space-y-8 max-w-4xl">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
          <p className="text-gray-500 mt-1">Manage your account preferences and integrations.</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-3">
            <div className="p-2 bg-[#6D28D9]/10 rounded-lg">
              <Zap className="h-5 w-5 text-[#6D28D9]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Auto Posting</h3>
              <p className="text-sm text-gray-500">Automatically publish approved drafts</p>
            </div>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <h4 className="font-medium text-gray-900">Enable Auto Posting</h4>
                <p className="text-sm text-gray-500 mt-1">
                  When enabled, approved posts will be published automatically at the scheduled time.
                </p>
              </div>
              <Switch
                checked={autoPosting}
                onCheckedChange={setAutoPosting}
                className="data-[state=checked]:bg-[#6D28D9]"
              />
            </div>
            {autoPosting && (
              <div className="mt-4 p-4 border border-[#6D28D9]/20 bg-[#6D28D9]/5 rounded-xl">
                <div className="flex items-center gap-2 text-[#6D28D9]">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm font-medium">Posting Schedule</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Posts will be automatically published at <strong>3:00 PM</strong> daily. 
                  You can customize the schedule in the Scheduler section.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-3">
            <div className="p-2 bg-[#6D28D9]/10 rounded-lg">
              <SettingsIcon className="h-5 w-5 text-[#6D28D9]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Content Categories</h3>
              <p className="text-sm text-gray-500">Select categories for content generation</p>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {CATEGORIES.map((category) => {
                const isSelected = selectedCategories.includes(category.id);
                return (
                  <button
                    key={category.id}
                    onClick={() => toggleCategory(category.id)}
                    className={`p-4 rounded-xl border-2 text-left transition-all duration-300 ${
                      isSelected
                        ? "border-[#6D28D9] bg-[#6D28D9]/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`font-medium ${isSelected ? 'text-[#6D28D9]' : 'text-gray-900'}`}>
                        {category.label}
                      </span>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-[#6D28D9] flex items-center justify-center">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{category.description}</p>
                  </button>
                );
              })}
            </div>
            <p className="text-sm text-gray-500 mt-4">
              {selectedCategories.length} of {CATEGORIES.length} categories selected
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-3">
            <div className="p-2 bg-[#6D28D9]/10 rounded-lg">
              <Link2 className="h-5 w-5 text-[#6D28D9]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Connected Accounts</h3>
              <p className="text-sm text-gray-500">Manage your social media integrations</p>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {CONNECTED_ACCOUNTS.map((account) => (
                <div
                  key={account.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{account.icon}</span>
                    <div>
                      <h4 className="font-medium text-gray-900">{account.name}</h4>
                      {account.connected ? (
                        <p className="text-sm text-gray-500">{account.username}</p>
                      ) : (
                        <p className="text-sm text-gray-400">Not connected</p>
                      )}
                    </div>
                  </div>
                  {account.connected ? (
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1.5 text-sm text-emerald-600">
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                        Connected
                      </span>
                      <Button variant="ghost" size="sm" className="text-gray-500 hover:text-red-500">
                        Disconnect
                      </Button>
                    </div>
                  ) : (
                    <Button variant="outline" size="sm" className="border-[#6D28D9] text-[#6D28D9] hover:bg-[#6D28D9]/5">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Connect
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-3">
            <div className="p-2 bg-[#6D28D9]/10 rounded-lg">
              <Bell className="h-5 w-5 text-[#6D28D9]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
              <p className="text-sm text-gray-500">Configure how you receive updates</p>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <h4 className="font-medium text-gray-900">Email Notifications</h4>
                <p className="text-sm text-gray-500">Receive updates about your posts via email</p>
              </div>
              <Switch
                checked={notifications.email}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, email: checked }))}
                className="data-[state=checked]:bg-[#6D28D9]"
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <h4 className="font-medium text-gray-900">Push Notifications</h4>
                <p className="text-sm text-gray-500">Get instant alerts on your device</p>
              </div>
              <Switch
                checked={notifications.push}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, push: checked }))}
                className="data-[state=checked]:bg-[#6D28D9]"
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <h4 className="font-medium text-gray-900">Weekly Summary</h4>
                <p className="text-sm text-gray-500">Receive a weekly performance report</p>
              </div>
              <Switch
                checked={notifications.weekly}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, weekly: checked }))}
                className="data-[state=checked]:bg-[#6D28D9]"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button variant="outline" className="border-gray-300">
            Cancel
          </Button>
          <Button className="bg-[#6D28D9] hover:bg-[#4C1D95] text-white shadow-lg shadow-purple-500/20 transition-all duration-300">
            Save Changes
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
