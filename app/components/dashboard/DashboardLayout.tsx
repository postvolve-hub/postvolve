"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Sparkles, 
  Calendar, 
  BarChart3, 
  Settings, 
  Menu, 
  X,
  Bell,
  Search,
  HelpCircle,
  CheckSquare,
  Command
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

const NAVIGATION_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { id: "generate", label: "My Drafts", icon: CheckSquare, path: "/dashboard/generate", badge: null },
  { id: "scheduler", label: "Scheduler", icon: Calendar, path: "/dashboard/scheduler" },
  { id: "analytics", label: "Analytics", icon: BarChart3, path: "/dashboard/analytics" },
];

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const { user, logoutMutation } = useAuth();

  const initials =
    user?.username
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "PV";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDF8FF] via-[#F8F4FF] to-[#FFF5F8]">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-[260px] bg-white/90 backdrop-blur-sm border-r border-gray-100 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6">
            <Link href="/dashboard" className="flex items-center gap-2">
              <span className="text-xl font-bold italic tracking-tight text-gray-900">
                Post<span className="text-[#6D28D9]">Volve.</span>
              </span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Menu Label */}
          <div className="px-6 pt-4 pb-2">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Menu</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
            {NAVIGATION_ITEMS.map((item) => {
              const isActive = pathname === item.path || 
                (item.path !== "/dashboard" && pathname.startsWith(item.path));
              
              return (
                <Link key={item.id} href={item.path}>
                  <div
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer group ${
                      isActive
                        ? "bg-[#6D28D9]/8 text-gray-900"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {isActive ? (
                      <div className="w-5 h-5 rounded bg-[#6D28D9] flex items-center justify-center">
                        <CheckSquare className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
                      </div>
                    ) : (
                      <item.icon className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
                    )}
                    <span className={`text-sm ${isActive ? "font-medium" : ""}`}>{item.label}</span>
                    {item.badge && (
                      <span className="ml-auto bg-[#6D28D9] text-white text-xs font-medium px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Upgrade Card */}
          <div className="px-4 py-4">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-5 text-white">
              <h4 className="font-semibold text-base mb-1">Upgrade your plan</h4>
              <p className="text-gray-300 text-xs leading-relaxed mb-4">
                Your trial plan ends in 12 days. Upgrade your plan and unlock full potential!
              </p>
              <div className="w-12 h-1 bg-white/30 rounded-full mb-4">
                <div className="w-4 h-1 bg-white rounded-full"></div>
              </div>
              <Button 
                className="w-full bg-[#6D28D9] hover:bg-[#5B21B6] text-white text-sm font-medium py-2.5 rounded-xl transition-colors"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                See plans
              </Button>
            </div>
          </div>

          {/* Bottom Links */}
          <div className="px-3 py-4 border-t border-gray-100 space-y-1">
            <Link href="/dashboard/settings">
              <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">
                <Settings className="h-5 w-5 text-gray-400" />
                <span className="text-sm">Settings</span>
              </div>
            </Link>
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">
              <HelpCircle className="h-5 w-5 text-gray-400" />
              <span className="text-sm">Help & Support</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="lg:pl-[260px]">
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
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input 
                  type="text"
                  placeholder="Search or type a command"
                  className="w-full h-11 pl-11 pr-16 bg-gray-50/80 border border-gray-200 rounded-2xl text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6D28D9]/20 focus:border-[#6D28D9]/30 transition-all"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-gray-400 text-xs font-medium bg-white border border-gray-200 px-2 py-1 rounded-lg">
                  <Command className="h-3 w-3" />
                  <span>F</span>
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
              <button className="relative p-2.5 rounded-full hover:bg-gray-100 transition-colors">
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-[#6D28D9] rounded-full ring-2 ring-white"></span>
              </button>
              <div 
                className="w-10 h-10 rounded-full overflow-hidden cursor-pointer ring-2 ring-gray-100 hover:ring-[#6D28D9]/30 transition-all"
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
