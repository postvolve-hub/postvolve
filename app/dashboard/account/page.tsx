"use client";

import { useState } from "react";
import { 
  User, 
  Mail, 
  Lock, 
  Globe, 
  Camera,
  Eye,
  EyeOff,
  Check,
  AlertTriangle,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ConfirmationModal } from "@/components/dashboard/ConfirmationModal";
import { toast } from "@/hooks/use-toast";

// Custom Icon
const IconShield = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

// Mock user data
const MOCK_USER = {
  name: "John Doe",
  email: "john.doe@example.com",
  avatar: null,
  timezone: "America/New_York",
  createdAt: "October 15, 2024",
  emailVerified: true,
  twoFactorEnabled: false
};

const TIMEZONES = [
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "Europe/London", label: "London (GMT)" },
  { value: "Europe/Paris", label: "Paris (CET)" },
  { value: "Asia/Tokyo", label: "Tokyo (JST)" },
  { value: "Australia/Sydney", label: "Sydney (AEST)" },
];

export default function AccountPage() {
  const [name, setName] = useState(MOCK_USER.name);
  const [email, setEmail] = useState(MOCK_USER.email);
  const [timezone, setTimezone] = useState(MOCK_USER.timezone);
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  const passwordsMatch = newPassword === confirmPassword && newPassword.length > 0;
  const canDeleteAccount = deleteConfirmText === "DELETE";

  const handleSaveProfile = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved successfully.",
    });
  };

  const handleChangePassword = async () => {
    if (!passwordsMatch) return;
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowPasswordSection(false);
    toast({
      title: "Password Changed",
      description: "Your password has been updated successfully.",
    });
  };

  const handleDeleteAccount = () => {
    toast({
      title: "Account Deleted",
      description: "Your account has been permanently deleted.",
    });
    // In real app, redirect to home
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in duration-500">
        {/* Header */}
        <div className="animate-in slide-in-from-bottom-2 duration-500">
          <h2 className="text-xl font-bold text-gray-900">Account Settings</h2>
          <p className="text-sm text-gray-500 mt-1">Manage your personal information and security.</p>
        </div>

        {/* Profile Section */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-in slide-in-from-bottom-2 duration-500 delay-75">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
            <div className="p-2 bg-[#6D28D9]/10 rounded-xl">
              <User className="h-4 w-4 text-[#6D28D9]" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Profile Information</h3>
              <p className="text-xs text-gray-500">Update your name and profile photo</p>
            </div>
          </div>
          <div className="p-5">
            <div className="flex flex-col sm:flex-row gap-6">
              {/* Avatar */}
              <div className="flex flex-col items-center gap-3">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#6D28D9] to-[#4C1D95] flex items-center justify-center text-white text-2xl font-bold">
                    {initials}
                  </div>
                  <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors">
                    <Camera className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
                <Button variant="ghost" size="sm" className="text-xs text-gray-500 hover:text-gray-700">
                  Remove photo
                </Button>
              </div>

              {/* Name & Email */}
              <div className="flex-1 space-y-4">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700 mb-1.5 block">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-11 border-gray-200 focus:ring-[#6D28D9]/20 focus:border-[#6D28D9]/30 rounded-xl"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-1.5 block">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-11 border-gray-200 focus:ring-[#6D28D9]/20 focus:border-[#6D28D9]/30 rounded-xl pr-24"
                      placeholder="Enter your email"
                    />
                    {MOCK_USER.emailVerified && (
                      <Badge className="absolute right-2 top-1/2 -translate-y-1/2 bg-green-50 text-green-600 border-green-200 text-xs">
                        <Check className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button 
                className="bg-[#6D28D9] hover:bg-[#5B21B6] rounded-xl"
                onClick={handleSaveProfile}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>

        {/* Timezone Section */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-in slide-in-from-bottom-2 duration-500 delay-100">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-xl">
              <Globe className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Timezone</h3>
              <p className="text-xs text-gray-500">Set your local timezone for scheduling</p>
            </div>
          </div>
          <div className="p-5">
            <Label htmlFor="timezone" className="text-sm font-medium text-gray-700 mb-1.5 block">
              Your Timezone
            </Label>
            <select
              id="timezone"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full h-11 px-3 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#6D28D9]/20 focus:border-[#6D28D9]/30 bg-white"
            >
              {TIMEZONES.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-2">
              All scheduled posts will use this timezone.
            </p>
          </div>
        </div>

        {/* Password Section */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-in slide-in-from-bottom-2 duration-500 delay-150">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-50 rounded-xl">
                <Lock className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Password & Security</h3>
                <p className="text-xs text-gray-500">Manage your password and security settings</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="rounded-xl text-xs"
              onClick={() => setShowPasswordSection(!showPasswordSection)}
            >
              {showPasswordSection ? "Cancel" : "Change Password"}
            </Button>
          </div>
          
          {showPasswordSection ? (
            <div className="p-5 space-y-4">
              <div>
                <Label htmlFor="currentPassword" className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Current Password
                </Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="h-11 border-gray-200 focus:ring-[#6D28D9]/20 focus:border-[#6D28D9]/30 rounded-xl pr-10"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <Label htmlFor="newPassword" className="text-sm font-medium text-gray-700 mb-1.5 block">
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="h-11 border-gray-200 focus:ring-[#6D28D9]/20 focus:border-[#6D28D9]/30 rounded-xl pr-10"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`h-11 border-gray-200 focus:ring-[#6D28D9]/20 focus:border-[#6D28D9]/30 rounded-xl pr-10 ${
                      confirmPassword && !passwordsMatch ? "border-red-300 focus:border-red-300" : ""
                    }`}
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {confirmPassword && !passwordsMatch && (
                  <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                )}
              </div>

              <div className="flex justify-end pt-2">
                <Button 
                  className="bg-[#6D28D9] hover:bg-[#5B21B6] rounded-xl"
                  disabled={!passwordsMatch || !currentPassword || isSaving}
                  onClick={handleChangePassword}
                >
                  {isSaving ? "Updating..." : "Update Password"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-5">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <IconShield className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Two-Factor Authentication</p>
                    <p className="text-xs text-gray-500">Add an extra layer of security</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-gray-500 border-gray-200">
                  Coming Soon
                </Badge>
              </div>
            </div>
          )}
        </div>

        {/* Account Info */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-in slide-in-from-bottom-2 duration-500 delay-200">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-xl">
              <Mail className="h-4 w-4 text-gray-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Account Information</h3>
              <p className="text-xs text-gray-500">Your account details</p>
            </div>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500 mb-1">Account Created</p>
                <p className="text-sm font-medium text-gray-900">{MOCK_USER.createdAt}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500 mb-1">Account ID</p>
                <p className="text-sm font-medium text-gray-900 font-mono">usr_1a2b3c4d5e6f</p>
              </div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-2xl border border-red-100 shadow-sm overflow-hidden animate-in slide-in-from-bottom-2 duration-500 delay-300">
          <div className="px-5 py-4 border-b border-red-100 bg-red-50/50 flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-xl">
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-red-700">Danger Zone</h3>
              <p className="text-xs text-red-600/80">Irreversible actions</p>
            </div>
          </div>
          <div className="p-5">
            {!showDeleteConfirm ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Delete Account</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Permanently delete your account and all associated data.
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  className="border-red-200 text-red-600 hover:bg-red-50 rounded-xl"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Account
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-sm text-red-700 font-medium mb-2">
                    Are you absolutely sure?
                  </p>
                  <p className="text-xs text-red-600">
                    This action cannot be undone. This will permanently delete your account, 
                    all your posts, analytics data, and connected social accounts.
                  </p>
                </div>
                <div>
                  <Label htmlFor="deleteConfirm" className="text-sm font-medium text-gray-700 mb-1.5 block">
                    Type <span className="font-mono font-bold text-red-600">DELETE</span> to confirm
                  </Label>
                  <Input
                    id="deleteConfirm"
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    className="h-11 border-gray-200 focus:ring-red-200 focus:border-red-300 rounded-xl font-mono"
                    placeholder="DELETE"
                  />
                </div>
                <div className="flex gap-3 justify-end">
                  <Button 
                    variant="outline" 
                    className="rounded-xl"
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setDeleteConfirmText("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    className="bg-red-600 hover:bg-red-700 rounded-xl"
                    disabled={!canDeleteAccount}
                    onClick={() => setDeleteModalOpen(true)}
                  >
                    Permanently Delete
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Final Delete Confirmation Modal */}
        <ConfirmationModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={() => {
            handleDeleteAccount();
            setDeleteModalOpen(false);
            setShowDeleteConfirm(false);
            setDeleteConfirmText("");
          }}
          title="Final Confirmation"
          description="This is your last chance to cancel. Once you confirm, your account and all data will be permanently deleted. This action is irreversible."
          confirmText="Yes, Delete Everything"
          cancelText="No, Keep My Account"
          variant="danger"
        />
      </div>
    </DashboardLayout>
  );
}

