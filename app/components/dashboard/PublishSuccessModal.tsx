"use client";

import { X, CheckCircle, XCircle, ExternalLink, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PublishResult {
  platform: string;
  success: boolean;
  postId?: string;
  error?: string;
  url?: string;
}

interface PublishSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  results: PublishResult[];
  postTitle?: string;
  postId?: string;
  onRetry?: (failedPlatforms?: string[]) => void;
}

const PLATFORM_NAMES: Record<string, string> = {
  linkedin: "LinkedIn",
  x: "X (Twitter)",
  twitter: "X (Twitter)",
  facebook: "Facebook",
  instagram: "Instagram",
};

const PLATFORM_URLS: Record<string, (postId: string) => string> = {
  linkedin: (postId) => `https://www.linkedin.com/feed/update/${postId}`,
  x: (postId) => `https://x.com/i/web/status/${postId}`,
  twitter: (postId) => `https://x.com/i/web/status/${postId}`,
  facebook: (postId) => `https://www.facebook.com/${postId}`,
  instagram: (postId) => `https://www.instagram.com/p/${postId}/`,
};

const PLATFORM_COLORS: Record<string, string> = {
  linkedin: "text-[#0A66C2]",
  x: "text-gray-900",
  twitter: "text-gray-900",
  facebook: "text-[#1877F2]",
  instagram: "text-[#E4405F]",
};

export function PublishSuccessModal({
  isOpen,
  onClose,
  results,
  postTitle,
  postId,
  onRetry,
}: PublishSuccessModalProps) {
  if (!isOpen) return null;

  const successCount = results.filter((r) => r.success).length;
  const failureCount = results.filter((r) => !r.success).length;
  const allSuccess = failureCount === 0;
  const allFailed = successCount === 0;
  const failedPlatforms = results.filter(r => !r.success).map(r => r.platform);

  const getPlatformUrl = (platform: string, postId?: string): string | null => {
    if (!postId) return null;
    const urlGenerator = PLATFORM_URLS[platform.toLowerCase()];
    if (!urlGenerator) return null;
    try {
      return urlGenerator(postId);
    } catch {
      return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            {allSuccess ? (
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-emerald-600" />
              </div>
            ) : allFailed ? (
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-amber-600" />
              </div>
            )}
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {allSuccess
                  ? "Post Published Successfully!"
                  : allFailed
                  ? "Publishing Failed"
                  : "Partially Published"}
              </h2>
              {postTitle && (
                <p className="text-sm text-gray-500 mt-0.5 truncate max-w-md">
                  {postTitle}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Summary */}
          <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                {successCount > 0 && (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                    <span className="text-sm font-medium text-gray-700">
                      {successCount} {successCount === 1 ? "platform" : "platforms"} published
                    </span>
                  </div>
                )}
                {failureCount > 0 && (
                  <div className="flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-red-600" />
                    <span className="text-sm font-medium text-gray-700">
                      {failureCount} {failureCount === 1 ? "platform" : "platforms"} failed
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Platform Results */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Platform Results
            </h3>
            {results.map((result, index) => {
              const platformName = PLATFORM_NAMES[result.platform] || result.platform;
              const platformColor = PLATFORM_COLORS[result.platform] || "text-gray-600";
              const postUrl = getPlatformUrl(result.platform, result.postId);

              return (
                <div
                  key={index}
                  className={`p-4 rounded-xl border-2 ${
                    result.success
                      ? "bg-emerald-50 border-emerald-200"
                      : "bg-red-50 border-red-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {result.success ? (
                        <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`font-medium ${platformColor}`}>
                            {platformName}
                          </span>
                          {result.success ? (
                            <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-xs">
                              Published
                            </Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-700 border-red-200 text-xs">
                              Failed
                            </Badge>
                          )}
                        </div>
                        {result.error && (
                          <p className="text-xs text-red-600 mt-1 truncate">
                            {result.error}
                          </p>
                        )}
                      </div>
                    </div>
                    {result.success && postUrl && (
                      <a
                        href={postUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-3 p-2 rounded-lg hover:bg-emerald-100 transition-colors flex-shrink-0"
                        title="View on platform"
                      >
                        <ExternalLink className="h-4 w-4 text-emerald-600" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-500">
            {allSuccess
              ? "Your post is now live on all selected platforms."
              : allFailed
              ? "Please check your account connections and try again."
              : "Some platforms failed to publish. You can retry the failed ones."}
          </div>
          <div className="flex gap-3">
            {!allSuccess && onRetry && failedPlatforms.length > 0 && (
              <Button
                variant="outline"
                onClick={() => onRetry(failedPlatforms)}
                className="border-gray-300"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry Failed ({failedPlatforms.length})
              </Button>
            )}
            <Button
              onClick={onClose}
              className="bg-[#6D28D9] hover:bg-[#5B21B6] text-white"
            >
              {allSuccess ? "Done" : "Close"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

