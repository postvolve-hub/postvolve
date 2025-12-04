"use client";

import { ReactNode } from "react";
import { 
  FileText, 
  Calendar, 
  BarChart3, 
  Bell, 
  Search,
  Inbox,
  Zap,
  Users,
  CreditCard,
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";

type EmptyStateVariant = 
  | "drafts" 
  | "scheduled" 
  | "analytics" 
  | "notifications" 
  | "search" 
  | "general"
  | "content"
  | "connections"
  | "billing"
  | "settings";

interface EmptyStateProps {
  variant?: EmptyStateVariant;
  title?: string;
  description?: string;
  icon?: ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

const VARIANT_CONFIG: Record<EmptyStateVariant, {
  icon: ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
}> = {
  drafts: {
    icon: <FileText className="h-12 w-12" />,
    title: "No drafts yet",
    description: "Generate your first AI-powered content to get started",
    actionLabel: "Generate Content",
  },
  scheduled: {
    icon: <Calendar className="h-12 w-12" />,
    title: "No scheduled posts",
    description: "Schedule your content to start building your presence",
    actionLabel: "Schedule Post",
  },
  analytics: {
    icon: <BarChart3 className="h-12 w-12" />,
    title: "No analytics data yet",
    description: "Start posting to see your performance metrics",
    actionLabel: "Go to Drafts",
  },
  notifications: {
    icon: <Bell className="h-12 w-12" />,
    title: "All caught up!",
    description: "You have no new notifications",
  },
  search: {
    icon: <Search className="h-12 w-12" />,
    title: "No results found",
    description: "Try adjusting your search or filters",
    actionLabel: "Clear Search",
  },
  general: {
    icon: <Inbox className="h-12 w-12" />,
    title: "Nothing here yet",
    description: "This section is empty",
  },
  content: {
    icon: <Zap className="h-12 w-12" />,
    title: "Ready to create?",
    description: "Start generating AI-powered content for your audience",
    actionLabel: "Generate Now",
  },
  connections: {
    icon: <Users className="h-12 w-12" />,
    title: "No connected accounts",
    description: "Connect your social media accounts to start posting",
    actionLabel: "Connect Account",
  },
  billing: {
    icon: <CreditCard className="h-12 w-12" />,
    title: "No billing history",
    description: "Your transactions will appear here",
  },
  settings: {
    icon: <Settings className="h-12 w-12" />,
    title: "Settings ready",
    description: "Configure your preferences to get started",
    actionLabel: "Configure",
  },
};

export function EmptyState({
  variant = "general",
  title,
  description,
  icon,
  action,
  secondaryAction,
  className = "",
}: EmptyStateProps) {
  const config = VARIANT_CONFIG[variant];
  
  const displayIcon = icon || config.icon;
  const displayTitle = title || config.title;
  const displayDescription = description || config.description;
  const displayActionLabel = action?.label || config.actionLabel;

  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
      {/* Icon */}
      <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-300 mb-4">
        {displayIcon}
      </div>

      {/* Text */}
      <h3 className="text-lg font-semibold text-gray-900 mb-1">
        {displayTitle}
      </h3>
      <p className="text-sm text-gray-500 max-w-sm mb-6">
        {displayDescription}
      </p>

      {/* Actions */}
      {(action || displayActionLabel) && (
        <div className="flex flex-wrap items-center justify-center gap-3">
          {action && (
            <Button
              onClick={action.onClick}
              className="bg-[#6D28D9] hover:bg-[#5B21B6] rounded-xl"
            >
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              variant="outline"
              onClick={secondaryAction.onClick}
              className="rounded-xl"
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

// Preset Empty States for convenience
export function EmptyDrafts({ onGenerate }: { onGenerate?: () => void }) {
  return (
    <EmptyState
      variant="drafts"
      action={onGenerate ? { label: "Generate Content", onClick: onGenerate } : undefined}
    />
  );
}

export function EmptyScheduled({ onSchedule }: { onSchedule?: () => void }) {
  return (
    <EmptyState
      variant="scheduled"
      action={onSchedule ? { label: "Schedule Post", onClick: onSchedule } : undefined}
    />
  );
}

export function EmptyAnalytics({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <EmptyState
      variant="analytics"
      action={onNavigate ? { label: "Go to Drafts", onClick: onNavigate } : undefined}
    />
  );
}

export function EmptyNotifications() {
  return <EmptyState variant="notifications" />;
}

export function EmptySearchResults({ onClear }: { onClear?: () => void }) {
  return (
    <EmptyState
      variant="search"
      action={onClear ? { label: "Clear Search", onClick: onClear } : undefined}
    />
  );
}

export function EmptyConnections({ onConnect }: { onConnect?: () => void }) {
  return (
    <EmptyState
      variant="connections"
      action={onConnect ? { label: "Connect Account", onClick: onConnect } : undefined}
    />
  );
}

