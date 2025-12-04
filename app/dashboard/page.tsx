"use client";

import Link from "next/link";
import { 
  Plus,
  Paperclip,
  MessageSquare,
  Clock,
  Filter,
  ArrowUpDown,
  EyeOff,
  MoreHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Progress } from "@/components/ui/progress";
import { EmptyState } from "@/components/dashboard/EmptyState";

// Custom Icons for Categories - Smaller size (h-4 w-4)
const IconAI = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 8V4H8" />
    <rect width="16" height="12" x="4" y="8" rx="2" />
    <path d="M2 14h2" />
    <path d="M20 14h2" />
    <path d="M15 13v2" />
    <path d="M9 13v2" />
  </svg>
);

const IconTrending = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    <polyline points="16 7 22 7 22 13" />
  </svg>
);

const IconBusiness = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="14" x="2" y="7" rx="2" />
    <path d="M16 3h-8l-1 4h10l-1-4z" />
    <path d="M12 12v5" />
    <path d="M8 12v5" />
    <path d="M16 12v5" />
  </svg>
);

const IconMotivation = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
  </svg>
);

const IconLifestyle = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
);

const IconCustom = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
    <path d="M5 19l1 3 1-3 3-1-3-1-1-3-1 3-3 1 3 1z" />
  </svg>
);

const IconZap = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const IconGlobe = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    <path d="M2 12h20" />
  </svg>
);

const IconCalendarStats = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="18" height="18" x="3" y="4" rx="2" />
    <path d="M3 10h18" />
    <path d="M8 2v4" />
    <path d="M16 2v4" />
  </svg>
);

// Category cards for content generation
const CATEGORIES = [
  { id: 1, label: "AI News", icon: IconAI, color: "from-purple-50 to-purple-100/50", iconColor: "text-purple-600" },
  { id: 2, label: "Tech Trends", icon: IconTrending, color: "from-blue-50 to-blue-100/50", iconColor: "text-blue-600" },
  { id: 3, label: "Business", icon: IconBusiness, color: "from-emerald-50 to-emerald-100/50", iconColor: "text-emerald-600" },
  { id: 4, label: "Motivation", icon: IconMotivation, color: "from-amber-50 to-amber-100/50", iconColor: "text-amber-600" },
  { id: 5, label: "Lifestyle", icon: IconLifestyle, color: "from-pink-50 to-pink-100/50", iconColor: "text-pink-600" },
  { id: 6, label: "Custom Topic", icon: IconCustom, color: "from-violet-50 to-violet-100/50", iconColor: "text-violet-600" },
  { id: 7, label: "Trending Now", icon: IconZap, color: "from-orange-50 to-orange-100/50", iconColor: "text-orange-600" },
  { id: 8, label: "Scheduled", icon: IconGlobe, color: "from-cyan-50 to-cyan-100/50", iconColor: "text-cyan-600" },
];

// Draft posts
const DRAFT_POSTS = [
  { 
    id: 1, 
    title: "The Future of AI in Content Creation – How...", 
    category: "AI", 
    categoryColor: "bg-purple-100 text-purple-700",
    attachments: 12, 
    comments: 21, 
    status: "In Review",
    statusColor: "bg-amber-50 text-amber-700",
    priority: "High",
    priorityColor: "bg-red-50 text-red-600",
    daysLeft: 15,
    progress: 0 
  },
  { 
    id: 2, 
    title: "5 Cloud Technologies Transforming Business", 
    category: "Tech", 
    categoryColor: "bg-blue-100 text-blue-700",
    attachments: 4, 
    comments: 32, 
    status: "Drafts",
    statusColor: "bg-gray-100 text-gray-600",
    priority: "Medium",
    priorityColor: "bg-amber-50 text-amber-600",
    daysLeft: 12,
    progress: 0 
  },
];

// Active/Scheduled posts
const ACTIVE_POSTS = [
  { 
    id: 1, 
    title: "Startup Funding: Series A Strategies", 
    category: "Business", 
    categoryColor: "bg-emerald-100 text-emerald-700",
    attachments: 11, 
    comments: 8, 
    status: "In Progress",
    statusColor: "bg-violet-100 text-violet-700",
    priority: "Mid",
    priorityColor: "bg-amber-50 text-amber-600",
    daysLeft: 32,
    progress: 26 
  },
  { 
    id: 2, 
    title: "Building Resilience in Uncertain Times", 
    category: "Motivation", 
    categoryColor: "bg-orange-100 text-orange-700",
    attachments: 7, 
    comments: 12, 
    status: "In Progress",
    statusColor: "bg-violet-100 text-violet-700",
    priority: "Medium",
    priorityColor: "bg-amber-50 text-amber-600",
    daysLeft: 4,
    progress: 74 
  },
  { 
    id: 3, 
    title: "Machine Learning Best Practices for 2025", 
    category: "AI", 
    categoryColor: "bg-purple-100 text-purple-700",
    attachments: 4, 
    comments: 16, 
    status: "Input Needed",
    statusColor: "bg-orange-100 text-orange-700",
    priority: "Low",
    priorityColor: "bg-green-50 text-green-600",
    daysLeft: 22,
    progress: 38 
  },
];

function PostRow({ post, index }: { post: typeof DRAFT_POSTS[0]; index: number }) {
  return (
    <div 
      className="flex items-center gap-4 px-4 py-4 hover:bg-gray-50/50 transition-all duration-200 group"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Title & Category */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-gray-900 truncate">{post.title}</h4>
        <span className="text-xs text-gray-500">{post.category}</span>
      </div>

      {/* Attachments */}
      <div className="hidden sm:flex items-center gap-1.5 text-gray-400 text-xs">
        <Paperclip className="h-3.5 w-3.5" />
        <span>{post.attachments}</span>
      </div>

      {/* Comments */}
      <div className="hidden sm:flex items-center gap-1.5 text-gray-400 text-xs">
        <MessageSquare className="h-3.5 w-3.5" />
        <span>{post.comments}</span>
      </div>

      {/* Status Badge */}
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-200 ${post.statusColor}`}>
        {post.status}
      </span>

      {/* Priority Badge */}
      <span className={`hidden md:inline-flex px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-200 ${post.priorityColor}`}>
        {post.priority}
      </span>

      {/* Days Left */}
      <div className="hidden lg:flex items-center gap-1.5 text-gray-500 text-xs w-24">
        <Clock className="h-3.5 w-3.5" />
        <span>{post.daysLeft} Days left</span>
      </div>

      {/* Progress */}
      <div className="hidden xl:flex w-24 items-center gap-2">
        <Progress value={post.progress} className="h-1.5 bg-gray-100" />
        <span className="text-xs text-gray-500 w-8">{post.progress}%</span>
      </div>

      {/* More actions */}
      <button className="p-1 rounded hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-all duration-200">
        <MoreHorizontal className="h-4 w-4 text-gray-400" />
      </button>
    </div>
  );
}

export default function DashboardHome() {
  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in duration-500">
        {/* Recommended Categories */}
        <section className="animate-in slide-in-from-bottom-2 duration-500">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Recommended Categories</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {CATEGORIES.map((category, index) => (
              <Link key={category.id} href="/dashboard/generate">
                <div 
                  className={`flex items-center gap-3 px-4 py-3 bg-gradient-to-r ${category.color} border border-gray-100 rounded-xl hover:shadow-md hover:scale-[1.02] transition-all duration-200 cursor-pointer`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <category.icon className={`h-4 w-4 ${category.iconColor}`} />
                  <span className="text-sm font-medium text-gray-700">{category.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Toolbar */}
        <div className="flex items-center justify-between flex-wrap gap-3 animate-in slide-in-from-bottom-2 duration-500 delay-100">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-9 px-3 text-gray-600 border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm" className="h-9 px-3 text-gray-600 border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200">
              <ArrowUpDown className="h-4 w-4 mr-2" />
              Sort
            </Button>
            <Button variant="outline" size="sm" className="h-9 px-3 text-gray-600 border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200">
              <EyeOff className="h-4 w-4 mr-2" />
              Hide
            </Button>
            <Button variant="ghost" size="sm" className="h-9 w-9 p-0 text-gray-400 hover:bg-gray-100 rounded-lg transition-all duration-200">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
          <Link href="/dashboard/generate">
            <Button className="h-9 bg-[#6D28D9] hover:bg-[#5B21B6] text-white font-medium rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
              <Plus className="h-4 w-4 mr-2" />
              New Post
            </Button>
          </Link>
        </div>

        {/* Drafts Section */}
        <section className="animate-in slide-in-from-bottom-2 duration-500 delay-150">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Drafts</h3>
            <button className="p-1 rounded hover:bg-gray-100 transition-all duration-200">
              <MoreHorizontal className="h-4 w-4 text-gray-400" />
            </button>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {DRAFT_POSTS.length > 0 ? (
              <>
                <div className="divide-y divide-gray-100">
                  {DRAFT_POSTS.map((post, index) => (
                    <PostRow key={post.id} post={post} index={index} />
                  ))}
                </div>
                {/* Add New Post Row */}
                <Link href="/dashboard/generate">
                  <div className="flex items-center justify-center gap-2 px-4 py-3 border-t border-dashed border-gray-200 text-gray-400 hover:text-[#6D28D9] hover:bg-[#6D28D9]/5 transition-all duration-200 cursor-pointer">
                    <Plus className="h-4 w-4" />
                    <span className="text-sm font-medium">Add New Post</span>
                  </div>
                </Link>
              </>
            ) : (
              <EmptyState 
                variant="drafts"
                action={{
                  label: "Generate Content",
                  onClick: () => window.location.href = "/dashboard/generate"
                }}
                className="py-8"
              />
            )}
          </div>
        </section>

        {/* Active Projects / Scheduled Section */}
        <section className="animate-in slide-in-from-bottom-2 duration-500 delay-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Active Projects</h3>
            <button className="p-1 rounded hover:bg-gray-100 transition-all duration-200">
              <MoreHorizontal className="h-4 w-4 text-gray-400" />
            </button>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {ACTIVE_POSTS.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {ACTIVE_POSTS.map((post, index) => (
                  <PostRow key={post.id} post={post} index={index} />
                ))}
              </div>
            ) : (
              <EmptyState 
                variant="scheduled"
                title="No active projects"
                description="Schedule posts to see them appear here."
                action={{
                  label: "Go to Scheduler",
                  onClick: () => window.location.href = "/dashboard/scheduler"
                }}
                className="py-8"
              />
            )}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
