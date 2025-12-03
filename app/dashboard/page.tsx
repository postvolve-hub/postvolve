"use client";

import Link from "next/link";
import { 
  Sparkles, 
  TrendingUp, 
  Briefcase, 
  Heart, 
  Zap, 
  Globe, 
  Clock,
  Calendar,
  Filter,
  ArrowUpDown,
  EyeOff,
  MoreHorizontal,
  Plus,
  Paperclip,
  MessageSquare,
  Cpu,
  Lightbulb
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Progress } from "@/components/ui/progress";

// Category cards for content generation
const CATEGORIES = [
  { id: 1, label: "AI News", icon: Cpu, color: "from-purple-50 to-purple-100/50", iconColor: "text-purple-600" },
  { id: 2, label: "Tech Trends", icon: TrendingUp, color: "from-blue-50 to-blue-100/50", iconColor: "text-blue-600" },
  { id: 3, label: "Business", icon: Briefcase, color: "from-emerald-50 to-emerald-100/50", iconColor: "text-emerald-600" },
  { id: 4, label: "Motivation", icon: Lightbulb, color: "from-amber-50 to-amber-100/50", iconColor: "text-amber-600" },
  { id: 5, label: "Lifestyle", icon: Heart, color: "from-pink-50 to-pink-100/50", iconColor: "text-pink-600" },
  { id: 6, label: "Custom Topic", icon: Sparkles, color: "from-violet-50 to-violet-100/50", iconColor: "text-violet-600" },
  { id: 7, label: "Trending Now", icon: Zap, color: "from-orange-50 to-orange-100/50", iconColor: "text-orange-600" },
  { id: 8, label: "Scheduled", icon: Globe, color: "from-cyan-50 to-cyan-100/50", iconColor: "text-cyan-600" },
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
    title: "Track Medicine Delivery", 
    category: "Tracking", 
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
    title: "Plan An Event", 
    category: "Planning", 
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
    title: "Return A Package", 
    category: "Delivery", 
    categoryColor: "bg-blue-100 text-blue-700",
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
    title: "Get A Passport", 
    category: "Personal Help", 
    categoryColor: "bg-pink-100 text-pink-700",
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

function PostRow({ post }: { post: typeof DRAFT_POSTS[0] }) {
  return (
    <div className="flex items-center gap-4 px-4 py-4 hover:bg-gray-50/50 transition-colors group">
      {/* Title & Category */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-gray-900 truncate">{post.title}</h4>
        <span className="text-xs text-gray-500">{post.category}</span>
      </div>

      {/* Attachments */}
      <div className="flex items-center gap-1.5 text-gray-400 text-xs">
        <Paperclip className="h-3.5 w-3.5" />
        <span>{post.attachments}</span>
      </div>

      {/* Comments */}
      <div className="flex items-center gap-1.5 text-gray-400 text-xs">
        <MessageSquare className="h-3.5 w-3.5" />
        <span>{post.comments}</span>
      </div>

      {/* Status Badge */}
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${post.statusColor}`}>
        {post.status}
      </span>

      {/* Priority Badge */}
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${post.priorityColor}`}>
        {post.priority}
      </span>

      {/* Days Left */}
      <div className="flex items-center gap-1.5 text-gray-500 text-xs w-24">
        <Clock className="h-3.5 w-3.5" />
        <span>{post.daysLeft} Days left</span>
      </div>

      {/* Progress */}
      <div className="w-24 flex items-center gap-2">
        <Progress value={post.progress} className="h-1.5 bg-gray-100" />
        <span className="text-xs text-gray-500 w-8">{post.progress}%</span>
      </div>

      {/* More actions */}
      <button className="p-1 rounded hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
        <MoreHorizontal className="h-4 w-4 text-gray-400" />
      </button>
    </div>
  );
}

export default function DashboardHome() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Recommended Categories */}
        <section>
          <h3 className="text-base font-semibold text-gray-900 mb-4">Recommended Categories</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {CATEGORIES.map((category) => (
              <Link key={category.id} href="/dashboard/generate">
                <div 
                  className={`flex items-center gap-3 px-4 py-3.5 bg-gradient-to-r ${category.color} border border-gray-100 rounded-xl hover:shadow-md hover:scale-[1.02] transition-all duration-200 cursor-pointer`}
                >
                  <category.icon className={`h-5 w-5 ${category.iconColor}`} />
                  <span className="text-sm font-medium text-gray-700">{category.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Toolbar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-9 px-3 text-gray-600 border-gray-200 rounded-lg hover:bg-gray-50">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm" className="h-9 px-3 text-gray-600 border-gray-200 rounded-lg hover:bg-gray-50">
              <ArrowUpDown className="h-4 w-4 mr-2" />
              Sort
            </Button>
            <Button variant="outline" size="sm" className="h-9 px-3 text-gray-600 border-gray-200 rounded-lg hover:bg-gray-50">
              <EyeOff className="h-4 w-4 mr-2" />
              Hide
            </Button>
            <Button variant="ghost" size="sm" className="h-9 w-9 p-0 text-gray-400 hover:bg-gray-100 rounded-lg">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
          <Link href="/dashboard/generate">
            <Button className="h-9 bg-[#6D28D9] hover:bg-[#5B21B6] text-white font-medium rounded-xl shadow-sm">
              <Plus className="h-4 w-4 mr-2" />
              New Post
            </Button>
          </Link>
        </div>

        {/* Drafts Section */}
        <section>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Drafts</h3>
            <button className="p-1 rounded hover:bg-gray-100">
              <MoreHorizontal className="h-4 w-4 text-gray-400" />
            </button>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="divide-y divide-gray-100">
              {DRAFT_POSTS.map((post) => (
                <PostRow key={post.id} post={post} />
              ))}
            </div>
            {/* Add New Post Row */}
            <Link href="/dashboard/generate">
              <div className="flex items-center justify-center gap-2 px-4 py-3 border-t border-dashed border-gray-200 text-gray-400 hover:text-[#6D28D9] hover:bg-[#6D28D9]/5 transition-colors cursor-pointer">
                <Plus className="h-4 w-4" />
                <span className="text-sm font-medium">Add New Post</span>
              </div>
            </Link>
          </div>
        </section>

        {/* Active Projects / Scheduled Section */}
        <section>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Active Projects</h3>
            <button className="p-1 rounded hover:bg-gray-100">
              <MoreHorizontal className="h-4 w-4 text-gray-400" />
            </button>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="divide-y divide-gray-100">
              {ACTIVE_POSTS.map((post) => (
                <PostRow key={post.id} post={post} />
              ))}
            </div>
          </div>
        </section>

        {/* Quick Stats Footer */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">18</p>
                <p className="text-xs text-gray-500">Posts Scheduled</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">124.5K</p>
                <p className="text-xs text-gray-500">Total Impressions</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">4.8%</p>
                <p className="text-xs text-gray-500">Engagement Rate</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
