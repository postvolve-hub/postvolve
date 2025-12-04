"use client";

import { Lock, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface LockOverlayProps {
  message: string;
  actionLabel?: string;
  actionPath?: string;
  showIcon?: boolean;
}

export function LockOverlay({
  message,
  actionLabel = "Update Payment",
  actionPath = "/dashboard/billing",
  showIcon = true,
}: LockOverlayProps) {
  const router = useRouter();

  return (
    <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-50 flex items-center justify-center rounded-lg border border-gray-200">
      <div className="text-center p-8 max-w-md">
        {showIcon && (
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <Lock className="h-8 w-8 text-red-600" />
          </div>
        )}
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Access Restricted</h3>
        <p className="text-sm text-gray-600 mb-6">{message}</p>
        <Button
          onClick={() => router.push(actionPath)}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          <CreditCard className="h-4 w-4 mr-2" />
          {actionLabel}
        </Button>
      </div>
    </div>
  );
}

