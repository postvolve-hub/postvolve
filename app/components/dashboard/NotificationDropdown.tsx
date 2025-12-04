"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Bell, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  Clock, 
  X,
  Check,
  Trash2,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";

type NotificationType = "success" | "error" | "info" | "warning";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
  actionUrl?: string;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "success",
    title: "Post Published",
    message: "Your news card 'The Rise of AI Agents' was successfully posted to LinkedIn.",
    time: "2 min ago",
    read: false,
    actionUrl: "/dashboard/analytics",
  },
  {
    id: "2",
    type: "info",
    title: "New Draft Ready",
    message: "5 new AI-generated drafts are waiting for your review.",
    time: "1 hour ago",
    read: false,
    actionUrl: "/dashboard/generate",
  },
  {
    id: "3",
    type: "warning",
    title: "Connection Expiring",
    message: "Your X account connection will expire in 3 days. Please reconnect.",
    time: "3 hours ago",
    read: false,
    actionUrl: "/dashboard/settings",
  },
  {
    id: "4",
    type: "success",
    title: "Schedule Completed",
    message: "Your weekly content schedule has been set up successfully.",
    time: "Yesterday",
    read: true,
  },
  {
    id: "5",
    type: "error",
    title: "Post Failed",
    message: "Failed to post to Instagram. Please check your connection.",
    time: "2 days ago",
    read: true,
    actionUrl: "/dashboard/settings",
  },
];

const TYPE_STYLES: Record<NotificationType, { icon: React.ReactNode; bg: string; iconColor: string }> = {
  success: {
    icon: <CheckCircle className="h-4 w-4" />,
    bg: "bg-emerald-100",
    iconColor: "text-emerald-600",
  },
  error: {
    icon: <AlertCircle className="h-4 w-4" />,
    bg: "bg-red-100",
    iconColor: "text-red-600",
  },
  info: {
    icon: <Info className="h-4 w-4" />,
    bg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  warning: {
    icon: <Clock className="h-4 w-4" />,
    bg: "bg-amber-100",
    iconColor: "text-amber-600",
  },
};

interface NotificationDropdownProps {
  className?: string;
}

export function NotificationDropdown({ className = "" }: NotificationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <Bell className="h-5 w-5 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] text-[10px] font-bold text-white bg-red-500 rounded-full px-1">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] font-medium bg-[#6D28D9] text-white rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="p-1.5 text-xs text-gray-500 hover:text-[#6D28D9] hover:bg-gray-100 rounded-lg transition-colors"
                  title="Mark all as read"
                >
                  <Check className="h-4 w-4" />
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={clearAll}
                  className="p-1.5 text-xs text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Clear all"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-12 text-center">
                <Bell className="h-10 w-10 text-gray-200 mx-auto mb-3" />
                <p className="text-sm text-gray-500">No notifications</p>
                <p className="text-xs text-gray-400 mt-1">You&apos;re all caught up!</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {notifications.map((notification) => {
                  const styles = TYPE_STYLES[notification.type];
                  return (
                    <div
                      key={notification.id}
                      className={`px-4 py-3 hover:bg-gray-50 transition-colors group ${
                        !notification.read ? "bg-[#6D28D9]/5" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${styles.bg} ${styles.iconColor}`}>
                          {styles.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className={`text-sm ${!notification.read ? "font-semibold" : "font-medium"} text-gray-900`}>
                              {notification.title}
                            </h4>
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-gray-200 transition-all"
                            >
                              <X className="h-3 w-3 text-gray-400" />
                            </button>
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-[10px] text-gray-400">{notification.time}</span>
                            <div className="flex items-center gap-2">
                              {!notification.read && (
                                <button
                                  onClick={() => markAsRead(notification.id)}
                                  className="text-[10px] text-[#6D28D9] hover:underline"
                                >
                                  Mark as read
                                </button>
                              )}
                              {notification.actionUrl && (
                                <a
                                  href={notification.actionUrl}
                                  className="flex items-center gap-1 text-[10px] text-gray-500 hover:text-[#6D28D9]"
                                >
                                  View <ExternalLink className="h-2.5 w-2.5" />
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs text-gray-600 hover:text-[#6D28D9] hover:bg-white"
              >
                View All Notifications
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

