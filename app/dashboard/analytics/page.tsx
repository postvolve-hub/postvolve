"use client";

import { 
  TrendingUp, 
  Eye, 
  Heart, 
  Share2, 
  MousePointerClick,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

const MOCK_METRICS = [
  { 
    id: 1, 
    label: "Total Impressions", 
    value: "248.5K", 
    change: "+18.2%", 
    trend: "up",
    icon: Eye,
    color: "text-blue-600 bg-blue-50"
  },
  { 
    id: 2, 
    label: "Total Engagements", 
    value: "12.4K", 
    change: "+24.5%", 
    trend: "up",
    icon: Heart,
    color: "text-pink-600 bg-pink-50"
  },
  { 
    id: 3, 
    label: "Click-through Rate", 
    value: "4.8%", 
    change: "+0.6%", 
    trend: "up",
    icon: MousePointerClick,
    color: "text-purple-600 bg-purple-50"
  },
  { 
    id: 4, 
    label: "Total Shares", 
    value: "1.2K", 
    change: "-2.3%", 
    trend: "down",
    icon: Share2,
    color: "text-green-600 bg-green-50"
  },
  { 
    id: 5, 
    label: "Avg. Engagement Rate", 
    value: "5.2%", 
    change: "+1.1%", 
    trend: "up",
    icon: TrendingUp,
    color: "text-orange-600 bg-orange-50"
  },
];

const MOCK_POST_HISTORY = [
  { id: 1, title: "The Future of AI in Content Creation", date: "Dec 3, 2024", category: "AI", impressions: "15.2K", engagement: "842", status: "posted" },
  { id: 2, title: "5 Tech Trends to Watch in 2025", date: "Dec 2, 2024", category: "Tech", impressions: "12.8K", engagement: "654", status: "posted" },
  { id: 3, title: "Building a Growth Mindset", date: "Dec 1, 2024", category: "Motivation", impressions: "18.5K", engagement: "1.2K", status: "posted" },
  { id: 4, title: "Startup Funding Strategies", date: "Nov 30, 2024", category: "Business", impressions: "9.4K", engagement: "423", status: "posted" },
  { id: 5, title: "Machine Learning Best Practices", date: "Nov 29, 2024", category: "AI", impressions: "22.1K", engagement: "1.5K", status: "posted" },
  { id: 6, title: "Remote Work Productivity Tips", date: "Nov 28, 2024", category: "Business", impressions: "11.3K", engagement: "567", status: "posted" },
  { id: 7, title: "The Rise of Edge Computing", date: "Nov 27, 2024", category: "Tech", impressions: "14.7K", engagement: "789", status: "posted" },
  { id: 8, title: "Leadership in the Digital Age", date: "Nov 26, 2024", category: "Motivation", impressions: "16.9K", engagement: "923", status: "posted" },
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

export default function Analytics() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Analytics & History</h2>
            <p className="text-gray-500 mt-1">Track your news card performance and growth metrics.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="border-gray-300">
              <Calendar className="h-4 w-4 mr-2" />
              Last 30 Days
            </Button>
            <Button variant="outline" className="border-gray-300">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {MOCK_METRICS.map((metric) => (
            <div
              key={metric.id}
              className="bg-white rounded-xl p-5 shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-[1.01]"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg ${metric.color}`}>
                  <metric.icon className="h-5 w-5" />
                </div>
                <span className={`flex items-center text-sm font-medium ${
                  metric.trend === 'up' ? 'text-emerald-600' : 'text-red-500'
                }`}>
                  {metric.trend === 'up' ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4" />
                  )}
                  {metric.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
              <p className="text-sm text-gray-500 mt-1">{metric.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Impressions Over Time</h3>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-2 text-sm text-gray-500">
                <span className="w-3 h-3 rounded-full bg-[#1E3A8A]"></span>
                Impressions
              </span>
              <span className="flex items-center gap-2 text-sm text-gray-500">
                <span className="w-3 h-3 rounded-full bg-[#6D28D9]"></span>
                Engagements
              </span>
            </div>
          </div>
          <div className="h-64 flex items-end justify-between gap-2 px-4">
            {[65, 45, 78, 52, 88, 67, 92, 73, 85, 60, 95, 70, 82, 55, 90, 68, 75, 48, 86, 72, 94, 58, 80, 64, 88, 76, 91, 69, 84, 77].map((value, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-1">
                <div 
                  className="w-full bg-[#1E3A8A] rounded-t transition-all duration-300 hover:bg-[#6D28D9]"
                  style={{ height: `${value}%` }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-xs text-gray-400 px-4">
            <span>Nov 4</span>
            <span>Nov 11</span>
            <span>Nov 18</span>
            <span>Nov 25</span>
            <span>Dec 3</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Post History</h3>
            <Button variant="ghost" size="sm" className="text-[#6D28D9]">
              Export Data
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Post</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Impressions</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Engagement</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {MOCK_POST_HISTORY.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{post.title}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{post.date}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${CATEGORY_COLORS[post.category]}`}>
                        {post.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-900">
                        <Eye className="h-4 w-4 text-gray-400 mr-2" />
                        {post.impressions}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-900">
                        <Heart className="h-4 w-4 text-gray-400 mr-2" />
                        {post.engagement}
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
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-500">Showing 8 of 156 posts</p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="border-gray-300">Previous</Button>
              <Button variant="outline" size="sm" className="border-gray-300">Next</Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

