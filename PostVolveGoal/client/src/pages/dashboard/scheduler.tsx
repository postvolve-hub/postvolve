import { useState } from "react";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Edit2, 
  Trash2, 
  Plus,
  ChevronLeft,
  ChevronRight,
  MoreVertical
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

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
  Business: "bg-green-500",
  Motivation: "bg-orange-500",
};

export default function Scheduler() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

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
    return MOCK_SCHEDULED_POSTS.filter(post => post.date === dateStr);
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
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Content Scheduler</h2>
            <p className="text-gray-500 mt-1">Plan and manage your content calendar.</p>
          </div>
          <Button className="bg-[#6D28D9] hover:bg-[#4C1D95] text-white shadow-lg shadow-purple-500/20 transition-all duration-300 hover:scale-[1.02]">
            <Plus className="h-4 w-4 mr-2" />
            Schedule New Post
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                {MONTHS[month]} {year}
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={prevMonth}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-600" />
                </button>
                <button
                  onClick={nextMonth}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <ChevronRight className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1">
              {DAYS.map(day => (
                <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                  {day}
                </div>
              ))}
              {calendarDays.map((day, index) => {
                if (day === null) {
                  return <div key={`empty-${index}`} className="p-2 min-h-[80px]" />;
                }
                const dateStr = formatDate(day);
                const posts = getPostsForDate(dateStr);
                const isToday = new Date().toISOString().split('T')[0] === dateStr;
                const isSelected = selectedDate === dateStr;

                return (
                  <div
                    key={day}
                    onClick={() => setSelectedDate(dateStr)}
                    className={`p-2 min-h-[80px] border rounded-lg cursor-pointer transition-all duration-300 ${
                      isSelected 
                        ? 'border-[#6D28D9] bg-[#6D28D9]/5' 
                        : isToday 
                          ? 'border-[#6D28D9]/30 bg-[#6D28D9]/5' 
                          : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <span className={`text-sm font-medium ${
                      isToday ? 'text-[#6D28D9]' : 'text-gray-700'
                    }`}>
                      {day}
                    </span>
                    <div className="mt-1 space-y-1">
                      {posts.slice(0, 2).map(post => (
                        <div
                          key={post.id}
                          className={`h-1.5 rounded-full ${CATEGORY_COLORS[post.category]}`}
                        />
                      ))}
                      {posts.length > 2 && (
                        <span className="text-xs text-gray-500">+{posts.length - 2} more</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {selectedDate ? `Posts for ${new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : 'Upcoming Posts'}
            </h3>
            <div className="space-y-4">
              {(selectedDate ? getPostsForDate(selectedDate) : MOCK_SCHEDULED_POSTS.slice(0, 5)).map(post => (
                <div
                  key={post.id}
                  className="p-4 border border-gray-100 rounded-xl hover:border-gray-200 transition-all duration-300 group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">{post.title}</h4>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`w-2 h-2 rounded-full ${CATEGORY_COLORS[post.category]}`} />
                        <span className="text-xs text-gray-500">{post.category}</span>
                        <span className="text-xs text-gray-300">|</span>
                        <span className="text-xs text-gray-500">{post.platform}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>{post.time}</span>
                      </div>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                        <Edit2 className="h-4 w-4 text-gray-500" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-red-50 transition-colors">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {selectedDate && getPostsForDate(selectedDate).length === 0 && (
                <div className="text-center py-8">
                  <CalendarIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">No posts scheduled for this date</p>
                  <Button variant="outline" size="sm" className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Post
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">All Scheduled Posts</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Post</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Platform</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date & Time</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {MOCK_SCHEDULED_POSTS.map(post => (
                  <tr key={post.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{post.title}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                        post.category === 'AI' ? 'bg-purple-100 text-purple-700' :
                        post.category === 'Tech' ? 'bg-blue-100 text-blue-700' :
                        post.category === 'Business' ? 'bg-green-100 text-green-700' :
                        'bg-orange-100 text-orange-700'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${CATEGORY_COLORS[post.category]}`} />
                        {post.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{post.platform}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <CalendarIcon className="h-4 w-4 text-gray-400" />
                        {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        <span className="text-gray-300">|</span>
                        <Clock className="h-4 w-4 text-gray-400" />
                        {post.time}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                          <Edit2 className="h-4 w-4 text-gray-500" />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-red-50 transition-colors">
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                          <MoreVertical className="h-4 w-4 text-gray-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
