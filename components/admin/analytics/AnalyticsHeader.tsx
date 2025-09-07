import { Button } from "@/components/ui/button";
import { Menu, FileText, User, LogOut } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import { AdminSidebarRef } from "@/components/admin-sidebar";
import React from "react";

interface AnalyticsHeaderProps {
  adminSidebarRef: React.RefObject<AdminSidebarRef | null>;
  handleLogout: () => void;
}

export default function AnalyticsHeader({ adminSidebarRef, handleLogout }: AnalyticsHeaderProps) {
  return (
    <header className="glass-effect border-b border-white/20 dark:border-gray-700/20 sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
          <Button
            variant="ghost"
            size="sm"
            className="p-2 hover:bg-purple-100 dark:hover:bg-purple-900/20"
            onClick={() => adminSidebarRef.current?.toggleSidebar()}
          >
            <Menu className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </Button>
          <div className="min-w-0 flex-1">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gradient truncate">Analytics Dashboard</h1>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 hidden sm:block">
              Advanced insights and reporting
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          <ThemeToggle />
          <Link href="/admin/dashboard">
            <Button variant="outline" className="text-xs sm:text-sm h-8 sm:h-10 px-2 sm:px-4">
              <FileText className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Dashboard</span>
            </Button>
          </Link>
          <Link href="/admin/profile">
            <Button className="btn-gradient shadow-lg text-xs sm:text-sm h-8 sm:h-10 px-2 sm:px-4">
              <User className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Profile</span>
            </Button>
          </Link>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20 text-xs sm:text-sm h-8 sm:h-10 px-2 sm:px-4"
          >
            <LogOut className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
