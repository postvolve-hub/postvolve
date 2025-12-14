"use client";

import { useState } from "react";
import { X, ExternalLink, Shield, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

// Social Platform Icons
const IconLinkedIn = ({ className = "h-6 w-6" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className={className}>
    <path d="M26.111,3H5.889c-1.595,0-2.889,1.293-2.889,2.889V26.111c0,1.595,1.293,2.889,2.889,2.889H26.111c1.595,0,2.889-1.293,2.889-2.889V5.889c0-1.595-1.293-2.889-2.889-2.889ZM10.861,25.389h-3.877V12.87h3.877v12.519Zm-1.957-14.158c-1.267,0-2.293-1.034-2.293-2.31s1.026-2.31,2.293-2.31,2.292,1.034,2.292,2.31-1.026,2.31-2.292,2.31Zm16.485,14.158h-3.858v-6.571c0-1.802-.685-2.809-2.111-2.809-1.551,0-2.362,1.048-2.362,2.809v6.571h-3.718V12.87h3.718v1.686s1.118-2.069,3.775-2.069,4.556,1.621,4.556,4.975v7.926Z" fill="currentColor" fillRule="evenodd" />
  </svg>
);

const IconX = ({ className = "h-6 w-6" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" className={className}>
    <path d="M 6.9199219 6 L 21.136719 26.726562 L 6.2285156 44 L 9.40625 44 L 22.544922 28.777344 L 32.986328 44 L 43 44 L 28.123047 22.3125 L 42.203125 6 L 39.027344 6 L 26.716797 20.261719 L 16.933594 6 L 6.9199219 6 z" fill="currentColor" />
  </svg>
);

const IconFacebook = ({ className = "h-6 w-6" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" className={className}>
    <path d="M25,3C12.85,3,3,12.85,3,25c0,11.03,8.125,20.137,18.712,21.728V30.831h-5.443v-5.783h5.443v-3.848 c0-6.371,3.104-9.168,8.399-9.168c2.536,0,3.877,0.188,4.512,0.274v5.048h-3.612c-2.248,0-3.033,2.131-3.033,4.533v3.161h6.588 l-0.894,5.783h-5.694v15.944C38.716,45.318,47,36.137,47,25C47,12.85,37.15,3,25,3z" fill="currentColor" />
  </svg>
);

const IconInstagram = ({ className = "h-6 w-6" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" className={className}>
    <path d="M 16 3 C 8.83 3 3 8.83 3 16 L 3 34 C 3 41.17 8.83 47 16 47 L 34 47 C 41.17 47 47 41.17 47 34 L 47 16 C 47 8.83 41.17 3 34 3 L 16 3 z M 37 11 C 38.1 11 39 11.9 39 13 C 39 14.1 38.1 15 37 15 C 35.9 15 35 14.1 35 13 C 35 11.9 35.9 11 37 11 z M 25 14 C 31.07 14 36 18.93 36 25 C 36 31.07 31.07 36 25 36 C 18.93 36 14 31.07 14 25 C 14 18.93 18.93 14 25 14 z M 25 16 C 20.04 16 16 20.04 16 25 C 16 29.96 20.04 34 25 34 C 29.96 34 34 29.96 34 25 C 34 20.04 29.96 16 25 16 z" fill="currentColor" />
  </svg>
);

type Platform = "linkedin" | "x" | "facebook" | "instagram";
type ConnectionState = "idle" | "connecting" | "success" | "error";

interface ConnectAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  platform: Platform | null;
  onSuccess?: (platform: Platform) => void;
}

const PLATFORM_CONFIG: Record<Platform, {
  name: string;
  icon: React.FC<{ className?: string }>;
  color: string;
  bgColor: string;
  permissions: string[];
}> = {
  linkedin: {
    name: "LinkedIn",
    icon: IconLinkedIn,
    color: "text-[#0A66C2]",
    bgColor: "bg-[#0A66C2]",
    permissions: [
      "View your basic profile information",
      "Post content on your behalf",
      "Access your connections (read-only)",
    ],
  },
  x: {
    name: "X",
    icon: IconX,
    color: "text-black",
    bgColor: "bg-black",
    permissions: [
      "Read your profile information",
      "Post tweets on your behalf",
      "View your followers",
    ],
  },
  facebook: {
    name: "Facebook",
    icon: IconFacebook,
    color: "text-[#1877F2]",
    bgColor: "bg-[#1877F2]",
    permissions: [
      "Access your Facebook Pages",
      "Post content to your Pages",
      "View page information",
    ],
  },
  instagram: {
    name: "Instagram",
    icon: IconInstagram,
    color: "text-[#E4405F]",
    bgColor: "bg-[#E4405F]",
    permissions: [
      "Access your Instagram account",
      "Post photos and videos",
      "View your profile information",
    ],
  },
};

export function ConnectAccountModal({
  isOpen,
  onClose,
  platform,
  onSuccess,
}: ConnectAccountModalProps) {
  const [connectionState, setConnectionState] = useState<ConnectionState>("idle");
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !platform) return null;

  const config = PLATFORM_CONFIG[platform];
  const IconComponent = config.icon;

  const handleConnect = async () => {
    setConnectionState("connecting");
    setError(null);

    try {
      // Get current user session
      const { supabase } = await import("@/lib/supabaseClient");
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.access_token) {
        setError("Please sign in to connect accounts");
        setConnectionState("error");
        return;
      }

      // Redirect to OAuth initiation endpoint
      // Get user ID from session
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError("Please sign in to connect accounts");
        setConnectionState("error");
        return;
      }

      if (platform === "linkedin") {
        // Redirect to LinkedIn OAuth with user ID
        window.location.href = `/api/auth/linkedin?userId=${user.id}`;
        // The redirect will happen, so we don't need to handle success here
        return;
      }

      if (platform === "x") {
        // Redirect to X OAuth with user ID
        window.location.href = `/api/auth/x?userId=${user.id}`;
        // The redirect will happen, so we don't need to handle success here
        return;
      }

      if (platform === "facebook") {
        // Redirect to Facebook Pages OAuth with user ID (for posting to Pages)
        window.location.href = `/api/auth/facebook-pages?userId=${user.id}`;
        // The redirect will happen, so we don't need to handle success here
        return;
      }

      if (platform === "instagram") {
        // Redirect to Instagram OAuth with user ID
        window.location.href = `/api/auth/instagram?userId=${user.id}`;
        // The redirect will happen, so we don't need to handle success here
        return;
      }

      // For other platforms (will be implemented later)
      setError("Platform not yet implemented");
      setConnectionState("error");
    } catch (err: any) {
      console.error("Connection error:", err);
      setError(err.message || "Failed to initiate connection");
      setConnectionState("error");
    }
  };

  const handleClose = () => {
    setConnectionState("idle");
    setError(null);
    onClose();
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-50 transition-opacity animate-in fade-in duration-200"
        onClick={handleClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Success State */}
          {connectionState === "success" && (
            <div className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Connected!</h3>
              <p className="text-sm text-gray-500">
                Your {config.name} account has been connected successfully.
              </p>
            </div>
          )}

          {/* Error State */}
          {connectionState === "error" && (
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-red-100">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">Connection Failed</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {error || "Unable to connect to your account. Please try again."}
                  </p>
                </div>
                <button onClick={handleClose} className="p-1 rounded-lg hover:bg-gray-100">
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <Button variant="outline" onClick={handleClose} className="rounded-xl">
                  Cancel
                </Button>
                <Button onClick={handleConnect} className="rounded-xl bg-[#6D28D9] hover:bg-[#5B21B6]">
                  Try Again
                </Button>
              </div>
            </div>
          )}

          {/* Connecting State */}
          {connectionState === "connecting" && (
            <div className="p-8 text-center">
              <div className={`w-16 h-16 rounded-full ${config.bgColor} flex items-center justify-center mx-auto mb-4`}>
                <Loader2 className="h-8 w-8 text-white animate-spin" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Connecting...</h3>
              <p className="text-sm text-gray-500">
                Redirecting you to {config.name} for authorization.
              </p>
            </div>
          )}

          {/* Idle State - Pre-OAuth Confirmation */}
          {connectionState === "idle" && (
            <>
              {/* Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl ${config.bgColor}`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Connect {config.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Authorize PostVolve to access your account
                      </p>
                    </div>
                  </div>
                  <button onClick={handleClose} className="p-1 rounded-lg hover:bg-gray-100">
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Permissions */}
              <div className="p-6">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                  <Shield className="h-4 w-4 text-[#6D28D9]" />
                  PostVolve will be able to:
                </div>
                <ul className="space-y-2">
                  {config.permissions.map((permission, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      {permission}
                    </li>
                  ))}
                </ul>

                {/* Facebook-specific tip about Pages */}
                {platform === "facebook" && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                    <div className="flex items-start gap-3">
                      <div className="p-1.5 rounded-lg bg-blue-100">
                        <AlertCircle className="h-4 w-4 text-blue-700" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-blue-900 mb-1">
                          Facebook Page required
                        </p>
                        <p className="text-xs text-blue-800 leading-relaxed">
                          To post to Facebook, you need to create a Facebook Page. After connecting, you'll be able to select which Page to use for posting.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Instagram-specific tip */}
                {platform === "instagram" && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                    <div className="flex items-start gap-3">
                      <div className="p-1.5 rounded-lg bg-blue-100">
                        <AlertCircle className="h-4 w-4 text-blue-700" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-blue-900 mb-1">
                          Professional account required
                        </p>
                        <p className="text-xs text-blue-800 leading-relaxed">
                          Your Instagram account must be a Professional (Business or Creator) account to enable posting. You can switch to a free Professional account in your Instagram settings.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Facebook professional account tip */}
                {platform === "facebook" && (
                  <div className="mt-4 p-4 bg-amber-50 border border-amber-100 rounded-xl">
                    <div className="flex items-start gap-3">
                      <div className="p-1.5 rounded-lg bg-amber-100">
                        <AlertCircle className="h-4 w-4 text-amber-700" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-amber-900 mb-1">
                          Professional account recommended
                        </p>
                        <p className="text-xs text-amber-800 leading-relaxed">
                          For best results, ensure your Facebook Page is set up as a Professional account. Learn more{" "}
                          <a
                            href="https://www.facebook.com/help/502981923235522"
                            target="_blank"
                            rel="noreferrer"
                            className="underline"
                          >
                            here
                          </a>.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-6 p-3 bg-blue-50 rounded-xl">
                  <p className="text-xs text-blue-700">
                    <strong>Note:</strong> You can revoke access at any time from your {config.name} settings 
                    or from the PostVolve Settings page.
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-100">
                <Button variant="outline" onClick={handleClose} className="rounded-xl">
                  Cancel
                </Button>
                <Button
                  onClick={handleConnect}
                  className={`rounded-xl ${config.bgColor} hover:opacity-90`}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Connect {config.name}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

