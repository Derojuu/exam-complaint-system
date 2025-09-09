import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Users, CheckCircle2, Clock, TrendingUp, Activity, AlertTriangle } from "lucide-react"

interface AdminStatsProps {
  adminStats: {
    totalStudents: number
    totalComplaints: number
    pendingReview: number
    resolvedThisMonth: number
    avgResolutionTime: string
    activeAdmins: number
    systemUptime: string
    lastLogin: string
    recentActivity: number
  }
}

export function AdminStatsCards({ adminStats }: AdminStatsProps) {
  const stats = [
    {
      title: "Total Students",
      value: adminStats.totalStudents.toLocaleString(),
      icon: Users,
      color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30",
      trend: "+12%",
      trendColor: "text-green-600"
    },
    {
      title: "Total Complaints",
      value: adminStats.totalComplaints.toLocaleString(),
      icon: BarChart3,
      color: "text-purple-600 bg-purple-100 dark:bg-purple-900/30",
      trend: "+8%",
      trendColor: "text-green-600"
    },
    {
      title: "Pending Review",
      value: adminStats.pendingReview.toLocaleString(),
      icon: Clock,
      color: "text-purple-600 bg-purple-100 dark:bg-purple-900/30",
      trend: "-5%",
      trendColor: "text-green-600"
    },
    {
      title: "Resolved This Month",
      value: adminStats.resolvedThisMonth.toLocaleString(),
      icon: CheckCircle2,
      color: "text-green-600 bg-green-100 dark:bg-green-900/30",
      trend: "+15%",
      trendColor: "text-green-600"
    },
    {
      title: "Avg Resolution Time",
      value: adminStats.avgResolutionTime,
      icon: TrendingUp,
      color: "text-indigo-600 bg-indigo-100 dark:bg-indigo-900/30",
      trend: "-2 days",
      trendColor: "text-green-600"
    },
    {
      title: "Active Admins",
      value: adminStats.activeAdmins.toLocaleString(),
      icon: Activity,
      color: "text-cyan-600 bg-cyan-100 dark:bg-cyan-900/30",
      trend: "Online",
      trendColor: "text-green-600"
    },
    {
      title: "System Uptime",
      value: adminStats.systemUptime,
      icon: AlertTriangle,
      color: "text-green-600 bg-green-100 dark:bg-green-900/30",
      trend: "Excellent",
      trendColor: "text-green-600"
    },
    {
      title: "Recent Activity",
      value: `${adminStats.recentActivity} actions`,
      icon: Activity,
      color: "text-gray-600 bg-gray-100 dark:bg-gray-900/30",
      trend: "Today",
      trendColor: "text-blue-600"
    }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="border-0 shadow-lg glass-effect card-hover">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1 mr-3">
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">{stat.title}</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-gray-100 truncate">{stat.value}</p>
                <p className={`text-xs sm:text-sm ${stat.trendColor} font-medium`}>{stat.trend}</p>
              </div>
              <div className={`w-10 h-10 sm:w-12 sm:h-12 ${stat.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                <stat.icon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
