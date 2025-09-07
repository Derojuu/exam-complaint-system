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
      color: "text-orange-600 bg-orange-100 dark:bg-orange-900/30",
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="border-0 shadow-lg glass-effect card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</p>
                <p className={`text-sm ${stat.trendColor} font-medium`}>{stat.trend}</p>
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
