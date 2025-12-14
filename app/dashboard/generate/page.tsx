"use client";

import { useState, useEffect } from "react";
import { 
  RefreshCw, 
  Edit3, 
  Trash2,
  Image as ImageIcon,
  Filter,
  MoreHorizontal,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PostCustomizationModal } from "@/components/dashboard/PostCustomizationModal";
import { GenerateNowModal } from "@/components/dashboard/GenerateNowModal";
import { GenerationPipeline } from "@/components/dashboard/GenerationPipeline";
import { ConfirmationModal } from "@/components/dashboard/ConfirmationModal";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { LockOverlay } from "@/components/dashboard/LockOverlay";
import { PaymentUpdatePrompt } from "@/components/dashboard/PaymentUpdatePrompt";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabaseClient";
import { getAccessPermissions, type Subscription } from "@/lib/subscription-access";

// Custom Icons
const IconSparkles = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
    <path d="M5 19l1 3 1-3 3-1-3-1-1-3-1 3-3 1 3 1z" />
    <path d="M19 13l.5 1.5 1.5.5-1.5.5-.5 1.5-.5-1.5-1.5-.5 1.5-.5.5-1.5z" />
  </svg>
);

const IconZap = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const CATEGORIES = ["All", "Tech", "AI", "Business", "Motivation"];

// Lane Icons
const IconRobot = ({ className = "h-3 w-3" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="18" height="10" x="3" y="11" rx="2" />
    <circle cx="12" cy="5" r="2" />
    <path d="M12 7v4" />
    <line x1="8" x2="8" y1="16" y2="16" />
    <line x1="16" x2="16" y1="16" y2="16" />
  </svg>
);

const IconLink = ({ className = "h-3 w-3" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

const IconPencil = ({ className = "h-3 w-3" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
  </svg>
);

const LANE_CONFIG = {
  auto: { label: "Auto", icon: IconRobot, color: "bg-purple-100 text-purple-700" },
  url: { label: "URL", icon: IconLink, color: "bg-blue-100 text-blue-700" },
  custom: { label: "Custom", icon: IconPencil, color: "bg-emerald-100 text-emerald-700" },
};

// Post type matching database schema
interface Post {
  id: string;
  title: string;
  content: string;
  category: 'tech' | 'ai' | 'business' | 'motivation';
  generation_lane: 'auto' | 'url' | 'custom';
  image_url: string | null;
  status: string;
  created_at: string;
  post_platforms?: Array<{
    id: string;
    platform: string;
    content: string;
    status: string;
  }>;
}

const CATEGORY_COLORS: Record<string, string> = {
  AI: "bg-purple-100 text-purple-700 border-purple-200",
  Tech: "bg-blue-100 text-blue-700 border-blue-200",
  Business: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Motivation: "bg-orange-100 text-orange-700 border-orange-200",
};

export default function ContentGeneration() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState<"all" | "draft" | "scheduled" | "posted">("all");
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [isPipelineOpen, setIsPipelineOpen] = useState(false);
  const [content, setContent] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [skipModalOpen, setSkipModalOpen] = useState(false);
  const [postToSkip, setPostToSkip] = useState<string | null>(null);
  const [regeneratingId, setRegeneratingId] = useState<string | null>(null);
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
          // No subscription - set default locked permissions
          setPermissions(getAccessPermissions(null));
        }
      } catch (error) {
        console.error("Error fetching subscription:", error);
        setPermissions(getAccessPermissions(null));
      }
    }

    fetchSubscription();
  }, [user]);

  // Fetch posts from API
  useEffect(() => {
    async function fetchPosts() {
      if (!user) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        // Fetch all posts (draft, scheduled, posted)
        const response = await fetch(
          `/api/posts?userId=${user.id}&limit=100`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }

        const data = await response.json();
        if (data.success) {
          setContent(data.posts || []);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        toast({
          title: "Error",
          description: "Failed to load posts. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchPosts();

    // Listen for post generation events
    const handlePostGenerated = () => {
      fetchPosts();
    };

    window.addEventListener('postGenerated', handlePostGenerated);
    return () => {
      window.removeEventListener('postGenerated', handlePostGenerated);
    };
  }, [user]);

  // Filter by category and status
  const filteredContent = content.filter(post => {
    // Category filter
    if (selectedCategory !== "All") {
      const categoryMap: Record<string, string> = {
        'AI': 'ai',
        'Tech': 'tech',
        'Business': 'business',
        'Motivation': 'motivation',
      };
      if (post.category !== categoryMap[selectedCategory]) {
        return false;
      }
    }
    
    // Status filter
    if (selectedStatus !== "all") {
      if (selectedStatus === "draft" && post.status !== "draft") {
        return false;
      }
      if (selectedStatus === "scheduled" && post.status !== "scheduled") {
        return false;
      }
      if (selectedStatus === "posted") {
        // Check if any platform has been posted
        const hasPosted = post.post_platforms?.some(pp => pp.status === "posted");
        if (!hasPosted) {
          return false;
        }
      }
    }
    
    return true;
  });

  // Group posts by status
  const groupedPosts = {
    draft: filteredContent.filter(post => post.status === "draft"),
    scheduled: filteredContent.filter(post => post.status === "scheduled"),
    posted: filteredContent.filter(post => 
      post.post_platforms?.some(pp => pp.status === "posted")
    ),
  };

  const handleEditPost = (post: Post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const handleSkipPost = async (postId: string) => {
    if (!user) return;
    
    try {
      const response = await fetch(`/api/posts/${postId}?userId=${user.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete post');
      }

      setContent(prev => prev.filter(p => p.id !== postId));
      toast({
        title: "Draft Deleted",
        description: "The draft has been removed from your queue.",
      });
    } catch (error: any) {
      console.error("Error deleting post:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete post. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRegeneratePost = async (postId: string) => {
    if (!user) return;
    
    setRegeneratingId(postId);
    try {
      const response = await fetch(`/api/posts/${postId}/regenerate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to regenerate post');
      }

      const result = await response.json();
      
      if (result.success) {
        toast({
          title: "Content Regenerated",
          description: "A new version has been generated for this draft.",
        });
        // Refresh posts to show updated content
        await refreshPosts();
      }
    } catch (error: any) {
      console.error('Error regenerating post:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to regenerate post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setRegeneratingId(null);
    }
  };

  const refreshPosts = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/posts?userId=${user.id}&limit=100`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }

      const data = await response.json();
      if (data.success) {
        setContent(data.posts || []);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in fade-in duration-500">
        {/* Payment Update Prompt */}
        {permissions && permissions.actionRequired && permissions.accessLevel !== "full" && (
          <PaymentUpdatePrompt
            message={permissions.message || "Update your payment method to restore access."}
            gracePeriodDays={permissions.gracePeriodDays}
          />
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-in slide-in-from-bottom-2 duration-500">
          <div>
            <h2 className="text-xl font-bold text-gray-900">News Card Generation</h2>
            <p className="text-sm text-gray-500 mt-1">Review and customize AI-generated news cards for your audience.</p>
          </div>
          <div className="flex gap-2 relative">
            {permissions && !permissions.canGenerateContent && (
              <LockOverlay
                message={permissions.message || "Your subscription is inactive. Update your payment method to generate new content."}
                actionLabel="Update Payment"
                actionPath="/dashboard/billing"
              />
            )}
            <Button 
              variant="outline"
              className="border-[#6D28D9]/30 text-[#6D28D9] hover:bg-[#6D28D9]/5 transition-all duration-200 rounded-xl"
              onClick={() => {
                if (permissions?.canGenerateContent) {
                  setIsGenerateModalOpen(true);
                }
              }}
              disabled={!permissions?.canGenerateContent}
            >
              <IconSparkles className="h-4 w-4 mr-2" />
              Quick Generate
            </Button>
            <Button 
              className="bg-[#6D28D9] hover:bg-[#5B21B6] text-white shadow-sm hover:shadow-md transition-all duration-200 rounded-xl"
              onClick={() => {
                if (permissions?.canGenerateContent) {
                  setIsPipelineOpen(true);
                }
              }}
              disabled={!permissions?.canGenerateContent}
            >
              <IconZap className="h-4 w-4 mr-2" />
              Full Pipeline
          </Button>
          </div>
        </div>

        {/* Status & Category Filters */}
        <div className="flex flex-col gap-4 animate-in slide-in-from-bottom-2 duration-500 delay-75">
          {/* Status Filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedStatus("all")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                selectedStatus === "all"
                  ? "bg-[#6D28D9] text-white shadow-sm"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              All Posts
            </button>
            <button
              onClick={() => setSelectedStatus("draft")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                selectedStatus === "draft"
                  ? "bg-[#6D28D9] text-white shadow-sm"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              Saved ({groupedPosts.draft.length})
            </button>
            <button
              onClick={() => setSelectedStatus("scheduled")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                selectedStatus === "scheduled"
                  ? "bg-[#6D28D9] text-white shadow-sm"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              Scheduled ({groupedPosts.scheduled.length})
            </button>
            <button
              onClick={() => setSelectedStatus("posted")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                selectedStatus === "posted"
                  ? "bg-[#6D28D9] text-white shadow-sm"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              Posted ({groupedPosts.posted.length})
            </button>
          </div>
          
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? "bg-[#6D28D9] text-white shadow-sm"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="h-8 w-8 text-[#6D28D9] animate-spin" />
          </div>
        )}

        {/* Content Grid */}
        {!isLoading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-in slide-in-from-bottom-2 duration-500 delay-100">
            {filteredContent.map((post, index) => {
              const categoryDisplay = post.category ? post.category.charAt(0).toUpperCase() + post.category.slice(1) : 'Tech';
              const lane = post.generation_lane || 'auto';
              const laneConfig = LANE_CONFIG[lane];
              const LaneIcon = laneConfig.icon;
              
              return (
                <div
                  key={post.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md hover:scale-[1.01] group"
                  style={{ animationDelay: `${index * 75}ms` }}
                >
                  <div className="flex flex-col md:flex-row min-w-0">
                    <div className="md:w-3/5 relative">
                      <img
                        src={post.image_url || "https://via.placeholder.com/800x600?text=No+Image"}
                        alt={post.title}
                        className="w-full h-48 md:h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${CATEGORY_COLORS[categoryDisplay] || CATEGORY_COLORS['Tech']}`}>
                          {categoryDisplay}
                        </span>
                      </div>
                      {/* Lane Badge */}
                      <div className="absolute top-3 right-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${laneConfig.color}`}>
                          <LaneIcon />
                          {laneConfig.label}
                        </span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="md:w-2/5 p-4 flex flex-col min-w-0">
                      <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-gray-500 mb-4 line-clamp-3 flex-1">
                        {post.content && post.content.length > 150 ? `${post.content.substring(0, 150)}...` : post.content || 'No content'}
                      </p>
                      <div className="space-y-2 mt-auto">
                        <Button
                          onClick={() => {
                            if (permissions?.canViewDrafts) {
                              handleEditPost(post);
                            }
                          }}
                          className="w-full bg-[#6D28D9] hover:bg-[#5B21B6] text-white transition-all duration-200 rounded-xl h-9 text-sm"
                          disabled={!permissions?.canViewDrafts}
                        >
                          <Edit3 className="h-3.5 w-3.5 mr-2" />
                          Review & Edit
                        </Button>
                        <div className="flex gap-2 min-w-0">
                          <Button
                            variant="outline"
                            size="icon"
                            className="flex-1 min-w-0 border-gray-200 text-gray-600 hover:bg-gray-50 transition-all duration-200 rounded-xl h-9 w-9"
                            onClick={() => {
                              if (permissions?.canGenerateContent) {
                                handleRegeneratePost(post.id);
                              }
                            }}
                            disabled={regeneratingId === post.id || !permissions?.canGenerateContent}
                            title="Regenerate"
                          >
                            <RefreshCw className={`h-4 w-4 flex-shrink-0 ${regeneratingId === post.id ? "animate-spin" : ""}`} />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="flex-1 min-w-0 border-gray-200 text-gray-500 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all duration-200 rounded-xl h-9 w-9"
                            onClick={() => handleSkipPost(post.id)}
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4 flex-shrink-0" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {filteredContent.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100">
            <EmptyState 
              variant="drafts"
              title={selectedCategory !== "All" ? `No ${selectedCategory} drafts` : "No drafts yet"}
              description={selectedCategory !== "All" 
                ? `Generate new content in the ${selectedCategory} category to see posts here.`
                : "Generate your first AI-powered content to get started."
              }
              action={{
                label: "Generate Content",
                onClick: () => setIsGenerateModalOpen(true)
              }}
            />
          </div>
        )}

      </div>

      <PostCustomizationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        post={selectedPost}
      />

      <GenerateNowModal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
      />

      <ConfirmationModal
        isOpen={skipModalOpen}
        onClose={() => {
          setSkipModalOpen(false);
          setPostToSkip(null);
        }}
        onConfirm={() => {
          if (postToSkip) {
            handleSkipPost(postToSkip);
          }
          setSkipModalOpen(false);
          setPostToSkip(null);
        }}
        title="Delete Draft"
        description="Are you sure you want to delete this draft? It will be permanently removed and you won't be able to recover it."
        confirmText="Delete Draft"
        cancelText="Keep Draft"
        variant="warning"
      />

      <GenerationPipeline
        isOpen={isPipelineOpen}
        onClose={() => setIsPipelineOpen(false)}
        onComplete={(result) => {
          toast({
            title: "Content Generated",
            description: "Your new content has been added to drafts.",
          });
          refreshPosts();
        }}
      />
    </DashboardLayout>
  );
}
