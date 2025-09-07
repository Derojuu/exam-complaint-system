"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import { toast } from "@/hooks/use-toast"
import { motion } from "framer-motion"
import { LoadingOverlay } from "@/components/loading-overlay"
import type { User as UserType } from "@/app/types/index"
import { AdminSidebar, AdminSidebarRef } from "@/components/admin-sidebar"
import { DashboardHeader } from "@/components/admin/dashboard/DashboardHeader"
import { AdminRoleInfoCard } from "@/components/admin/dashboard/AdminRoleInfoCard"
import { StatsCards } from "@/components/admin/dashboard/StatsCards"
import { ComplaintsMobileCards } from "@/components/admin/dashboard/ComplaintsMobileCards"
import { ComplaintsTable } from "@/components/admin/dashboard/ComplaintsTable"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, CheckCircle2, Clock, TrendingUp } from "lucide-react"
import { ComplaintType } from "@/app/types/admin"

export default function AdminDashboard() {
  const router = useRouter()
  const adminSidebarRef = useRef<AdminSidebarRef>(null)
  const [user, setUser] = useState<UserType | null>(null)
  const [complaints, setComplaints] = useState<ComplaintType[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/check-auth", {
          credentials: "include",
        })

        if (!response.ok) {
          throw new Error("Auth check failed")
        }

        const data = await response.json()

        if (data.role !== "admin") {
          router.push("/profile")
          return
        }

        setUser(data)
        fetchComplaints() // Only fetch complaints after auth is confirmed
      } catch (error) {
        console.error("Auth error:", error)
        router.push("/login")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const fetchComplaints = async () => {
    try {
      const response = await fetch("/api/auth/complaints/complaints", {
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Failed to fetch complaints")
      }

      const data = await response.json()
      
      // Ensure we always have an array
      if (Array.isArray(data)) {
        setComplaints(data)
      } else {
        console.warn("Unexpected complaints data structure:", data)
        setComplaints([])
      }
    } catch (error) {
      console.error("Error fetching complaints:", error)
      setComplaints([]) // Ensure complaints is always an array
      toast({
        title: "Error",
        description: "Failed to load complaints",
        variant: "destructive",
      })
    }
  }

  // Show loading state
  if (loading) {
    return <LoadingOverlay isLoading={true} message="Loading admin dashboard..." />
  }

  // Protect against non-admin access
  if (!user || user.role !== "admin") {
    return null
  }

  const filteredComplaints = complaints.filter((complaint) => {
    const matchesSearch =
      complaint.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (complaint.student && complaint.student.toLowerCase().includes(searchTerm.toLowerCase())) ||
      complaint.examName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (complaint.course && complaint.course.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === "all" || complaint.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200 dark:bg-amber-900/50 dark:text-amber-300 dark:border-amber-700 text-xs">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        )
      case "under-review":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-700 text-xs">
            <TrendingUp className="w-3 h-3 mr-1" />
            Under Review
          </Badge>
        )
      case "resolved":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-700 text-xs">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Resolved
          </Badge>
        )
      default:
        return (
          <Badge
            variant="outline"
            className="text-xs border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400"
          >
            {status}
          </Badge>
        )
    }
  }

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Important for cookie handling
      })

      const data = await response.json()

      if (data.success) {
        // Force a hard refresh to clear all client-side state
        window.location.href = "/login"
      } else {
        toast({
          title: "Logout failed",
          description: "An error occurred while logging out",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Logout error:", error)
      toast({
        title: "Logout failed",
        description: "An error occurred while logging out",
        variant: "destructive",
      })
    }
  }

  const pendingCount = complaints.filter((c) => c.status === "pending").length
  const reviewCount = complaints.filter((c) => c.status === "under-review").length
  const resolvedCount = complaints.filter((c) => c.status === "resolved").length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20 relative">
      <AdminSidebar ref={adminSidebarRef}>
        <div />
      </AdminSidebar>
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200/20 dark:bg-purple-800/10 rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200/20 dark:bg-blue-800/10 rounded-full opacity-40 animate-pulse delay-1000"></div>
      </div>
      {/* Header */}
      <DashboardHeader
        user={user}
        onLogout={handleLogout}
        onSidebarToggle={() => adminSidebarRef.current?.toggleSidebar()}
      />
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 pt-2 pb-3 sm:pt-3 sm:pb-4 lg:pt-4 lg:pb-8 relative z-10">
        <AdminRoleInfoCard user={user} />
        <StatsCards
          total={complaints.length}
          pending={pendingCount}
          review={reviewCount}
          resolved={resolvedCount}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="glass-effect border-0 shadow-xl dark:bg-gray-800/50">
            <div className="border-b border-white/20 dark:border-gray-700/20 bg-gradient-to-r from-white/50 to-white/30 dark:from-gray-800/50 dark:to-gray-800/30 p-4 sm:p-6">
              <div className="text-lg sm:text-xl font-semibold flex items-center text-gray-900 dark:text-gray-100">
                Exam Complaints Management
              </div>
              <div className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                Review, manage, and respond to student exam complaints efficiently.
              </div>
            </div>
            <div className="p-4 sm:p-6">
              {/* Search and Filter */}
              <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                  <Input
                    placeholder="Search complaints..."
                    className="pl-10 h-10 sm:h-12 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-purple-500/20 text-sm sm:text-base text-gray-900 dark:text-gray-100"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="h-10 sm:h-12 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 text-sm sm:text-base text-gray-900 dark:text-gray-100">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="under-review">Under Review</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {/* Mobile Card View */}
              <ComplaintsMobileCards complaints={filteredComplaints} getStatusBadge={getStatusBadge} />
              {/* Desktop Table View */}
              <div className="hidden sm:block rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-white/50 dark:bg-gray-800/30">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                      <TableHead className="font-semibold text-gray-700 dark:text-gray-300 text-sm">Reference</TableHead>
                      <TableHead className="font-semibold text-gray-700 dark:text-gray-300 text-sm">Student</TableHead>
                      <TableHead className="font-semibold text-gray-700 dark:text-gray-300 text-sm hidden lg:table-cell">Exam</TableHead>
                      <TableHead className="font-semibold text-gray-700 dark:text-gray-300 text-sm hidden lg:table-cell">Course</TableHead>
                      <TableHead className="font-semibold text-gray-700 dark:text-gray-300 text-sm hidden lg:table-cell">Date</TableHead>
                      <TableHead className="font-semibold text-gray-700 dark:text-gray-300 text-sm hidden md:table-cell">Type</TableHead>
                      <TableHead className="font-semibold text-gray-700 dark:text-gray-300 text-sm">Status</TableHead>
                      <TableHead className="font-semibold text-gray-700 dark:text-gray-300 text-sm text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <ComplaintsTable complaints={filteredComplaints} getStatusBadge={getStatusBadge} />
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
