"use client";

import { 
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Filter,
  MoreHorizontal
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DateRangePickerModal } from "@/components/dashboard/DateRangePickerModal";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { toast } from "@/hooks/use-toast";

// Custom Icons
const IconEye = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const IconBarChart = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="12" x2="12" y1="20" y2="10" />
    <line x1="18" x2="18" y1="20" y2="4" />
    <line x1="6" x2="6" y1="20" y2="14" />
  </svg>
);

// Professional icon for Engagements (Activity/Pulse)
const IconActivity = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
);

// Professional icon for Impressions (Layers/Stack)
const IconLayers = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
    <path d="m22 12.5-8.97 4.08a2 2 0 0 1-1.66 0L2 12.5" />
    <path d="m22 17.5-8.97 4.08a2 2 0 0 1-1.66 0L2 17.5" />
  </svg>
);

const IconHeart = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
);

const IconClick = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m9 9 5 12 1.8-5.2L21 14Z" />
    <path d="M7.2 2.2 8 5.1" />
    <path d="m5.1 8-2.9-.8" />
    <path d="M14 4.1 12 6" />
    <path d="m6 12-1.9 2" />
  </svg>
);

const IconShare = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
    <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
  </svg>
);

const IconTrending = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    <polyline points="16 7 22 7 22 13" />
  </svg>
);

const MOCK_METRICS = [
  { 
    id: 1, 
    label: "Total Impressions", 
    value: "248.5K", 
    change: "+18.2%", 
    trend: "up",
    icon: IconLayers,
    color: "text-blue-600 bg-blue-50"
  },
  { 
    id: 2, 
    label: "Total Engagements", 
    value: "12.4K", 
    change: "+24.5%", 
    trend: "up",
    icon: IconActivity,
    color: "text-emerald-600 bg-emerald-50"
  },
  { 
    id: 3, 
    label: "Click-through Rate", 
    value: "4.8%", 
    change: "+0.6%", 
    trend: "up",
    icon: IconClick,
    color: "text-purple-600 bg-purple-50"
  },
  { 
    id: 4, 
    label: "Total Shares", 
    value: "1.2K", 
    change: "-2.3%", 
    trend: "down",
    icon: IconShare,
    color: "text-green-600 bg-green-50"
  },
  { 
    id: 5, 
    label: "Avg. Engagement Rate", 
    value: "5.2%", 
    change: "+1.1%", 
    trend: "up",
    icon: IconTrending,
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
];

const CATEGORY_COLORS: Record<string, string> = {
  AI: "bg-purple-100 text-purple-700",
  Tech: "bg-blue-100 text-blue-700",
  Business: "bg-emerald-100 text-emerald-700",
  Motivation: "bg-orange-100 text-orange-700",
};

const STATUS_STYLES: Record<string, string> = {
  scheduled: "bg-amber-50 text-amber-600",
  draft: "bg-gray-100 text-gray-600",
  posted: "bg-emerald-50 text-emerald-600",
  error: "bg-red-50 text-red-600",
};

export default function Analytics() {
  const [dateRangeModalOpen, setDateRangeModalOpen] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState("Last 30 Days");

  const handleDateRangeApply = (range: { start: Date | null; end: Date | null }, preset: string) => {
    const presetLabels: Record<string, string> = {
      today: "Today",
      yesterday: "Yesterday",
      "7days": "Last 7 Days",
      "30days": "Last 30 Days",
      "90days": "Last 90 Days",
      thisMonth: "This Month",
      lastMonth: "Last Month",
      thisYear: "This Year",
      custom: "Custom Range",
    };
    setSelectedDateRange(presetLabels[preset] || "Custom Range");
    toast({
      title: "Date Range Updated",
      description: `Analytics now showing data for ${presetLabels[preset] || "custom range"}.`,
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in fade-in duration-500">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-in slide-in-from-bottom-2 duration-500">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Analytics & History</h2>
            <p className="text-sm text-gray-500 mt-1">Track your news card performance and growth metrics.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              className="border-gray-200 text-gray-600 rounded-xl h-9 text-sm transition-all duration-200"
              onClick={() => setDateRangeModalOpen(true)}
            >
              <Calendar className="h-4 w-4 mr-2" />
              {selectedDateRange}
            </Button>
            <Button variant="outline" className="border-gray-200 text-gray-600 rounded-xl h-9 text-sm transition-all duration-200">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 animate-in slide-in-from-bottom-2 duration-500 delay-75">
          {MOCK_METRICS.map((metric, index) => {
            const IconComponent = metric.icon;
            return (
              <div
                key={metric.id}
                className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.01]"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-xl ${metric.color}`}>
                    <IconComponent />
                  </div>
                  <span className={`flex items-center text-xs font-medium ${
                    metric.trend === 'up' ? 'text-emerald-600' : 'text-red-500'
                  }`}>
                    {metric.trend === 'up' ? (
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    ) : (
                      <ArrowDownRight className="h-3.5 w-3.5" />
                    )}
                    {metric.change}
                  </span>
                </div>
                <p className="text-xl font-bold text-gray-900">{metric.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{metric.label}</p>
              </div>
            );
          })}
        </div>

        {/* Chart */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 animate-in slide-in-from-bottom-2 duration-500 delay-100">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-semibold text-gray-900">Impressions Over Time</h3>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-2 text-xs text-gray-500">
                <span className="w-2.5 h-2.5 rounded-full bg-[#6D28D9]"></span>
                Impressions
              </span>
              <span className="flex items-center gap-2 text-xs text-gray-500">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></span>
                Engagements
              </span>
            </div>
          </div>
          
          {/* Chart Container */}
          <div className="relative h-64">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 bottom-8 w-12 flex flex-col justify-between text-[10px] text-gray-400">
              <span>50K</span>
              <span>40K</span>
              <span>30K</span>
              <span>20K</span>
              <span>10K</span>
              <span>0</span>
            </div>
            
            {/* Chart Area */}
            <div className="ml-14 h-full pb-8 relative overflow-hidden">
              {/* Grid lines */}
              <div className="absolute inset-0 bottom-8 flex flex-col justify-between">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="border-t border-gray-100 w-full" />
                ))}
              </div>
              
              {/* SVG Chart */}
              <svg className="absolute inset-0 bottom-8 w-full h-[calc(100%-32px)]" viewBox="0 0 100 100" preserveAspectRatio="none">
                {/* Gradients */}
                <defs>
                  <linearGradient id="impressionsGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#6D28D9" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#6D28D9" stopOpacity="0.02" />
                  </linearGradient>
                  <linearGradient id="engagementsGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0.02" />
                  </linearGradient>
                </defs>
                
                {/* Impressions Area - with fade in animation */}
                <path
                  d="M0,85 C8,78 16,70 20,65 C28,55 32,60 40,52 C48,44 52,48 60,42 C68,36 72,40 80,32 C88,24 92,28 100,20 L100,100 L0,100 Z"
                  fill="url(#impressionsGradient)"
                  className="chart-area-animate"
                />
                
                {/* Impressions Line - smooth curve with draw animation */}
                <path
                  d="M0,85 C8,78 16,70 20,65 C28,55 32,60 40,52 C48,44 52,48 60,42 C68,36 72,40 80,32 C88,24 92,28 100,20"
                  fill="none"
                  stroke="#6D28D9"
                  strokeWidth="0.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="chart-line-animate"
                  pathLength="100"
                />
                
                {/* Engagements Area - with fade in animation */}
                <path
                  d="M0,92 C12,90 20,88 30,85 C40,82 50,80 60,76 C70,72 80,68 90,65 C95,63 100,60 100,60 L100,100 L0,100 Z"
                  fill="url(#engagementsGradient)"
                  className="chart-area-animate-delay"
                />
                
                {/* Engagements Line - smooth curve with draw animation */}
                <path
                  d="M0,92 C12,90 20,88 30,85 C40,82 50,80 60,76 C70,72 80,68 90,65 C95,63 100,60 100,60"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="0.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="chart-line-animate-delay"
                  pathLength="100"
                />
              </svg>
              
              {/* Data points overlay - positioned absolutely */}
              <div className="absolute inset-0 bottom-8">
                {/* Impressions data points */}
                {[
                  { left: '0%', top: '85%' },
                  { left: '20%', top: '65%' },
                  { left: '40%', top: '52%' },
                  { left: '60%', top: '42%' },
                  { left: '80%', top: '32%' },
                  { left: '100%', top: '20%' },
                ].map((pos, i) => (
                  <div
                    key={`imp-dot-${i}`}
                    className="absolute w-2 h-2 -ml-1 -mt-1 rounded-full bg-white border-2 border-[#6D28D9] chart-dot-animate shadow-sm hover:scale-150 transition-transform cursor-pointer"
                    style={{ 
                      left: pos.left, 
                      top: pos.top,
                      animationDelay: `${800 + i * 100}ms`
                    }}
                    title={`${Math.round((100 - parseFloat(pos.top)) * 500)}K impressions`}
                  />
                ))}
                
                {/* Engagements data points */}
                {[
                  { left: '0%', top: '92%' },
                  { left: '30%', top: '85%' },
                  { left: '60%', top: '76%' },
                  { left: '90%', top: '65%' },
                  { left: '100%', top: '60%' },
                ].map((pos, i) => (
                  <div
                    key={`eng-dot-${i}`}
                    className="absolute w-2 h-2 -ml-1 -mt-1 rounded-full bg-white border-2 border-emerald-500 chart-dot-animate shadow-sm hover:scale-150 transition-transform cursor-pointer"
                    style={{ 
                      left: pos.left, 
                      top: pos.top,
                      animationDelay: `${1000 + i * 100}ms`
                    }}
                    title={`${Math.round((100 - parseFloat(pos.top)) * 150)} engagements`}
                  />
                ))}
              </div>
              
              {/* X-axis labels */}
              <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[10px] text-gray-400">
                <span>Nov 4</span>
                <span>Nov 11</span>
                <span>Nov 18</span>
                <span>Nov 25</span>
                <span>Dec 3</span>
              </div>
            </div>
          </div>
          
          {/* Chart Stats Summary */}
          <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 animate-in fade-in slide-in-from-left-2 duration-500 delay-300">
              <div className="w-10 h-10 rounded-xl bg-[#6D28D9]/10 flex items-center justify-center">
                <IconLayers className="h-5 w-5 text-[#6D28D9]" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">248.5K</p>
                <p className="text-xs text-gray-500">Total Impressions</p>
              </div>
            </div>
            <div className="flex items-center gap-3 animate-in fade-in slide-in-from-right-2 duration-500 delay-300">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <IconActivity className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">12.4K</p>
                <p className="text-xs text-gray-500">Total Engagements</p>
              </div>
            </div>
          </div>
        </div>

        {/* Post History Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-in slide-in-from-bottom-2 duration-500 delay-150">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">Post History</h3>
            <Button variant="ghost" size="sm" className="text-[#6D28D9] hover:bg-[#6D28D9]/5 rounded-xl h-8 text-xs transition-all duration-200">
              Export Data
            </Button>
          </div>
          {MOCK_POST_HISTORY.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50/50">
                    <tr>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Post</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Impressions</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Engagement</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {MOCK_POST_HISTORY.map((post, index) => (
                      <tr key={post.id} className="hover:bg-gray-50/50 transition-colors duration-200">
                        <td className="px-5 py-3">
                          <p className="text-sm font-medium text-gray-900">{post.title}</p>
                        </td>
                        <td className="px-5 py-3 text-sm text-gray-500">{post.date}</td>
                        <td className="px-5 py-3">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${CATEGORY_COLORS[post.category]}`}>
                            {post.category}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center text-sm text-gray-900">
                            <IconEye className="h-3.5 w-3.5 text-gray-400 mr-1.5" />
                            {post.impressions}
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center text-sm text-gray-900">
                            <IconHeart className="h-3.5 w-3.5 text-gray-400 mr-1.5" />
                            {post.engagement}
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize ${STATUS_STYLES[post.status]}`}>
                            {post.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
                <p className="text-xs text-gray-500">Showing 6 of 156 posts</p>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="border-gray-200 rounded-xl h-8 text-xs transition-all duration-200">Previous</Button>
                  <Button variant="outline" size="sm" className="border-gray-200 rounded-xl h-8 text-xs transition-all duration-200">Next</Button>
                </div>
              </div>
            </>
          ) : (
            <EmptyState 
              variant="analytics"
              title="No analytics data yet"
              description="Start posting to see your performance metrics here."
              action={{
                label: "Go to Content",
                onClick: () => window.location.href = "/dashboard/generate"
              }}
            />
          )}
        </div>

        {/* Date Range Picker Modal */}
        <DateRangePickerModal
          isOpen={dateRangeModalOpen}
          onClose={() => setDateRangeModalOpen(false)}
          onApply={handleDateRangeApply}
          initialPreset="30days"
        />
      </div>
    </DashboardLayout>
  );
}
