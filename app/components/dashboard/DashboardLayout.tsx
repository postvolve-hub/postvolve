"use client";

import { useState, useEffect, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { 
  Menu, 
  X,
  Bell,
  Search,
  HelpCircle,
  Command,
  ChevronLeft,
  ChevronRight,
  LogOut
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

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
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
  </svg>
);

const NAVIGATION_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: IconDashboard, path: "/dashboard" },
  { id: "generate", label: "Content Generation", icon: IconSparkles, path: "/dashboard/generate" },
  { id: "scheduler", label: "Scheduler", icon: IconCalendar, path: "/dashboard/scheduler" },
  { id: "analytics", label: "Analytics", icon: IconAnalytics, path: "/dashboard/analytics" },
  { id: "settings", label: "Settings", icon: IconSettings, path: "/dashboard/settings" },
];

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const router = useRouter();
  const { user, logoutMutation } = useAuth();

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
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 hover:bg-gray-50 transition-all duration-200 cursor-pointer">
                  <HelpCircle className="h-5 w-5 text-gray-400" />
                  <span className="text-sm">Help & Support</span>
                </div>
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
                <div 
                  className="flex justify-center p-2.5 rounded-xl text-gray-600 hover:bg-gray-50 transition-all duration-200 cursor-pointer"
                  title="Help & Support"
                >
                  <HelpCircle className="h-5 w-5 text-gray-400" />
                </div>
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
              <div className="relative w-full group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 transition-colors group-focus-within:text-[#6D28D9]" />
                <input 
                  type="text"
                  placeholder="Search or type a command"
                  className="w-full h-11 pl-11 pr-16 bg-gray-50/80 border border-gray-200 rounded-2xl text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6D28D9]/20 focus:border-[#6D28D9]/30 transition-all duration-200"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-gray-400 text-xs font-medium bg-white border border-gray-200 px-2 py-1 rounded-lg">
                  <Command className="h-3 w-3" />
                  <span>F</span>
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
              <button className="relative p-2.5 rounded-full hover:bg-gray-100 transition-all duration-200">
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-[#6D28D9] rounded-full ring-2 ring-white"></span>
              </button>
              <div 
                className="w-10 h-10 rounded-full overflow-hidden cursor-pointer ring-2 ring-gray-100 hover:ring-[#6D28D9]/30 transition-all duration-200"
                onClick={() => router.push('/dashboard/settings')}
              >
                <div className="w-full h-full bg-gradient-to-br from-[#6D28D9] to-[#4C1D95] flex items-center justify-center text-white font-semibold text-sm">
                  {initials}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
