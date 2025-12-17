"use client";

import { useState, useEffect } from "react";
import { 
  X, 
  Calendar, 
  Clock, 
  ChevronLeft, 
  ChevronRight,
  Check,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { convertToUTC, getUserTimezone } from "@/lib/timezone-utils";

// Social Platform Icons
const IconLinkedIn = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className={className}>
    <path d="M26.111,3H5.889c-1.595,0-2.889,1.293-2.889,2.889V26.111c0,1.595,1.293,2.889,2.889,2.889H26.111c1.595,0,2.889-1.293,2.889-2.889V5.889c0-1.595-1.293-2.889-2.889-2.889ZM10.861,25.389h-3.877V12.87h3.877v12.519Zm-1.957-14.158c-1.267,0-2.293-1.034-2.293-2.31s1.026-2.31,2.293-2.31,2.292,1.034,2.292,2.31-1.026,2.31-2.292,2.31Zm16.485,14.158h-3.858v-6.571c0-1.802-.685-2.809-2.111-2.809-1.551,0-2.362,1.048-2.362,2.809v6.571h-3.718V12.87h3.718v1.686s1.118-2.069,3.775-2.069,4.556,1.621,4.556,4.975v7.926Z" fill="currentColor" fillRule="evenodd" />
  </svg>
);

const IconX = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" className={className}>
    <path d="M 6.9199219 6 L 21.136719 26.726562 L 6.2285156 44 L 9.40625 44 L 22.544922 28.777344 L 32.986328 44 L 43 44 L 28.123047 22.3125 L 42.203125 6 L 39.027344 6 L 26.716797 20.261719 L 16.933594 6 L 6.9199219 6 z" fill="currentColor" />
  </svg>
);

interface SchedulePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule?: (postId: string | number, date: string, time: string, utcISOString?: string) => void;
  preselectedDate?: string;
}

// Mock data removed - now using real data from API

interface DraftPost {
  id: string | number;
  title: string;
  category: string;
  platforms: string[];
  preview?: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  AI: "bg-purple-100 text-purple-700",
  Tech: "bg-blue-100 text-blue-700",
  Motivation: "bg-orange-100 text-orange-700",
  Business: "bg-emerald-100 text-emerald-700",
};

// Removed fixed time options - now using dynamic time input

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export function SchedulePostModal({
  isOpen,
  onClose,
  onSchedule,
  preselectedDate,
}: SchedulePostModalProps) {
  const { user } = useAuth();
  const [step, setStep] = useState<"select" | "schedule">("select");
  const [selectedDraft, setSelectedDraft] = useState<DraftPost | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(preselectedDate || null);
  const [selectedTime, setSelectedTime] = useState("09:00");
  const [timeInput, setTimeInput] = useState("09:00");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [drafts, setDrafts] = useState<DraftPost[]>([]);
  const [isLoadingDrafts, setIsLoadingDrafts] = useState(false);

  // Fetch draft posts when modal opens
  useEffect(() => {
    async function fetchDrafts() {
      if (!isOpen || !user || step !== 'select') return;
      
      setIsLoadingDrafts(true);
      try {
        const response = await fetch(`/api/posts?userId=${user.id}&status=draft&limit=20`);
        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            const formattedDrafts: DraftPost[] = (result.posts || []).map((post: any) => ({
              id: post.id,
              title: post.title || 'Untitled Post',
              category: post.category || 'uncategorized',
              platforms: (post.post_platforms || []).map((pp: any) => 
                pp.platform === 'twitter' ? 'x' : pp.platform
              ),
              preview: post.content?.substring(0, 100) || '',
            }));
            setDrafts(formattedDrafts);
          }
        }
      } catch (error) {
        console.error('Error fetching drafts:', error);
      } finally {
        setIsLoadingDrafts(false);
      }
    }

    fetchDrafts();
  }, [isOpen, user, step]);

  if (!isOpen) return null;

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const today = new Date();
  
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const formatDate = (day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const isDateInPast = (day: number) => {
    const date = new Date(year, month, day);
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return date < todayStart;
  };

  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const handleDraftSelect = (draft: DraftPost) => {
    setSelectedDraft(draft);
    setStep("schedule");
  };

  const handleSchedule = () => {
    if (selectedDraft && selectedDate && selectedTime) {
      // Convert to UTC using user's timezone
      const timezone = getUserTimezone();
      const utcISOString = convertToUTC(selectedDate, selectedTime, timezone);
      
      // Pass UTC ISO string instead of separate date/time
      onSchedule?.(selectedDraft.id, selectedDate, selectedTime, utcISOString);
      handleClose();
    }
  };

  const handleClose = () => {
    setStep("select");
    setSelectedDraft(null);
    setSelectedDate(preselectedDate || null);
    setSelectedTime("09:00");
    setTimeInput("09:00");
    onClose();
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-50 transition-opacity animate-in fade-in duration-200"
        onClick={handleClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#6D28D9]/10 rounded-xl">
                <Calendar className="h-5 w-5 text-[#6D28D9]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Schedule Post</h2>
                <p className="text-xs text-gray-500">
                  {step === "select" ? "Select a draft to schedule" : "Choose date and time"}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
            {/* Step 1: Select Draft */}
            {step === "select" && (
              <div className="space-y-3">
                <p className="text-sm text-gray-600 mb-4">
                  Choose a draft from your content library to schedule.
                </p>
                {isLoadingDrafts ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-sm text-gray-500">Loading drafts...</div>
                  </div>
                ) : drafts.length > 0 ? (
                  drafts.map((draft) => (
                    <button
                      key={draft.id}
                      onClick={() => handleDraftSelect(draft)}
                      className="w-full p-4 border border-gray-200 rounded-xl text-left hover:border-[#6D28D9]/30 hover:bg-[#6D28D9]/5 transition-all duration-200 group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 group-hover:bg-[#6D28D9]/10">
                          <FileText className="h-5 w-5 text-gray-400 group-hover:text-[#6D28D9]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-sm font-medium text-gray-900 truncate">
                              {draft.title}
                            </h4>
                            <Badge className={`${CATEGORY_COLORS[draft.category]} text-xs`}>
                              {draft.category}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-500 line-clamp-1">{draft.preview}</p>
                          <div className="flex items-center gap-2 mt-2">
                            {draft.platforms.includes("linkedin") && (
                              <IconLinkedIn className="h-3.5 w-3.5 text-[#0A66C2]" />
                            )}
                            {draft.platforms.includes("x") && (
                              <IconX className="h-3.5 w-3.5 text-black" />
                            )}
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-[#6D28D9]" />
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">No drafts available</p>
                    <p className="text-xs text-gray-400 mt-1">Generate content first to schedule posts</p>
                  </div>
                )}

                {!isLoadingDrafts && drafts.length === 0 && (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">No drafts available</p>
                    <p className="text-xs text-gray-400 mt-1">Generate content first to schedule posts</p>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Pick Date & Time */}
            {step === "schedule" && selectedDraft && (
              <div className="space-y-6">
                {/* Selected Draft Preview */}
                <div className="p-3 bg-gray-50 rounded-xl flex items-center gap-3">
                  <FileText className="h-5 w-5 text-[#6D28D9]" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{selectedDraft.title}</p>
                    <p className="text-xs text-gray-500">{selectedDraft.category}</p>
                  </div>
                  <button
                    onClick={() => setStep("select")}
                    className="text-xs text-[#6D28D9] hover:underline"
                  >
                    Change
                  </button>
                </div>

                {/* Calendar */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-medium text-gray-900">Select Date</h4>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}
                        className="p-1.5 rounded-lg hover:bg-gray-100"
                      >
                        <ChevronLeft className="h-4 w-4 text-gray-600" />
                      </button>
                      <span className="text-sm font-medium text-gray-700 w-32 text-center">
                        {MONTHS[month]} {year}
                      </span>
                      <button
                        onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}
                        className="p-1.5 rounded-lg hover:bg-gray-100"
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
                        return <div key={`empty-${index}`} className="p-2" />;
                      }
                      const dateStr = formatDate(day);
                      const isSelected = selectedDate === dateStr;
                      const isPast = isDateInPast(day);
                      const isToday = today.toISOString().split('T')[0] === dateStr;

                      return (
                        <button
                          key={day}
                          disabled={isPast}
                          onClick={() => setSelectedDate(dateStr)}
                          className={`p-2 rounded-lg text-sm transition-all duration-200 ${
                            isSelected
                              ? "bg-[#6D28D9] text-white"
                              : isPast
                                ? "text-gray-300 cursor-not-allowed"
                                : isToday
                                  ? "bg-[#6D28D9]/10 text-[#6D28D9] font-medium"
                                  : "hover:bg-gray-100 text-gray-700"
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Time Selection */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <h4 className="text-sm font-medium text-gray-900">Select Time</h4>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <input
                        type="time"
                        value={timeInput}
                        onChange={(e) => {
                          setTimeInput(e.target.value);
                          setSelectedTime(e.target.value);
                        }}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:border-transparent"
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      Select any time you want your post to be published
                    </p>
                  </div>
                </div>

                {/* Summary */}
                {selectedDate && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <div className="flex items-center gap-2 text-emerald-700">
                      <Check className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        Scheduled for {(() => {
                          // Parse date string to avoid timezone issues
                          const [year, month, day] = selectedDate.split('-').map(Number);
                          const date = new Date(year, month - 1, day);
                          return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
                        })()} at {(() => {
                          const [hours, minutes] = selectedTime.split(':');
                          const hour24 = parseInt(hours);
                          const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
                          const ampm = hour24 >= 12 ? 'PM' : 'AM';
                          return `${hour12}:${minutes.padStart(2, '0')} ${ampm}`;
                        })()}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
            <div className="text-xs text-gray-500">
              {step === "schedule" && selectedDate && (
                <>Posting to {selectedDraft?.platforms.length} platform{selectedDraft?.platforms.length !== 1 ? "s" : ""}</>
              )}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleClose} className="rounded-xl">
                Cancel
              </Button>
              {step === "schedule" && (
                <Button
                  onClick={handleSchedule}
                  disabled={!selectedDate || !selectedTime}
                  className="bg-[#6D28D9] hover:bg-[#5B21B6] rounded-xl"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Post
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

