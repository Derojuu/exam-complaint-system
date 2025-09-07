"use client"

import { motion } from "framer-motion"
import { Settings, Menu, LogOut, User, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"

interface AdminSettingsHeaderProps {
  user: any
  onLogout: () => void
  adminSidebarRef: any
}

export function AdminSettingsHeader({ user, onLogout, adminSidebarRef }: AdminSettingsHeaderProps) {
  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
      <div className="flex items-center gap-2 sm:gap-4">
        <Button
          variant="ghost"
          size="sm"
          className="lg:hidden p-1 sm:p-2"
          onClick={() => adminSidebarRef.current?.toggle()}
        >
          <Menu className="w-5 h-5" />
        </Button>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 sm:gap-3"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 rounded-xl flex items-center justify-center">
            <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 dark:text-purple-300" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
              Admin Settings
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 hidden sm:block">
              Configure system-wide settings and preferences
            </p>
          </div>
        </motion.div>
      </div>
      
      <div className="flex items-center gap-2 sm:gap-4">
        <ThemeToggle />
        <div className="hidden sm:flex items-center gap-2 sm:gap-4">
          <Link
            href="/admin/dashboard"
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors flex items-center gap-1 sm:gap-2"
          >
            <BarChart3 className="w-4 h-4" />
            <span className="hidden lg:inline">Dashboard</span>
          </Link>
          <Link
            href="/admin/profile"
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors flex items-center gap-1 sm:gap-2"
          >
            <User className="w-4 h-4" />
            <span className="hidden lg:inline">Profile</span>
          </Link>
        </div>
        <Button
          onClick={onLogout}
          variant="outline"
          size="sm"
          className="border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 h-8 sm:h-9 px-2 sm:px-3"
        >
          <LogOut className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    </header>
  )
}
