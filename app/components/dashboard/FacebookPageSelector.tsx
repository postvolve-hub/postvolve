"use client";

import { useState, useEffect } from "react";
import { X, ExternalLink, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface FacebookPage {
  id: string;
  name: string;
  access_token: string;
}

interface FacebookPageSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  pages: FacebookPage[];
  onPageSelected: (pageId: string) => void;
}

export function FacebookPageSelector({
  isOpen,
  onClose,
  userId,
  pages,
  onPageSelected,
}: FacebookPageSelectorProps) {
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (pages.length === 1) {
      // Auto-select if only one page
      setSelectedPageId(pages[0].id);
    }
  }, [pages]);

  const handleSave = async () => {
    if (!selectedPageId) {
      toast({
        title: "No Page Selected",
        description: "Please select a Facebook Page to use for posting.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch("/api/facebook/select-page", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          pageId: selectedPageId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to save page selection");
      }

      toast({
        title: "Page Selected",
        description: "Your Facebook Page has been set up for posting.",
      });

      onPageSelected(selectedPageId);
      onClose();
    } catch (error: any) {
      console.error("Error saving page selection:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save page selection. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  // Scenario 1: No pages found
  if (pages.length === 0) {
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
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Facebook Page Required
                </h3>
                <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100">
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 rounded-xl bg-amber-100">
                  <AlertCircle className="h-6 w-6 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-base font-semibold text-gray-900 mb-2">
                    No Facebook Pages Found
                  </h4>
                  <p className="text-sm text-gray-600 mb-4">
                    To post content to Facebook, you need to create a Facebook Page first. 
                    Your personal profile cannot be used for posting.
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
                    <p className="text-sm font-medium text-blue-900 mb-2">
                      How to create a Facebook Page:
                    </p>
                    <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
                      <li>Go to{" "}
                        <a
                          href="https://www.facebook.com/pages/create"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline font-medium"
                        >
                          facebook.com/pages/create
                        </a>
                      </li>
                      <li>Choose a page type (Business, Brand, Community, etc.)</li>
                      <li>Fill in your page details and create the page</li>
                      <li>Come back here and reconnect your Facebook account</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-100">
              <Button variant="outline" onClick={onClose} className="rounded-xl">
                I'll Create a Page
              </Button>
              <Button
                onClick={() => {
                  window.open("https://www.facebook.com/pages/create", "_blank");
                }}
                className="rounded-xl bg-[#1877F2] hover:bg-[#166FE5] text-white"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Create Page Now
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Scenario 2: Multiple pages - show selection
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
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Select Facebook Page
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Choose which page to use for posting
                </p>
              </div>
              <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-2 mb-4">
              {pages.map((page) => (
                <button
                  key={page.id}
                  onClick={() => setSelectedPageId(page.id)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                    selectedPageId === page.id
                      ? "border-[#1877F2] bg-[#1877F2]/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{page.name}</p>
                      <p className="text-xs text-gray-500 mt-1">Page ID: {page.id}</p>
                    </div>
                    {selectedPageId === page.id && (
                      <div className="w-5 h-5 rounded-full bg-[#1877F2] flex items-center justify-center">
                        <CheckCircle className="h-3.5 w-3.5 text-white" />
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
              <p className="text-xs text-blue-800">
                <strong>Note:</strong> You can change the selected page later from Settings.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-100">
            <Button variant="outline" onClick={onClose} className="rounded-xl">
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!selectedPageId || isSaving}
              className="rounded-xl bg-[#1877F2] hover:bg-[#166FE5] text-white"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Selection"
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}







