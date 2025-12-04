"use client";

import { AlertCircle, CreditCard, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface PaymentUpdatePromptProps {
  message: string;
  gracePeriodDays?: number;
  onDismiss?: () => void;
}

export function PaymentUpdatePrompt({
  message,
  gracePeriodDays,
  onDismiss,
}: PaymentUpdatePromptProps) {
  const router = useRouter();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    if (onDismiss) onDismiss();
  };

  const handleUpdatePayment = () => {
    router.push("/dashboard/billing");
  };

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-red-900 mb-1">Payment Required</h4>
          <p className="text-sm text-red-800 mb-3">{message}</p>
          {gracePeriodDays !== undefined && gracePeriodDays > 0 && (
            <p className="text-xs text-red-700 mb-3">
              <strong>{gracePeriodDays} day{gracePeriodDays !== 1 ? "s" : ""}</strong> remaining in
              grace period.
            </p>
          )}
          <Button
            onClick={handleUpdatePayment}
            size="sm"
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Update Payment Method
          </Button>
        </div>
        <button
          onClick={handleDismiss}
          className="text-red-600 hover:text-red-800 transition-colors p-1 flex-shrink-0"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

