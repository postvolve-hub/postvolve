"use client";

import { useState } from "react";
import { 
  X, 
  Calendar, 
  ChevronLeft, 
  ChevronRight,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";

type PresetRange = "today" | "yesterday" | "7days" | "30days" | "90days" | "thisMonth" | "lastMonth" | "thisYear" | "custom";

interface DateRange {
  start: Date | null;
  end: Date | null;
}

interface DateRangePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply?: (range: DateRange, preset: PresetRange) => void;
  initialRange?: DateRange;
  initialPreset?: PresetRange;
}

const PRESETS: { id: PresetRange; label: string; getRange: () => DateRange }[] = [
  {
    id: "today",
    label: "Today",
    getRange: () => {
      const today = new Date();
      return { start: today, end: today };
    },
  },
  {
    id: "yesterday",
    label: "Yesterday",
    getRange: () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      return { start: yesterday, end: yesterday };
    },
  },
  {
    id: "7days",
    label: "Last 7 days",
    getRange: () => {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 6);
      return { start, end };
    },
  },
  {
    id: "30days",
    label: "Last 30 days",
    getRange: () => {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 29);
      return { start, end };
    },
  },
  {
    id: "90days",
    label: "Last 90 days",
    getRange: () => {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 89);
      return { start, end };
    },
  },
  {
    id: "thisMonth",
    label: "This month",
    getRange: () => {
      const start = new Date();
      start.setDate(1);
      const end = new Date();
      return { start, end };
    },
  },
  {
    id: "lastMonth",
    label: "Last month",
    getRange: () => {
      const start = new Date();
      start.setMonth(start.getMonth() - 1);
      start.setDate(1);
      const end = new Date(start.getFullYear(), start.getMonth() + 1, 0);
      return { start, end };
    },
  },
  {
    id: "thisYear",
    label: "This year",
    getRange: () => {
      const start = new Date();
      start.setMonth(0);
      start.setDate(1);
      const end = new Date();
      return { start, end };
    },
  },
  {
    id: "custom",
    label: "Custom range",
    getRange: () => ({ start: null, end: null }),
  },
];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export function DateRangePickerModal({
  isOpen,
  onClose,
  onApply,
  initialRange,
  initialPreset = "30days",
}: DateRangePickerModalProps) {
  const [selectedPreset, setSelectedPreset] = useState<PresetRange>(initialPreset);
  const [range, setRange] = useState<DateRange>(() => {
    if (initialRange) return initialRange;
    const preset = PRESETS.find((p) => p.id === initialPreset);
    return preset ? preset.getRange() : { start: null, end: null };
  });
  const [selecting, setSelecting] = useState<"start" | "end">("start");
  const [currentMonth, setCurrentMonth] = useState(new Date());

  if (!isOpen) return null;

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const today = new Date();
  
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const handlePresetSelect = (preset: typeof PRESETS[0]) => {
    setSelectedPreset(preset.id);
    if (preset.id !== "custom") {
      setRange(preset.getRange());
    }
  };

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(year, month, day);
    
    if (selecting === "start" || !range.start || clickedDate < range.start) {
      setRange({ start: clickedDate, end: null });
      setSelecting("end");
      setSelectedPreset("custom");
    } else {
      setRange({ ...range, end: clickedDate });
      setSelecting("start");
      setSelectedPreset("custom");
    }
  };

  const isInRange = (day: number) => {
    if (!range.start || !range.end) return false;
    const date = new Date(year, month, day);
    return date >= range.start && date <= range.end;
  };

  const isStartDate = (day: number) => {
    if (!range.start) return false;
    const date = new Date(year, month, day);
    return date.toDateString() === range.start.toDateString();
  };

  const isEndDate = (day: number) => {
    if (!range.end) return false;
    const date = new Date(year, month, day);
    return date.toDateString() === range.end.toDateString();
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "Select date";
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const handleApply = () => {
    if (range.start) {
      onApply?.(range, selectedPreset);
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedPreset(initialPreset);
    const preset = PRESETS.find((p) => p.id === initialPreset);
    setRange(preset ? preset.getRange() : { start: null, end: null });
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
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#6D28D9]/10 rounded-xl">
                <Calendar className="h-5 w-5 text-[#6D28D9]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Select Date Range</h2>
                <p className="text-xs text-gray-500">Choose a preset or select custom dates</p>
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
          <div className="flex">
            {/* Presets */}
            <div className="w-48 border-r border-gray-100 p-3 space-y-1">
              {PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handlePresetSelect(preset)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedPreset === preset.id
                      ? "bg-[#6D28D9]/10 text-[#6D28D9] font-medium"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {preset.label}
                  {selectedPreset === preset.id && (
                    <Check className="h-4 w-4" />
                  )}
                </button>
              ))}
            </div>

            {/* Calendar */}
            <div className="flex-1 p-6">
              {/* Selected Range Display */}
              <div className="flex items-center gap-3 mb-6">
                <div 
                  className={`flex-1 p-3 rounded-xl border-2 cursor-pointer transition-colors ${
                    selecting === "start" ? "border-[#6D28D9] bg-[#6D28D9]/5" : "border-gray-200"
                  }`}
                  onClick={() => setSelecting("start")}
                >
                  <p className="text-xs text-gray-500 mb-1">Start Date</p>
                  <p className={`text-sm font-medium ${range.start ? "text-gray-900" : "text-gray-400"}`}>
                    {formatDate(range.start)}
                  </p>
                </div>
                <div className="text-gray-300">→</div>
                <div 
                  className={`flex-1 p-3 rounded-xl border-2 cursor-pointer transition-colors ${
                    selecting === "end" ? "border-[#6D28D9] bg-[#6D28D9]/5" : "border-gray-200"
                  }`}
                  onClick={() => setSelecting("end")}
                >
                  <p className="text-xs text-gray-500 mb-1">End Date</p>
                  <p className={`text-sm font-medium ${range.end ? "text-gray-900" : "text-gray-400"}`}>
                    {formatDate(range.end)}
                  </p>
                </div>
              </div>

              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}
                  className="p-1.5 rounded-lg hover:bg-gray-100"
                >
                  <ChevronLeft className="h-4 w-4 text-gray-600" />
                </button>
                <h3 className="text-sm font-semibold text-gray-900">
                  {MONTHS[month]} {year}
                </h3>
                <button
                  onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}
                  className="p-1.5 rounded-lg hover:bg-gray-100"
                >
                  <ChevronRight className="h-4 w-4 text-gray-600" />
                </button>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {DAYS.map((day) => (
                  <div key={day} className="p-2 text-center text-xs font-medium text-gray-500">
                    {day}
                  </div>
                ))}
                {calendarDays.map((day, index) => {
                  if (day === null) {
                    return <div key={`empty-${index}`} className="p-2" />;
                  }
                  
                  const isFuture = new Date(year, month, day) > today;
                  const inRange = isInRange(day);
                  const isStart = isStartDate(day);
                  const isEnd = isEndDate(day);
                  const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();

                  return (
                    <button
                      key={day}
                      disabled={isFuture}
                      onClick={() => handleDateClick(day)}
                      className={`p-2 rounded-lg text-sm transition-all duration-150 ${
                        isStart || isEnd
                          ? "bg-[#6D28D9] text-white font-medium"
                          : inRange
                            ? "bg-[#6D28D9]/10 text-[#6D28D9]"
                            : isFuture
                              ? "text-gray-300 cursor-not-allowed"
                              : isToday
                                ? "bg-gray-100 text-gray-900 font-medium"
                                : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
            <div className="text-xs text-gray-500">
              {range.start && range.end && (
                <>
                  Selected: {Math.ceil((range.end.getTime() - range.start.getTime()) / (1000 * 60 * 60 * 24)) + 1} days
                </>
              )}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleClose} className="rounded-xl">
                Cancel
              </Button>
              <Button
                onClick={handleApply}
                disabled={!range.start}
                className="bg-[#6D28D9] hover:bg-[#5B21B6] rounded-xl"
              >
                Apply Range
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

