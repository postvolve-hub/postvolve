"use client";

import Link from "next/link";
import { 
  TrendingUp, 
  Calendar, 
  FileText, 
  Eye,
  ArrowUpRight,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

const MOCK_STATS = [
  { 
    id: 1, 
    label: "Total Impressions", 
    value: "124.5K", 
    change: "+12.3%", 
    trend: "up",
    icon: Eye 
  },
  { 
    id: 2, 
    label: "Posts Scheduled", 
    value: "18", 
    change: "+3 this week", 
    trend: "up",
    icon: Calendar 
  },
  { 
    id: 3, 
    label: "Drafts Ready", 
    value: "7", 
    change: "Review needed", 
    trend: "neutral",
    icon: FileText 
  },
  { 
    id: 4, 
    label: "Engagement Rate", 
    value: "4.8%", 
    change: "+0.6%", 
    trend: "up",
    icon: TrendingUp 
  },
];

const MOCK_UPCOMING_POSTS = [
  { 
    id: 1, 
    title: "The Future of AI in Content Creation", 
    category: "AI", 
    scheduledTime: "Today, 3:00 PM", 
    status: "scheduled" 
  },
  { 
    id: 2, 
    title: "5 Tech Trends to Watch in 2025", 
    category: "Tech", 
    scheduledTime: "Tomorrow, 10:00 AM", 
    status: "scheduled" 
  },
  { 
    id: 3, 
    title: "Building a Growth Mindset", 
    category: "Motivation", 
    scheduledTime: "Dec 5, 2:00 PM", 
    status: "draft" 
  },
  { 
    id: 4, 
    title: "Startup Funding Strategies", 
    category: "Business", 
    scheduledTime: "Dec 6, 11:00 AM", 
    status: "scheduled" 
  },
  { 
    id: 5, 
    title: "Machine Learning Best Practices", 
    category: "AI", 
    scheduledTime: "Dec 7, 9:00 AM", 
    status: "draft" 
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  AI: "bg-purple-100 text-purple-700",
  Tech: "bg-blue-100 text-blue-700",
  Business: "bg-green-100 text-green-700",
  Motivation: "bg-orange-100 text-orange-700",
};

const STATUS_STYLES: Record<string, string> = {
  scheduled: "bg-amber-50 text-amber-600",
  draft: "bg-gray-100 text-gray-600",
  posted: "bg-emerald-50 text-emerald-600",
  error: "bg-red-50 text-red-600",
};

export default function DashboardHome() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Welcome back, John!</h2>
            <p className="text-gray-500 mt-1">Here's what's happening with your content today.</p>
          </div>
          <Link href="/dashboard/generate">
            <Button className="bg-[#6D28D9] hover:bg-[#4C1D95] text-white shadow-lg shadow-purple-500/20 transition-all duration-300 hover:scale-[1.02]">
              <FileText className="h-4 w-4 mr-2" />
              Review Drafts
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOCK_STATS.map((stat) => (
            <div
              key={stat.id}
              className="bg-white rounded-xl p-6 shadow-sm border-t-4 border-[#6D28D9] transition-all duration-300 hover:shadow-lg hover:scale-[1.01]"
            >
              <div className="flex items-start justify-between">
                <div className="p-2 bg-[#6D28D9]/10 rounded-lg">
                  <stat.icon className="h-5 w-5 text-[#6D28D9]" />
                </div>
                {stat.trend === "up" && (
                  <span className="flex items-center text-sm text-emerald-600 font-medium">
                    <ArrowUpRight className="h-4 w-4" />
                    {stat.change}
                  </span>
                )}
                {stat.trend === "neutral" && (
                  <span className="text-sm text-gray-500">{stat.change}</span>
                )}
              </div>
              <div className="mt-4">
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Posts</h3>
            <Link href="/dashboard/scheduler">
              <Button variant="ghost" size="sm" className="text-[#6D28D9] hover:text-[#4C1D95]">
                View All
                <ArrowUpRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Scheduled Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {MOCK_UPCOMING_POSTS.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{post.title}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${CATEGORY_COLORS[post.category]}`}>
                        {post.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-2" />
                        {post.scheduledTime}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium capitalize ${STATUS_STYLES[post.status]}`}>
                        {post.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <Link href="/dashboard/generate">
                <div className="p-4 border border-gray-200 rounded-xl hover:border-[#6D28D9] hover:bg-[#6D28D9]/5 transition-all duration-300 cursor-pointer group">
                  <FileText className="h-8 w-8 text-[#6D28D9] mb-3" />
                  <h4 className="font-medium text-gray-900 group-hover:text-[#6D28D9]">Generate News Cards</h4>
                  <p className="text-sm text-gray-500 mt-1">Create new AI-powered news cards</p>
                </div>
              </Link>
              <Link href="/dashboard/scheduler">
                <div className="p-4 border border-gray-200 rounded-xl hover:border-[#6D28D9] hover:bg-[#6D28D9]/5 transition-all duration-300 cursor-pointer group">
                  <Calendar className="h-8 w-8 text-[#6D28D9] mb-3" />
                  <h4 className="font-medium text-gray-900 group-hover:text-[#6D28D9]">Schedule Posts</h4>
                  <p className="text-sm text-gray-500 mt-1">Plan your content calendar</p>
                </div>
              </Link>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#6D28D9] to-[#4C1D95] rounded-xl p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">Pro Tip</h3>
            <p className="text-white/80 text-sm mb-4">
              Posts scheduled between 10 AM - 2 PM tend to get 40% more engagement. 
              Consider adjusting your posting schedule for maximum reach.
            </p>
            <Button variant="secondary" className="bg-white text-[#6D28D9] hover:bg-gray-100">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

