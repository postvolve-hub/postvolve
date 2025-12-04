"use client";

import { useState } from "react";
import { 
  Clock, 
  Edit2, 
  Trash2, 
  Plus,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  MoreHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { SchedulePostModal } from "@/components/dashboard/SchedulePostModal";
import { ConfirmationModal } from "@/components/dashboard/ConfirmationModal";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { toast } from "@/hooks/use-toast";

// Custom Icons
const IconCalendar = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="18" height="18" x="3" y="4" rx="2" />
    <path d="M3 10h18" />
    <path d="M8 2v4" />
    <path d="M16 2v4" />
    <path d="M8 14h.01" />
    <path d="M12 14h.01" />
    <path d="M16 14h.01" />
    <path d="M8 18h.01" />
    <path d="M12 18h.01" />
  </svg>
);

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const MOCK_SCHEDULED_POSTS = [
  { id: 1, title: "The Future of AI in Content Creation", date: "2024-12-03", time: "15:00", category: "AI", platform: "LinkedIn" },
  { id: 2, title: "5 Tech Trends to Watch in 2025", date: "2024-12-04", time: "10:00", category: "Tech", platform: "Twitter" },
  { id: 3, title: "Building a Growth Mindset", date: "2024-12-05", time: "14:00", category: "Motivation", platform: "LinkedIn" },
  { id: 4, title: "Startup Funding Strategies", date: "2024-12-06", time: "11:00", category: "Business", platform: "Twitter" },
  { id: 5, title: "Machine Learning Best Practices", date: "2024-12-07", time: "09:00", category: "AI", platform: "LinkedIn" },
  { id: 6, title: "Remote Work Productivity Tips", date: "2024-12-10", time: "13:00", category: "Business", platform: "Twitter" },
];

const CATEGORY_COLORS: Record<string, string> = {
  AI: "bg-purple-500",
  Tech: "bg-blue-500",
  Business: "bg-emerald-500",
  Motivation: "bg-orange-500",
};

const CATEGORY_BADGE_COLORS: Record<string, string> = {
  AI: "bg-purple-100 text-purple-700",
  Tech: "bg-blue-100 text-blue-700",
  Business: "bg-emerald-100 text-emerald-700",
  Motivation: "bg-orange-100 text-orange-700",
};

export default function Scheduler() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<number | null>(null);
  const [scheduledPosts, setScheduledPosts] = useState(MOCK_SCHEDULED_POSTS);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const formatDate = (day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const getPostsForDate = (dateStr: string) => {
    return scheduledPosts.filter(post => post.date === dateStr);
  };

  const handleSchedulePost = (postId: number, date: string, time: string) => {
    // In real app, this would add a new scheduled post
    toast({
      title: "Post Scheduled",
      description: `Your post has been scheduled for ${new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at ${time}.`,
    });
    setScheduleModalOpen(false);
  };

  const handleDeletePost = (postId: number) => {
    setPostToDelete(postId);
    setDeleteModalOpen(true);
  };

  const confirmDeletePost = () => {
    if (postToDelete !== null) {
      setScheduledPosts(prev => prev.filter(post => post.id !== postToDelete));
      toast({
        title: "Post Deleted",
        description: "The scheduled post has been removed.",
      });
    }
    setDeleteModalOpen(false);
    setPostToDelete(null);
  };

  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in fade-in duration-500">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-in slide-in-from-bottom-2 duration-500">
          <div>
            <h2 className="text-xl font-bold text-gray-900">News Card Scheduler</h2>
            <p className="text-sm text-gray-500 mt-1">Plan and manage your news card calendar.</p>
          </div>
          <Button 
            onClick={() => setScheduleModalOpen(true)}
            className="bg-[#6D28D9] hover:bg-[#5B21B6] text-white shadow-sm hover:shadow-md transition-all duration-200 rounded-xl"
          >
            <Plus className="h-4 w-4 mr-2" />
            Schedule New Post
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Calendar */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 animate-in slide-in-from-bottom-2 duration-500 delay-75">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-gray-900">
                {MONTHS[month]} {year}
              </h3>
              <div className="flex items-center gap-1">
                <button
                  onClick={prevMonth}
                  className="p-2 rounded-xl hover:bg-gray-100 transition-all duration-200"
                >
                  <ChevronLeft className="h-4 w-4 text-gray-600" />
                </button>
                <button
                  onClick={nextMonth}
                  className="p-2 rounded-xl hover:bg-gray-100 transition-all duration-200"
                >
                  <ChevronRight className="h-4 w-4 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1">
              {DAYS.map(day => (
                <div key={day} className="p-2 text-center text-xs font-medium text-gray-500">
                  {day}
                </div>
              ))}
              {calendarDays.map((day, index) => {
                if (day === null) {
                  return <div key={`empty-${index}`} className="p-2 min-h-[70px]" />;
                }
                const dateStr = formatDate(day);
                const posts = getPostsForDate(dateStr);
                const isToday = new Date().toISOString().split('T')[0] === dateStr;
                const isSelected = selectedDate === dateStr;

                return (
                  <div
                    key={day}
                    onClick={() => setSelectedDate(dateStr)}
                    className={`p-2 min-h-[70px] border rounded-xl cursor-pointer transition-all duration-200 ${
                      isSelected 
                        ? 'border-[#6D28D9] bg-[#6D28D9]/5' 
                        : isToday 
                          ? 'border-[#6D28D9]/30 bg-[#6D28D9]/5' 
                          : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <span className={`text-xs font-medium ${
                      isToday ? 'text-[#6D28D9]' : 'text-gray-700'
                    }`}>
                      {day}
                    </span>
                    <div className="mt-1 space-y-0.5">
                      {posts.slice(0, 2).map(post => (
                        <div
                          key={post.id}
                          className={`h-1 rounded-full ${CATEGORY_COLORS[post.category]}`}
                        />
                      ))}
                      {posts.length > 2 && (
                        <span className="text-[10px] text-gray-500">+{posts.length - 2}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upcoming Posts Sidebar */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 animate-in slide-in-from-bottom-2 duration-500 delay-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900">
                {selectedDate ? `Posts for ${new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : 'Upcoming Posts'}
              </h3>
              <button className="p-1 rounded hover:bg-gray-100 transition-all duration-200">
                <MoreHorizontal className="h-4 w-4 text-gray-400" />
              </button>
            </div>
            <div className="space-y-3">
              {(selectedDate ? getPostsForDate(selectedDate) : scheduledPosts.slice(0, 5)).map((post, index) => (
                <div
                  key={post.id}
                  className="p-3 border border-gray-100 rounded-xl hover:border-gray-200 hover:bg-gray-50/50 transition-all duration-200 group"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">{post.title}</h4>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${CATEGORY_COLORS[post.category]}`} />
                        <span className="text-xs text-gray-500">{post.category}</span>
                        <span className="text-xs text-gray-300">|</span>
                        <span className="text-xs text-gray-500">{post.platform}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-1.5 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>{post.time}</span>
                      </div>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-0.5">
                      <button className="p-1 rounded hover:bg-gray-100 transition-colors">
                        <Edit2 className="h-3.5 w-3.5 text-gray-500" />
                      </button>
                      <button 
                        className="p-1 rounded hover:bg-red-50 transition-colors"
                        onClick={() => handleDeletePost(post.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5 text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {selectedDate && getPostsForDate(selectedDate).length === 0 && (
                <EmptyState 
                  variant="scheduled"
                  title="No posts for this day"
                  description="Schedule a post to publish on this date."
                  action={{
                    label: "Schedule Post",
                    onClick: () => setScheduleModalOpen(true)
                  }}
                  className="py-6"
                />
              )}
            </div>
          </div>
        </div>

        {/* All Scheduled Posts Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-in slide-in-from-bottom-2 duration-500 delay-150">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">All Scheduled Posts</h3>
            <button className="p-1 rounded hover:bg-gray-100 transition-all duration-200">
              <MoreHorizontal className="h-4 w-4 text-gray-400" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Post</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Platform</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date & Time</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {scheduledPosts.map((post, index) => (
                  <tr key={post.id} className="hover:bg-gray-50/50 transition-colors duration-200">
                    <td className="px-5 py-3">
                      <p className="text-sm font-medium text-gray-900">{post.title}</p>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${CATEGORY_BADGE_COLORS[post.category]}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${CATEGORY_COLORS[post.category]}`} />
                        {post.category}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-600">{post.platform}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <IconCalendar className="h-3.5 w-3.5 text-gray-400" />
                        {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        <span className="text-gray-300">|</span>
                        <Clock className="h-3.5 w-3.5 text-gray-400" />
                        {post.time}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1">
                        <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                          <Edit2 className="h-3.5 w-3.5 text-gray-500" />
                        </button>
                        <button 
                          className="p-1.5 rounded-lg hover:bg-red-50 transition-colors duration-200"
                          onClick={() => handleDeletePost(post.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5 text-red-500" />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                          <MoreVertical className="h-3.5 w-3.5 text-gray-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {scheduledPosts.length === 0 && (
              <EmptyState 
                variant="scheduled"
                title="No scheduled posts yet"
                description="Schedule your content to start building your presence."
                action={{
                  label: "Schedule Your First Post",
                  onClick: () => setScheduleModalOpen(true)
                }}
              />
            )}
          </div>
        </div>

        {/* Schedule Post Modal */}
        <SchedulePostModal
          isOpen={scheduleModalOpen}
          onClose={() => setScheduleModalOpen(false)}
          onSchedule={handleSchedulePost}
          preselectedDate={selectedDate || undefined}
        />

        {/* Delete Confirmation Modal */}
        <ConfirmationModal
          isOpen={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false);
            setPostToDelete(null);
          }}
          onConfirm={confirmDeletePost}
          title="Delete Scheduled Post"
          description="Are you sure you want to delete this scheduled post? This action cannot be undone."
          confirmText="Delete Post"
          cancelText="Keep Post"
          variant="danger"
        />
      </div>
    </DashboardLayout>
  );
}
