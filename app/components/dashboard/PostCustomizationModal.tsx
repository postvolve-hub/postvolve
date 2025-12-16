"use client";

import { useState, useEffect } from "react";
import { 
  X, 
  Calendar, 
  Save, 
  Image as ImageIcon, 
  RefreshCw, 
  Check,
  AlertCircle,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ImageUploadModal } from "@/components/dashboard/ImageUploadModal";
import { SchedulePostModal } from "@/components/dashboard/SchedulePostModal";
import { PublishSuccessModal } from "@/components/dashboard/PublishSuccessModal";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { PLACEHOLDER_IMAGES } from "@/lib/image-placeholder";

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

interface Post {
  id: string;
  title: string;
  content: string;
  category: 'tech' | 'ai' | 'business' | 'motivation';
  generation_lane?: 'auto' | 'url' | 'custom';
  image_url: string | null;
  status: string;
  post_platforms?: Array<{
    id: string;
    platform: string;
    content: string;
    status: string;
  }>;
}

interface PostCustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post | null;
}

const PLATFORMS = [
  { id: "linkedin", name: "LinkedIn", icon: IconLinkedIn, color: "text-[#0A66C2]", bgColor: "bg-[#0A66C2]", charLimit: 280 },
  { id: "x", name: "X", icon: IconX, color: "text-black", bgColor: "bg-black", charLimit: 280 },
  { id: "facebook", name: "Facebook", icon: IconFacebook, color: "text-[#1877F2]", bgColor: "bg-[#1877F2]", charLimit: 280 },
  { id: "instagram", name: "Instagram", icon: IconInstagram, color: "text-[#E4405F]", bgColor: "bg-[#E4405F]", charLimit: 280 },
];

const LANE_INFO = {
  auto: { label: "Auto Generated", icon: "🤖", color: "bg-purple-100 text-purple-700 border-purple-200" },
  url: { label: "From URL", icon: "🔗", color: "bg-blue-100 text-blue-700 border-blue-200" },
  custom: { label: "Custom", icon: "✏️", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
};

const CATEGORY_COLORS: Record<string, string> = {
  AI: "bg-purple-100 text-purple-700",
  Tech: "bg-blue-100 text-blue-700",
  Business: "bg-emerald-100 text-emerald-700",
  Motivation: "bg-orange-100 text-orange-700",
};

export function PostCustomizationModal({ isOpen, onClose, post }: PostCustomizationModalProps) {
  const { user } = useAuth();
  const [postContent, setPostContent] = useState("");
  const [postTitle, setPostTitle] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["linkedin", "x"]);
  const [previewPlatform, setPreviewPlatform] = useState("linkedin");
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [imageUploadOpen, setImageUploadOpen] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState("");
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);

  useEffect(() => {
    if (post) {
      setPostTitle(post.title);
      // Use first platform content or main content
      const firstPlatformContent = post.post_platforms?.[0]?.content;
      setPostContent(firstPlatformContent || post.content);
      setCurrentImageUrl(post.image_url || '');
      
      // Set selected platforms from post_platforms
      if (post.post_platforms && post.post_platforms.length > 0) {
        const platforms = post.post_platforms.map(pp => {
          // Map database platform names to UI names
          if (pp.platform === 'twitter') return 'x';
          return pp.platform;
        });
        setSelectedPlatforms(platforms);
        setPreviewPlatform(platforms[0] || 'linkedin');
      }
    }
  }, [post]);

  if (!isOpen || !post) return null;

  const characterCount = postContent.length;
  const currentPlatform = PLATFORMS.find(p => p.id === previewPlatform);
  const isOverLimit = currentPlatform ? characterCount > currentPlatform.charLimit : false;
  const lane = (post.generation_lane || "auto") as keyof typeof LANE_INFO;
  const laneInfo = LANE_INFO[lane];

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev => {
      if (prev.includes(platformId)) {
        // Don't allow deselecting if it's the only one
        if (prev.length === 1) return prev;
        return prev.filter(p => p !== platformId);
      }
      return [...prev, platformId];
    });
  };

  const handleRegenerate = async () => {
    if (!user || !post) return;
    
    setIsRegenerating(true);
    try {
      // Get text content for image generation
      const textContent = postContent || post.content || post.title;
      
      const response = await fetch('/api/generate/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          textContent,
          category: post.category,
          platform: previewPlatform,
          quality: 'high',
          userId: user?.id, // Pass userId to download external images
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to regenerate image');
      }

      const result = await response.json();
      
      if (result.success && result.image?.imageUrl) {
        setCurrentImageUrl(result.image.imageUrl);
        toast({
          title: "Image Regenerated",
          description: "A new image has been generated for your post.",
        });
      }
    } catch (error: any) {
      console.error('Error regenerating image:', error);
      const errorMessage = getUserFriendlyErrorMessage(
        error.message || error,
        { action: 'regenerate image' }
      );
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleImageUpload = async (imageUrl: string) => {
    if (!post || !user) return;
    
    setCurrentImageUrl(imageUrl);
    
    // Update the post with new image URL
    try {
      const response = await fetch(`/api/posts/${post.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          image_url: imageUrl,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update post image');
      }

      toast({
        title: "Image Updated",
        description: "Your post image has been changed successfully.",
      });
    } catch (error: any) {
      console.error('Error updating post image:', error);
      toast({
        title: "Error",
        description: "Failed to save image. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getCharacterStatus = (platformId: string) => {
    const platform = PLATFORMS.find(p => p.id === platformId);
    if (!platform) return "ok";
    if (characterCount > platform.charLimit) return "over";
    if (characterCount > platform.charLimit * 0.9) return "warning";
    return "ok";
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-gray-900">Customize Post</h2>
              <Badge variant="outline" className={`text-xs ${laneInfo.color}`}>
                {laneInfo.icon} {laneInfo.label}
              </Badge>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
            {/* Image Section */}
            <div className="relative rounded-2xl overflow-hidden mb-6 bg-gray-100 group aspect-square">
              <img
                src={currentImageUrl || post.image_url || PLACEHOLDER_IMAGES.noImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex gap-2">
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="bg-white/90 hover:bg-white rounded-xl"
                    onClick={handleRegenerate}
                    disabled={isRegenerating}
                  >
                    {isRegenerating ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Sparkles className="h-4 w-4 mr-2" />
                    )}
                    Regenerate
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="bg-white/90 hover:bg-white rounded-xl"
                    onClick={() => setImageUploadOpen(true)}
                  >
                  <ImageIcon className="h-4 w-4 mr-2" />
                    Change
                </Button>
                </div>
              </div>
              {/* Category Badge */}
              <div className="absolute top-3 left-3">
                <Badge className={`${CATEGORY_COLORS[post.category.charAt(0).toUpperCase() + post.category.slice(1)] || "bg-gray-100 text-gray-700"} border-0`}>
                  {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
                </Badge>
              </div>
            </div>

            {/* Image Upload Modal */}
            <ImageUploadModal
              isOpen={imageUploadOpen}
              onClose={() => setImageUploadOpen(false)}
              onUpload={handleImageUpload}
              currentImage={currentImageUrl || post.image_url || ''}
            />

            {/* Schedule Modal */}
            <SchedulePostModal
              isOpen={scheduleModalOpen}
              onClose={() => setScheduleModalOpen(false)}
              onSchedule={async (postId, date, time, utcISOString) => {
                if (!user) return;
                
                try {
                  // Use provided UTC ISO string if available, otherwise convert
                  let scheduledAt: string;
                  if (utcISOString) {
                    scheduledAt = utcISOString;
                  } else {
                    const timezone = getUserTimezone();
                    const timeFormatted = time.length === 5 ? time : time.padStart(5, '0');
                    scheduledAt = convertToUTC(date, timeFormatted, timezone);
                  }
                  
                  const response = await fetch('/api/scheduler/posts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      userId: user.id,
                      postId: post.id,
                      scheduledAt,
                    }),
                  });

                  if (!response.ok) {
                    throw new Error('Failed to schedule post');
                  }

                  toast({
                    title: "Post Scheduled",
                    description: `Your post has been scheduled for ${date} at ${time}.`,
                  });
                  
                  setScheduleModalOpen(false);
                  onClose();
                } catch (error: any) {
                  console.error('Schedule error:', error);
                  toast({
                    title: "Schedule Failed",
                    description: error.message || 'Failed to schedule post. Please try again.',
                    variant: "destructive",
                  });
                }
              }}
            />

            <div className="space-y-5">
              {/* Title */}
              <div>
                <Label htmlFor="title" className="text-sm font-medium text-gray-700 mb-2 block">
                  Post Title
                </Label>
                <Input
                  id="title"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  className="w-full h-11 border-gray-200 focus:ring-[#6D28D9]/20 focus:border-[#6D28D9]/30 rounded-xl"
                  placeholder="Enter post title..."
                />
              </div>

              {/* Platform Selection */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Target Platforms
                </Label>
                <div className="flex flex-wrap gap-2">
                  {PLATFORMS.map((platform) => {
                    const isSelected = selectedPlatforms.includes(platform.id);
                    const charStatus = getCharacterStatus(platform.id);
                    const IconComponent = platform.icon;
                    
                    return (
                      <button
                        key={platform.id}
                        onClick={() => togglePlatform(platform.id)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 transition-all duration-200 ${
                          isSelected
                            ? "border-[#6D28D9] bg-[#6D28D9]/5"
                            : "border-gray-200 hover:border-gray-300 opacity-60"
                        }`}
                      >
                        <IconComponent className={`h-4 w-4 ${platform.color}`} />
                        <span className={`text-sm ${isSelected ? "font-medium text-gray-900" : "text-gray-500"}`}>
                          {platform.name}
                        </span>
                        {isSelected && (
                          <>
                            {charStatus === "ok" && <Check className="h-3.5 w-3.5 text-green-500" />}
                            {charStatus === "warning" && <AlertCircle className="h-3.5 w-3.5 text-amber-500" />}
                            {charStatus === "over" && <AlertCircle className="h-3.5 w-3.5 text-red-500" />}
                          </>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Content with Platform Preview */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="content" className="text-sm font-medium text-gray-700">
                    Post Content
                  </Label>
                  <div className="flex items-center gap-2">
                    {/* Platform Preview Tabs */}
                    <div className="flex bg-gray-100 rounded-lg p-0.5">
                      {selectedPlatforms.map((platformId) => {
                        const platform = PLATFORMS.find(p => p.id === platformId);
                        if (!platform) return null;
                        const IconComponent = platform.icon;
                        return (
                          <button
                            key={platformId}
                            onClick={() => setPreviewPlatform(platformId)}
                            className={`p-1.5 rounded-md transition-all duration-200 ${
                              previewPlatform === platformId
                                ? "bg-white shadow-sm"
                                : "hover:bg-gray-50"
                            }`}
                            title={`Preview for ${platform.name}`}
                          >
                            <IconComponent className={`h-4 w-4 ${platform.color}`} />
                          </button>
                        );
                      })}
                    </div>
                    {/* Character Count */}
                    <span className={`text-sm font-medium ${
                      isOverLimit ? 'text-red-500' : 
                      currentPlatform && characterCount > currentPlatform.charLimit * 0.9 ? 'text-amber-500' : 
                      'text-gray-500'
                    }`}>
                      {characterCount.toLocaleString()}/{currentPlatform?.charLimit.toLocaleString()}
                  </span>
                  </div>
                </div>
                <Textarea
                  id="content"
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  className={`w-full min-h-[140px] border-gray-200 focus:ring-[#6D28D9]/20 focus:border-[#6D28D9]/30 rounded-xl resize-none ${
                    isOverLimit ? 'border-red-300 focus:ring-red-200 focus:border-red-300' : ''
                  }`}
                  placeholder="Write your post content..."
                />
                {isOverLimit && (
                  <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5" />
                    Content exceeds {currentPlatform?.name} character limit
                  </p>
                )}
              </div>

              {/* Platform Preview Card */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Preview
                </Label>
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  {/* Preview Header */}
                  <div className="p-3 bg-gray-50 border-b border-gray-200 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6D28D9] to-[#4C1D95] flex items-center justify-center text-white font-semibold text-sm">
                      PV
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">PostVolve User</p>
                      <p className="text-xs text-gray-500">Just now • {currentPlatform?.name}</p>
                    </div>
                  </div>
                  {/* Preview Content */}
                  <div className="p-4">
                    <p className="text-sm text-gray-800 whitespace-pre-wrap">
                      {postContent || "Your post content will appear here..."}
                    </p>
                    {(currentImageUrl || post.image_url) && (
                      <div className="mt-3 rounded-lg overflow-hidden">
                        <img
                          src={currentImageUrl || post.image_url || ''}
                          alt="Preview"
                          className="w-full h-40 object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
            <p className="text-xs text-gray-500">
              Posting to {selectedPlatforms.length} platform{selectedPlatforms.length !== 1 ? "s" : ""}
            </p>
            <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={async () => {
                if (!post) return;
                
                // Get user
                const { supabase } = await import('@/lib/supabaseClient');
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                  toast({
                    title: "Authentication Required",
                    description: "Please sign in to save posts.",
                    variant: "destructive",
                  });
                  return;
                }
                
                try {
                  // Update post with new content
                  const response = await fetch(`/api/posts/${post.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      userId: user.id,
                      title: postTitle,
                      content: postContent,
                      imageUrl: currentImageUrl,
                      platforms: selectedPlatforms.map(platform => ({
                        platform: platform === 'x' ? 'twitter' : platform,
                        content: postContent,
                      })),
                    }),
                  });

                  if (!response.ok) {
                    throw new Error('Failed to save post');
                  }

                  toast({
                    title: "Draft Saved",
                    description: "Your changes have been saved.",
                  });
                  onClose();
                } catch (error: any) {
                  console.error('Save error:', error);
                  toast({
                    title: "Save Failed",
                    description: error.message || 'Failed to save post. Please try again.',
                    variant: "destructive",
                  });
                }
              }}
                className="border-gray-200 text-gray-600 hover:bg-gray-100 rounded-xl"
            >
              <Save className="h-4 w-4 mr-2" />
                Save Draft
            </Button>
            <Button
                className="bg-[#6D28D9] hover:bg-[#5B21B6] text-white rounded-xl"
                disabled={selectedPlatforms.some(p => getCharacterStatus(p) === "over")}
                onClick={async () => {
                  if (!post || !user) return;
                  
                  try {
                    // First, save the post with updated content
                    const response = await fetch(`/api/posts/${post.id}`, {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        userId: user.id,
                        title: postTitle,
                        content: postContent,
                        imageUrl: currentImageUrl,
                        platforms: selectedPlatforms.map(platform => ({
                          platform: platform === 'x' ? 'twitter' : platform,
                          content: postContent,
                        })),
                      }),
                    });

                    if (!response.ok) {
                      throw new Error('Failed to update post');
                    }

                    // Then open schedule modal
                    setScheduleModalOpen(true);
                  } catch (error: any) {
                    console.error('Update error:', error);
                    const errorMessage = getUserFriendlyErrorMessage(
                      error.message || error,
                      { action: 'update post' }
                    );
                    toast({
                      title: "Update Failed",
                      description: errorMessage,
                      variant: "destructive",
                    });
                  }
                }}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Save & Schedule
            </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
