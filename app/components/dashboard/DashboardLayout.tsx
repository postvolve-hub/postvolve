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
  LogOut,
  Bell,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

const NAVIGATION_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { id: "generate", label: "Content Generation", icon: Sparkles, path: "/dashboard/generate" },
  { id: "scheduler", label: "Scheduler", icon: Calendar, path: "/dashboard/scheduler" },
  { id: "analytics", label: "Analytics", icon: BarChart3, path: "/dashboard/analytics" },
  { id: "settings", label: "Settings", icon: Settings, path: "/dashboard/settings" },
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
    <div className="min-h-screen bg-[#F7F9FB]">
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-[280px] bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <Link href="/dashboard" className="flex items-center gap-2">
              <span className="font-heading text-xl font-bold tracking-tight">
                Post<span className="text-[#6D28D9]">Volve</span>
              </span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {NAVIGATION_ITEMS.map((item) => {
              const isActive = pathname === item.path || 
                (item.path !== "/dashboard" && pathname.startsWith(item.path));
              
              return (
                <Link key={item.id} href={item.path}>
                  <div
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 cursor-pointer ${
                      isActive
                        ? "bg-[#6D28D9]/10 text-[#6D28D9] font-medium"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <item.icon className={`h-5 w-5 ${isActive ? "text-[#6D28D9]" : "text-gray-500"}`} />
                    <span>{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-[#6D28D9]/10 to-[#6D28D9]/5">
              <div className="w-10 h-10 rounded-full bg-[#6D28D9] flex items-center justify-center text-white font-semibold">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.username || user?.email || "PostVolve User"}
                </p>
                <p className="text-xs text-gray-500 truncate">Pro Plan</p>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="lg:pl-[280px]">
        <header className="sticky top-0 z-20 h-16 bg-white/80 backdrop-blur-md border-b border-gray-200">
          <div className="flex items-center justify-between h-full px-4 lg:px-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
              >
                <Menu className="h-5 w-5 text-gray-600" />
              </button>
              <div className="hidden sm:block">
                <h1 className="text-lg font-semibold text-gray-900">
                  {NAVIGATION_ITEMS.find(item => 
                    pathname === item.path || 
                    (item.path !== "/dashboard" && pathname.startsWith(item.path))
                  )?.label || "Dashboard"}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#6D28D9] rounded-full"></span>
              </button>
              <Button
                variant="ghost"
                size="sm"
                className="hidden sm:flex items-center gap-2 text-gray-600 hover:text-gray-900"
                onClick={() => {
                  logoutMutation.mutate(undefined, {
                    onSuccess: () => {
                      router.push("/signin");
                    },
                  });
                }}
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

