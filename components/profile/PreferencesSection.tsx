"use client"

import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { 
  Bell, 
  BarChart3, 
  Users, 
  Mail, 
  CheckCircle2 
} from "lucide-react"

interface PreferencesSectionProps {
  isAdmin: boolean
}

export function PreferencesSection({ isAdmin }: PreferencesSectionProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
          {isAdmin ? "System Preferences" : "Notification Preferences"}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {isAdmin
            ? "Manage system settings and administrative preferences"
            : "Manage how you receive notifications and updates"}
        </p>
      </div>

      <Separator className="bg-gray-200 dark:bg-gray-700" />

      <div className="space-y-4 sm:space-y-6">
        {isAdmin ? (
          <>
            <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/50 dark:to-blue-900/50 rounded-lg flex items-center justify-center">
                  <Bell className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100 text-sm sm:text-base">
                    Admin Notifications
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Receive alerts for new complaints and system updates
                  </p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-700 text-xs">
                Enabled
              </Badge>
            </div>

            <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100 text-sm sm:text-base">
                    Daily Reports
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Receive daily summary reports via email
                  </p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-700 text-xs">
                Enabled
              </Badge>
            </div>

            <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100 text-sm sm:text-base">
                    Student Updates
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Notifications when students submit new complaints
                  </p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-700 text-xs">
                Enabled
              </Badge>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 rounded-lg flex items-center justify-center">
                  <Bell className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100 text-sm sm:text-base">
                    Email Notifications
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Receive updates about your complaints via email
                  </p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-700 text-xs">
                Enabled
              </Badge>
            </div>

            <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 rounded-lg flex items-center justify-center">
                  <Mail className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100 text-sm sm:text-base">
                    SMS Notifications
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Get text messages for urgent updates
                  </p>
                </div>
              </div>
              <Badge
                variant="outline"
                className="border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 text-xs"
              >
                Disabled
              </Badge>
            </div>

            <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100 text-sm sm:text-base">
                    Status Updates
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Notifications when complaint status changes
                  </p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-700 text-xs">
                Enabled
              </Badge>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
