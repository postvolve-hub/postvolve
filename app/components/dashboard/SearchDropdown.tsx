"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, 
  FileText, 
  Calendar, 
  BarChart3, 
  Settings, 
  CreditCard,
  User,
  Zap,
  HelpCircle,
  ArrowRight,
  Command
} from "lucide-react";

type SearchResultType = "post" | "page" | "action" | "setting";

interface SearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
  shortcut?: string;
}

interface SearchDropdownProps {
  className?: string;
}

export function SearchDropdown({ className = "" }: SearchDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Generate search results based on query
  const getSearchResults = useCallback((): SearchResult[] => {
    const results: SearchResult[] = [];
    const lowercaseQuery = query.toLowerCase();

    // Pages
    const pages: SearchResult[] = [
      {
        id: "dashboard",
        type: "page",
        title: "Dashboard",
        description: "Go to main dashboard",
        icon: <BarChart3 className="h-4 w-4" />,
        action: () => router.push("/dashboard"),
        shortcut: "G D",
      },
      {
        id: "generate",
        type: "page",
        title: "Content Generation",
        description: "Generate new content",
        icon: <Zap className="h-4 w-4" />,
        action: () => router.push("/dashboard/generate"),
        shortcut: "G G",
      },
      {
        id: "scheduler",
        type: "page",
        title: "Scheduler",
        description: "View and manage schedule",
        icon: <Calendar className="h-4 w-4" />,
        action: () => router.push("/dashboard/scheduler"),
        shortcut: "G S",
      },
      {
        id: "analytics",
        type: "page",
        title: "Analytics",
        description: "View performance metrics",
        icon: <BarChart3 className="h-4 w-4" />,
        action: () => router.push("/dashboard/analytics"),
        shortcut: "G A",
      },
      {
        id: "settings",
        type: "page",
        title: "Settings",
        description: "Account and app settings",
        icon: <Settings className="h-4 w-4" />,
        action: () => router.push("/dashboard/settings"),
        shortcut: "G ,",
      },
      {
        id: "billing",
        type: "page",
        title: "Billing",
        description: "Manage subscription",
        icon: <CreditCard className="h-4 w-4" />,
        action: () => router.push("/dashboard/billing"),
      },
      {
        id: "account",
        type: "page",
        title: "Account",
        description: "Profile settings",
        icon: <User className="h-4 w-4" />,
        action: () => router.push("/dashboard/account"),
      },
    ];

    // Actions
    const actions: SearchResult[] = [
      {
        id: "new-post",
        type: "action",
        title: "Generate New Content",
        description: "Create AI-generated content",
        icon: <Zap className="h-4 w-4 text-[#6D28D9]" />,
        action: () => router.push("/dashboard/generate"),
      },
      {
        id: "schedule-post",
        type: "action",
        title: "Schedule a Post",
        description: "Pick a draft and schedule it",
        icon: <Calendar className="h-4 w-4 text-[#6D28D9]" />,
        action: () => router.push("/dashboard/scheduler"),
      },
    ];

    // Mock posts (in real app, these would come from API)
    const posts: SearchResult[] = [
      {
        id: "post-1",
        type: "post",
        title: "The Rise of AI Agents",
        description: "Draft • AI Category",
        icon: <FileText className="h-4 w-4" />,
        action: () => router.push("/dashboard/generate"),
      },
      {
        id: "post-2",
        type: "post",
        title: "5 Cloud Technologies",
        description: "Scheduled • Tech Category",
        icon: <FileText className="h-4 w-4" />,
        action: () => router.push("/dashboard/scheduler"),
      },
    ];

    // Settings
    const settings: SearchResult[] = [
      {
        id: "connect-accounts",
        type: "setting",
        title: "Connect Social Accounts",
        description: "Link your social media profiles",
        icon: <Settings className="h-4 w-4" />,
        action: () => router.push("/dashboard/settings"),
      },
      {
        id: "auto-posting",
        type: "setting",
        title: "Auto-Posting Settings",
        description: "Configure automatic posting",
        icon: <Settings className="h-4 w-4" />,
        action: () => router.push("/dashboard/settings"),
      },
    ];

    // Help
    const help: SearchResult[] = [
      {
        id: "help",
        type: "page",
        title: "Help & Support",
        description: "Get help and documentation",
        icon: <HelpCircle className="h-4 w-4" />,
        action: () => router.push("/dashboard/help"),
      },
    ];

    // Filter and combine results
    const allResults = [...actions, ...pages, ...posts, ...settings, ...help];
    
    if (!query) {
      // Show quick actions and pages when no query
      return [...actions, ...pages.slice(0, 4)];
    }

    return allResults.filter(
      (result) =>
        result.title.toLowerCase().includes(lowercaseQuery) ||
        result.description.toLowerCase().includes(lowercaseQuery)
    );
  }, [query, router]);

  const results = getSearchResults();

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Open with Cmd/Ctrl + K
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
      
      // Close with Escape
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Handle navigation keys
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!isOpen) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
      }

      if (e.key === "Enter" && results[selectedIndex]) {
        e.preventDefault();
        results[selectedIndex].action();
        setIsOpen(false);
        setQuery("");
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, results, selectedIndex]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleResultClick = (result: SearchResult) => {
    result.action();
    setIsOpen(false);
    setQuery("");
  };

  const TYPE_LABELS: Record<SearchResultType, string> = {
    post: "Posts",
    page: "Pages",
    action: "Quick Actions",
    setting: "Settings",
  };

  // Group results by type
  const groupedResults = results.reduce<Record<SearchResultType, SearchResult[]>>((acc, result) => {
    if (!acc[result.type]) {
      acc[result.type] = [];
    }
    acc[result.type].push(result);
    return acc;
  }, {} as Record<SearchResultType, SearchResult[]>);

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Search Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors min-w-[200px]"
      >
        <Search className="h-4 w-4" />
        <span className="flex-1 text-left">Search...</span>
        <kbd className="hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium bg-white border border-gray-200 rounded">
          <Command className="h-3 w-3" />K
        </kbd>
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-150" />
          <div className="fixed inset-x-0 top-[10%] z-50 flex justify-center px-4">
            <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-top-2 duration-200">
              {/* Search Input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
                <Search className="h-5 w-5 text-gray-400" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search pages, posts, settings..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-sm placeholder:text-gray-400"
                />
                <kbd className="px-2 py-1 text-[10px] font-medium text-gray-400 bg-gray-100 rounded">
                  ESC
                </kbd>
              </div>

              {/* Results */}
              <div className="max-h-96 overflow-y-auto p-2">
                {results.length === 0 ? (
                  <div className="py-8 text-center">
                    <Search className="h-10 w-10 text-gray-200 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">No results found</p>
                    <p className="text-xs text-gray-400 mt-1">Try a different search term</p>
                  </div>
                ) : (
                  Object.entries(groupedResults).map(([type, items]) => (
                    <div key={type} className="mb-2">
                      <p className="px-2 py-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                        {TYPE_LABELS[type as SearchResultType]}
                      </p>
                      {items.map((result, index) => {
                        const globalIndex = results.indexOf(result);
                        const isSelected = globalIndex === selectedIndex;
                        return (
                          <button
                            key={result.id}
                            onClick={() => handleResultClick(result)}
                            onMouseEnter={() => setSelectedIndex(globalIndex)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
                              isSelected
                                ? "bg-[#6D28D9]/10 text-[#6D28D9]"
                                : "hover:bg-gray-50 text-gray-700"
                            }`}
                          >
                            <div className={`p-2 rounded-lg ${isSelected ? "bg-[#6D28D9]/20" : "bg-gray-100"}`}>
                              {result.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{result.title}</p>
                              <p className="text-xs text-gray-500 truncate">{result.description}</p>
                            </div>
                            {result.shortcut && (
                              <kbd className="hidden sm:block px-2 py-1 text-[10px] font-medium text-gray-400 bg-gray-100 rounded">
                                {result.shortcut}
                              </kbd>
                            )}
                            {isSelected && (
                              <ArrowRight className="h-4 w-4 text-[#6D28D9]" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-4 py-2 border-t border-gray-100 bg-gray-50">
                <div className="flex items-center gap-4 text-[10px] text-gray-400">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1 py-0.5 bg-white border border-gray-200 rounded">↑</kbd>
                    <kbd className="px-1 py-0.5 bg-white border border-gray-200 rounded">↓</kbd>
                    to navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1 py-0.5 bg-white border border-gray-200 rounded">↵</kbd>
                    to select
                  </span>
                </div>
                <p className="text-[10px] text-gray-400">
                  Powered by PostVolve
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

