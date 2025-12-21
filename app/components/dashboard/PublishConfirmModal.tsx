"use client";

import { useState, useEffect } from "react";
import { X, Send, Check, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useConnectedAccounts } from "@/lib/hooks/use-connected-accounts";

// Social Platform Icons
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

const PLATFORMS = [
  { id: "linkedin", name: "LinkedIn", icon: IconLinkedIn, color: "text-[#0A66C2]" },
  { id: "x", name: "X", icon: IconX, color: "text-black" },
  { id: "facebook", name: "Facebook", icon: IconFacebook, color: "text-[#1877F2]" },
  { id: "instagram", name: "Instagram", icon: IconInstagram, color: "text-[#E4405F]" },
];

interface Post {
  id: string;
  title: string;
  content?: string | null;
  image_url?: string | null;
  post_platforms?: Array<{
    platform: string;
    content: string;
    status: string;
  }>;
}

interface PublishConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post | null;
  onPublishComplete?: (results: any[]) => void;
}

export function PublishConfirmModal({
  isOpen,
  onClose,
  post,
  onPublishComplete,
}: PublishConfirmModalProps) {
  const { user } = useAuth();
  const { isConnected, isLoading: isLoadingAccounts, getConnectedPlatforms } = useConnectedAccounts(user?.id || null);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Get saved platforms from post (normalized to UI names)
  const savedPlatforms = post?.post_platforms?.map(pp => 
    pp.platform === 'twitter' ? 'x' : pp.platform
  ) || [];

  // Initialize selected platforms AFTER accounts finish loading
  useEffect(() => {
    if (!isOpen) {
      setHasInitialized(false);
      setSelectedPlatforms([]);
      return;
    }
    
    // Wait for accounts to load before initializing
    if (isLoadingAccounts) return;
    
    // Only initialize once per modal open
    if (hasInitialized) return;
    
    // Get the connected platforms list
    const connectedList = getConnectedPlatforms();
    
    if (savedPlatforms.length > 0) {
      // Pre-select saved platforms that are also connected
      const validPlatforms = savedPlatforms.filter(p => connectedList.includes(p));
      setSelectedPlatforms(validPlatforms);
    } else {
      // No saved platforms - default to all connected platforms
      setSelectedPlatforms(connectedList);
    }
    
    setHasInitialized(true);
  }, [isOpen, isLoadingAccounts, hasInitialized, getConnectedPlatforms, savedPlatforms.join(',')]);

  if (!isOpen || !post) return null;

  const togglePlatform = (platformId: string) => {
    if (!isConnected(platformId)) {
      const platformName = PLATFORMS.find(p => p.id === platformId)?.name || platformId;
      toast({
        title: "Account Not Connected",
        description: `Please connect your ${platformName} account in Settings before selecting it.`,
        variant: "destructive",
      });
      return;
    }

    setSelectedPlatforms(prev => {
      if (prev.includes(platformId)) {
        return prev.filter(p => p !== platformId);
      }
      return [...prev, platformId];
    });
  };

  const handlePublish = async () => {
    if (!user || selectedPlatforms.length === 0) return;

    setIsPublishing(true);

    try {
      // Validate platform connections
      const validateResponse = await fetch(
        `/api/platforms/validate?userId=${user.id}&platforms=${selectedPlatforms.join(',')}`
      );

      if (!validateResponse.ok) {
        const error = await validateResponse.json();
        throw new Error(error.message || 'Failed to validate platform connections');
      }

      const validation = await validateResponse.json();

      if (!validation.valid) {
        toast({
          title: "Platforms Not Connected",
          description: validation.message || "Please connect your social media accounts before publishing.",
          variant: "destructive",
        });
        setIsPublishing(false);
        return;
      }

      // Publish to selected platforms
      const response = await fetch(`/api/posts/${post.id}/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          platforms: selectedPlatforms,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to publish post');
      }

      toast({
        title: "Published Successfully",
        description: `Post published to ${selectedPlatforms.length} platform${selectedPlatforms.length > 1 ? 's' : ''}.`,
      });

      onPublishComplete?.(result.results || []);
      onClose();
    } catch (error: any) {
      console.error('Publish error:', error);
      toast({
        title: "Publish Failed",
        description: error.message || "Failed to publish post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Confirm Publish</h2>
            <p className="text-sm text-gray-500">Select platforms to publish to</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content - Platform Selection Only */}
        <div className="p-6">
          {isLoadingAccounts ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-[#6D28D9]" />
              <span className="ml-2 text-sm text-gray-500">Loading accounts...</span>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3">
                {PLATFORMS.map((platform) => {
                  const isSelected = selectedPlatforms.includes(platform.id);
                  const isPlatformConnected = isConnected(platform.id);
                  const IconComponent = platform.icon;

                  return (
                    <button
                      key={platform.id}
                      onClick={() => togglePlatform(platform.id)}
                      disabled={isPublishing}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 ${
                        isSelected
                          ? "border-[#6D28D9] bg-[#6D28D9]/5"
                          : isPlatformConnected
                            ? "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                            : "border-gray-200 bg-gray-50 opacity-50"
                      }`}
                    >
                      <IconComponent className={`h-6 w-6 ${platform.color}`} />
                      <div className="flex-1 text-left">
                        <span className={`text-sm ${isSelected ? "font-semibold text-gray-900" : "text-gray-600"}`}>
                          {platform.name}
                        </span>
                        {!isPlatformConnected && (
                          <p className="text-[10px] text-red-500">Not connected</p>
                        )}
                      </div>
                      {isSelected && (
                        <Check className="h-5 w-5 text-[#6D28D9]" />
                      )}
                    </button>
                  );
                })}
              </div>
              {selectedPlatforms.length === 0 && (
                <p className="text-xs text-amber-600 mt-4 flex items-center justify-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Select at least one platform to publish
                </p>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 rounded-xl h-11"
            disabled={isPublishing}
          >
            Cancel
          </Button>
          <Button
            onClick={handlePublish}
            disabled={selectedPlatforms.length === 0 || isPublishing}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-11"
          >
            {isPublishing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Publish ({selectedPlatforms.length})
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

