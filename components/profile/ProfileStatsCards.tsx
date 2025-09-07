"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ClipboardList, Users, FileText, BarChart3 } from "lucide-react"

interface ProfileStatsCardsProps {
  isAdmin: boolean
  stats: {
    totalComplaints?: number
    pendingComplaints?: number
    resolvedComplaints?: number
    totalStudents?: number
  }
}

export function ProfileStatsCards({ isAdmin, stats }: ProfileStatsCardsProps) {
  const adminStatsCards = [
    {
      title: "Total Complaints",
      value: stats.totalComplaints || 0,
      icon: ClipboardList,
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800",
      badge: "All Time"
    },
    {
      title: "Active Students",
      value: stats.totalStudents || 0,
      icon: Users,
      color: "from-green-500 to-green-600",
      bgColor: "from-green-100 to-green-200 dark:from-green-900 dark:to-green-800",
      badge: "Registered"
    },
    {
      title: "Pending Review",
      value: stats.pendingComplaints || 0,
      icon: FileText,
      color: "from-yellow-500 to-yellow-600",
      bgColor: "from-yellow-100 to-yellow-200 dark:from-yellow-900 dark:to-yellow-800",
      badge: "Urgent"
    },
    {
      title: "Resolved Cases",
      value: stats.resolvedComplaints || 0,
      icon: BarChart3,
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800",
      badge: "Completed"
    }
  ]

  const studentStatsCards = [
    {
      title: "My Complaints",
      value: stats.totalComplaints || 0,
      icon: ClipboardList,
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800",
      badge: "Total"
    },
    {
      title: "Pending",
      value: stats.pendingComplaints || 0,
      icon: FileText,
      color: "from-yellow-500 to-yellow-600",
      bgColor: "from-yellow-100 to-yellow-200 dark:from-yellow-900 dark:to-yellow-800",
      badge: "In Review"
    },
    {
      title: "Resolved",
      value: stats.resolvedComplaints || 0,
      icon: BarChart3,
      color: "from-green-500 to-green-600",
      bgColor: "from-green-100 to-green-200 dark:from-green-900 dark:to-green-800",
      badge: "Completed"
    }
  ]

  const statsCards = isAdmin ? adminStatsCards : studentStatsCards

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className={`grid gap-4 sm:gap-6 mb-6 sm:mb-8 ${
        isAdmin ? "grid-cols-2 lg:grid-cols-4" : "grid-cols-1 sm:grid-cols-3"
      }`}
    >
      {statsCards.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
        >
          <Card className="glass-effect border-0 shadow-lg hover:shadow-xl transition-all duration-300 dark:bg-gray-800/50">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                    {stat.title}
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {stat.value}
                  </p>
                  <Badge 
                    className={`text-xs bg-gradient-to-r ${stat.color} text-white border-0 px-2 py-1`}
                  >
                    {stat.badge}
                  </Badge>
                </div>
                <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r ${stat.bgColor} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 dark:text-gray-300" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  )
}
