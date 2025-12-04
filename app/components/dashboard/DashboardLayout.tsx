"use client";

import { useState, useEffect, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Settings as GearIcon,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { NotificationDropdown } from "@/components/dashboard/NotificationDropdown";
import { SearchDropdown } from "@/components/dashboard/SearchDropdown";
import { SubscriptionBanner } from "@/components/dashboard/SubscriptionBanner";

// Custom SVG Icons for Dashboard Navigation
const IconDashboard = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="3" width="7" height="9" rx="1" />
    <rect x="14" y="3" width="7" height="5" rx="1" />
    <rect x="14" y="12" width="7" height="9" rx="1" />
    <rect x="3" y="16" width="7" height="5" rx="1" />
  </svg>
);

const IconSparkles = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
    <path d="M5 19l1 3 1-3 3-1-3-1-1-3-1 3-3 1 3 1z" />
    <path d="M19 13l.5 1.5 1.5.5-1.5.5-.5 1.5-.5-1.5-1.5-.5 1.5-.5.5-1.5z" />
  </svg>
);

const IconCalendar = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="18" height="18" x="3" y="4" rx="2" />
    <path d="M3 10h18" />
    <path d="M8 2v4" />
    <path d="M16 2v4" />
    <path d="M8 14h.01" />
    <path d="M12 14h.01" />
    <path d="M16 14h.01" />
    <path d="M8 18h.01" />
    <path d="M12 18h.01" />
  </svg>
);

const IconAnalytics = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 3v18h18" />
    <path d="M7 16l4-4 4 4 6-6" />
    <path d="M17 10h4v4" />
  </svg>
);

const IconSettings = ({ className = "h-5 w-5" }: { className?: string }) => (
  <GearIcon className={className} />
);

const IconBilling = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="14" x="2" y="5" rx="2" />
    <path d="M2 10h20" />
  </svg>
);

const IconAccount = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="8" r="4" />
    <path d="M20 21a8 8 0 0 0-16 0" />
  </svg>
);

const NAVIGATION_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: IconDashboard, path: "/dashboard" },
  { id: "generate", label: "Content Generation", icon: IconSparkles, path: "/dashboard/generate" },
  { id: "scheduler", label: "Scheduler", icon: IconCalendar, path: "/dashboard/scheduler" },
  { id: "analytics", label: "Analytics", icon: IconAnalytics, path: "/dashboard/analytics" },
  { id: "billing", label: "Billing", icon: IconBilling, path: "/dashboard/billing" },
  { id: "account", label: "Account", icon: IconAccount, path: "/dashboard/account" },
  { id: "settings", label: "Settings", icon: IconSettings, path: "/dashboard/settings" },
];

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const router = useRouter();
  const { user, logoutMutation } = useAuth();

  // Check if user has completed onboarding and fetch subscription
  useEffect(() => {
    async function checkOnboarding() {
      if (!user) return;

      try {
        const { supabase } = await import("@/lib/supabaseClient");
        const { data: userData } = await supabase
          .from("users")
          .select("onboarding_completed, avatar_url")
          .eq("id", user.id)
          .single();

        const userRecord = userData as { onboarding_completed: boolean; avatar_url: string | null } | null;
        if (userRecord && !userRecord.onboarding_completed) {
          router.push("/onboarding");
        }

        if (userRecord && userRecord.avatar_url) {
          setAvatarUrl(userRecord.avatar_url);
        }

        // Fetch subscription
        const { data: subData, error: subError } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (!subError && subData) {
          setSubscription(subData);
        }
      } catch (error) {
        console.error("Error checking onboarding status:", error);
      }
    }

    checkOnboarding();
  }, [user, router]);

  // Persist sidebar collapsed state in localStorage
  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved !== null) {
      setSidebarCollapsed(saved === "true");
    }
  }, []);

  const toggleCollapse = () => {
    const newState = !sidebarCollapsed;
    setSidebarCollapsed(newState);
    localStorage.setItem("sidebar-collapsed", String(newState));
  };

  const initials =
    user?.username
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "PV";

  const sidebarWidth = sidebarCollapsed ? "w-[72px]" : "w-[260px]";
  const mainPadding = sidebarCollapsed ? "lg:pl-[72px]" : "lg:pl-[260px]";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDF8FF] via-[#F8F4FF] to-[#FFF5F8]">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 ${sidebarWidth} bg-white/95 backdrop-blur-sm border-r border-gray-100 transform transition-all duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full relative">
          {/* Logo + Collapse Button */}
          <div className="relative flex items-center justify-between h-16 px-4 border-b border-gray-100">
            <Link href="/dashboard" className={`flex items-center gap-2 group ${sidebarCollapsed ? "mx-auto" : ""}`}>
              <div className="flex-shrink-0">
                <Image 
                  src="/favicon.png" 
                  alt="PostVolve Logo" 
                  width={32} 
                  height={32} 
                  className="transition-transform duration-300 group-hover:scale-110"
                  style={{ width: '32px', height: '32px' }}
                />
              </div>
              {!sidebarCollapsed && (
                <span className="font-heading text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary/80">
                  Post<span className="text-primary">Volve</span>
              </span>
              )}
            </Link>
            
            {/* Desktop collapse toggle - positioned on the right when expanded */}
            {!sidebarCollapsed && (
              <button
                onClick={toggleCollapse}
                className="hidden lg:flex p-1.5 rounded-lg hover:bg-gray-100 transition-all duration-200 text-gray-400 hover:text-gray-600 flex-shrink-0"
                title="Collapse sidebar"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            )}
            
            {/* Mobile close button */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Expand button when collapsed - on the right edge (dividing line) */}
          {sidebarCollapsed && (
            <button
              onClick={toggleCollapse}
              className="hidden lg:flex absolute -right-3 top-6 z-50 p-1.5 rounded-full bg-white border border-gray-200 hover:bg-gray-50 transition-all duration-200 text-gray-400 hover:text-gray-600 shadow-md hover:shadow-lg"
              title="Expand sidebar"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          )}

          {/* Navigation */}
          <nav className={`flex-1 ${sidebarCollapsed ? "px-2" : "px-3"} py-4 space-y-1 overflow-y-auto`}>
            {NAVIGATION_ITEMS.map((item) => {
              const isActive = pathname === item.path || 
                (item.path !== "/dashboard" && pathname.startsWith(item.path));
              const IconComponent = item.icon;
              
              return (
                <Link key={item.id} href={item.path}>
                  <div
                    className={`flex items-center ${sidebarCollapsed ? "justify-center" : ""} gap-3 px-3 py-3 rounded-xl transition-all duration-200 cursor-pointer group ${
                      isActive
                        ? "bg-[#6D28D9]/10 text-[#6D28D9]"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                    title={sidebarCollapsed ? item.label : undefined}
                  >
                    <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                      <IconComponent className={`h-5 w-5 transition-colors duration-200 ${isActive ? "text-[#6D28D9]" : "text-gray-400 group-hover:text-gray-600"}`} />
                    </div>
                    {!sidebarCollapsed && (
                      <span className={`text-sm transition-colors duration-200 ${isActive ? "font-medium" : ""}`}>{item.label}</span>
                    )}
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Current Plan Indicator */}
          <div className={`${sidebarCollapsed ? "px-2" : "px-3"} py-3`}>
            <Link href="/dashboard/billing">
              {!sidebarCollapsed ? (
                <div className="p-3 bg-gradient-to-r from-[#6D28D9]/10 to-[#6D28D9]/5 rounded-xl border border-[#6D28D9]/20 hover:border-[#6D28D9]/40 transition-all duration-200 cursor-pointer group">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-[#6D28D9]">Plus</span>
                    <span className="text-[10px] text-[#6D28D9]/70 bg-[#6D28D9]/10 px-1.5 py-0.5 rounded-full">PLUS</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="h-1.5 bg-[#6D28D9]/20 rounded-full overflow-hidden">
                        <div className="h-full w-1/2 bg-[#6D28D9] rounded-full transition-all duration-300"></div>
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-500 ml-2">45/90</span>
              </div>
                  <p className="text-[10px] text-gray-500 mt-1.5 group-hover:text-[#6D28D9] transition-colors">
                    Manage subscription →
                  </p>
                </div>
              ) : (
                <div 
                  className="flex justify-center p-2.5 rounded-xl bg-gradient-to-r from-[#6D28D9]/10 to-[#6D28D9]/5 border border-[#6D28D9]/20 hover:border-[#6D28D9]/40 transition-all duration-200 cursor-pointer"
                  title="Plus Plan - 45/90 posts"
                >
                  <span className="text-[10px] font-bold text-[#6D28D9]">PRO</span>
                </div>
              )}
            </Link>
          </div>

          {/* Bottom Links */}
          <div className={`${sidebarCollapsed ? "px-2" : "px-3"} py-4 border-t border-gray-100 space-y-1`}>
            {!sidebarCollapsed ? (
              <>
                <div 
                  onClick={() => {
                    logoutMutation.mutate(undefined, {
                      onSuccess: () => router.push("/signin"),
                    });
                  }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 hover:bg-gray-50 transition-all duration-200 cursor-pointer"
                >
                  <LogOut className="h-5 w-5 text-gray-400" />
                  <span className="text-sm">Logout</span>
                </div>
                <Link href="/dashboard/help">
                  <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 hover:bg-gray-50 transition-all duration-200 cursor-pointer">
                    <HelpCircle className="h-5 w-5 text-gray-400" />
                    <span className="text-sm">Help & Support</span>
                  </div>
                </Link>
              </>
            ) : (
              <>
                <div 
                  onClick={() => {
                    logoutMutation.mutate(undefined, {
                      onSuccess: () => router.push("/signin"),
                    });
                  }}
                  className="flex justify-center p-2.5 rounded-xl text-gray-600 hover:bg-gray-50 transition-all duration-200 cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5 text-gray-400" />
              </div>
                <Link href="/dashboard/help">
                  <div 
                    className="flex justify-center p-2.5 rounded-xl text-gray-600 hover:bg-gray-50 transition-all duration-200 cursor-pointer"
                    title="Help & Support"
                  >
                    <HelpCircle className="h-5 w-5 text-gray-400" />
            </div>
                </Link>
              </>
            )}
          </div>
        </div>
      </aside>

      {/* Sidebar Overlay - Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className={`${mainPadding} transition-all duration-300`}>
        {/* Header */}
        <header className="sticky top-0 z-20 h-16 bg-white/70 backdrop-blur-md border-b border-gray-100">
          <div className="flex items-center justify-between h-full px-4 lg:px-8">
            {/* Left: Mobile menu + Page title */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Menu className="h-5 w-5 text-gray-600" />
              </button>
                <h1 className="text-lg font-semibold text-gray-900">
                  {NAVIGATION_ITEMS.find(item => 
                    pathname === item.path || 
                    (item.path !== "/dashboard" && pathname.startsWith(item.path))
                  )?.label || "Dashboard"}
                </h1>
              </div>

            {/* Center: Search Bar */}
            <div className="hidden md:flex flex-1 max-w-xl mx-8">
              <SearchDropdown className="w-full" />
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
              <NotificationDropdown />
              <div
                className="w-10 h-10 rounded-full overflow-hidden cursor-pointer ring-2 ring-gray-100 hover:ring-[#6D28D9]/30 transition-all duration-200"
                onClick={() => router.push("/dashboard/account")}
              >
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt={user?.username || "Profile photo"}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#6D28D9] to-[#4C1D95] flex items-center justify-center text-white font-semibold text-sm">
                    {initials}
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Subscription Status Banner */}
        <SubscriptionBanner subscription={subscription} />

        {/* Page Content */}
        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
