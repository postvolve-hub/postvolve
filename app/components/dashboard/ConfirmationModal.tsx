"use client";

import { ReactNode } from "react";
import { X, AlertTriangle, CheckCircle, Info, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type ConfirmationVariant = "danger" | "warning" | "info" | "success";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string | ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmationVariant;
  isLoading?: boolean;
  icon?: ReactNode;
}

const VARIANT_STYLES: Record<ConfirmationVariant, { bg: string; iconBg: string; iconColor: string; buttonClass: string }> = {
  danger: {
    bg: "bg-red-50",
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    buttonClass: "bg-red-600 hover:bg-red-700 text-white",
  },
  warning: {
    bg: "bg-amber-50",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    buttonClass: "bg-amber-600 hover:bg-amber-700 text-white",
  },
  info: {
    bg: "bg-blue-50",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    buttonClass: "bg-blue-600 hover:bg-blue-700 text-white",
  },
  success: {
    bg: "bg-emerald-50",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    buttonClass: "bg-emerald-600 hover:bg-emerald-700 text-white",
  },
};

const VARIANT_ICONS: Record<ConfirmationVariant, ReactNode> = {
  danger: <AlertTriangle className="h-6 w-6" />,
  warning: <AlertTriangle className="h-6 w-6" />,
  info: <Info className="h-6 w-6" />,
  success: <CheckCircle className="h-6 w-6" />,
};

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  isLoading = false,
  icon,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  const styles = VARIANT_STYLES[variant];
  const defaultIcon = VARIANT_ICONS[variant];

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-50 transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className={`p-6 ${styles.bg}`}>
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl ${styles.iconBg} ${styles.iconColor}`}>
                {icon || defaultIcon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                <div className="text-sm text-gray-600 mt-1">{description}</div>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-white/50 transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-100">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="rounded-xl"
            >
              {cancelText}
            </Button>
            <Button
              onClick={onConfirm}
              disabled={isLoading}
              className={`rounded-xl ${styles.buttonClass}`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                confirmText
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

