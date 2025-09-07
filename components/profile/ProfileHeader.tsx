"use client"

import { motion } from "framer-motion"
import { User, Shield, Settings } from "lucide-react"

interface ProfileHeaderProps {
  isAdmin: boolean
  userName: string
}

export function ProfileHeader({ isAdmin, userName }: ProfileHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center mb-6 sm:mb-8"
    >
      <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2 sm:mb-4">
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 rounded-xl flex items-center justify-center">
          {isAdmin ? (
            <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 dark:text-purple-300" />
          ) : (
            <User className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 dark:text-purple-300" />
          )}
        </div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
          {isAdmin ? "Admin Profile" : "My Profile"}
        </h1>
      </div>
      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-4">
        {isAdmin
          ? `Welcome back, ${userName}. Manage your administrative account, monitor system performance, and configure platform settings.`
          : `Welcome back, ${userName}. Manage your personal information, track your complaints, and update your preferences.`}
      </p>
    </motion.div>
  )
}
