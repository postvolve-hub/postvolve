"use client";

import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Subscription } from "@/lib/subscription-access";
import { getSubscriptionStatusMessage, getTrialDaysRemaining } from "@/lib/subscription-access";

interface SubscriptionBannerProps {
  subscription: Subscription | null;
  onDismiss?: () => void;
}

export function SubscriptionBanner({ subscription, onDismiss }: SubscriptionBannerProps) {
  const router = useRouter();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || !subscription) return null;

  const statusInfo = getSubscriptionStatusMessage(subscription);
  const trialDays = getTrialDaysRemaining(subscription);

  // Don't show banner for active subscriptions without warnings
  if (subscription.status === "active" && !statusInfo.actionRequired) {
    return null;
  }

  const handleDismiss = () => {
    setDismissed(true);
    if (onDismiss) onDismiss();
  };

  const handleAction = () => {
    router.push("/dashboard/billing");
  };

  const getIcon = () => {
    switch (statusInfo.type) {
      case "success":
        return <CheckCircle className="h-5 w-5" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5" />;
      case "error":
        return <AlertCircle className="h-5 w-5" />;
      case "info":
        return <Info className="h-5 w-5" />;
    }
  };

  const getBgColor = () => {
    switch (statusInfo.type) {
      case "success":
        return "bg-green-50 border-green-200";
      case "warning":
        return "bg-yellow-50 border-yellow-200";
      case "error":
        return "bg-red-50 border-red-200";
      case "info":
        return "bg-blue-50 border-blue-200";
    }
  };

  const getTextColor = () => {
    switch (statusInfo.type) {
      case "success":
        return "text-green-800";
      case "warning":
        return "text-yellow-800";
      case "error":
        return "text-red-800";
      case "info":
        return "text-blue-800";
    }
  };

  const getIconColor = () => {
    switch (statusInfo.type) {
      case "success":
        return "text-green-600";
      case "warning":
        return "text-yellow-600";
      case "error":
        return "text-red-600";
      case "info":
        return "text-blue-600";
    }
  };

  return (
    <div
      className={`${getBgColor()} ${getTextColor()} border-b px-4 py-3 flex items-center justify-between gap-4`}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className={`${getIconColor()} flex-shrink-0`}>{getIcon()}</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">{statusInfo.message}</p>
          {trialDays !== null && trialDays <= 3 && (
            <p className="text-xs mt-1 opacity-90">
              {trialDays === 0
                ? "Trial ends today"
                : `${trialDays} day${trialDays !== 1 ? "s" : ""} remaining`}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {statusInfo.actionRequired && (
          <Button
            onClick={handleAction}
            size="sm"
            variant={statusInfo.type === "error" ? "default" : "outline"}
            className={`${
              statusInfo.type === "error"
                ? "bg-red-600 hover:bg-red-700 text-white"
                : ""
            }`}
          >
            {subscription.status === "past_due" || subscription.status === "canceled"
              ? "Update Payment"
              : "Manage Billing"}
          </Button>
        )}
        <button
          onClick={handleDismiss}
          className={`${getIconColor()} hover:opacity-70 transition-opacity p-1`}
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

