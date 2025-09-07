"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { toast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LoadingOverlay } from "@/components/loading-overlay"
import { Clock, TrendingUp, CheckCircle2, AlertCircle } from "lucide-react"
import type { Complaint } from "@/app/types"
import { useRouter } from "next/navigation"
import { StudentSidebar, type StudentSidebarRef } from "@/components/student-sidebar"
import TrackComplaintHeader from "@/components/track-complaint/TrackComplaintHeader"
import ComplaintStatsCards from "@/components/track-complaint/ComplaintStatsCards"
import ComplaintSearchAndFilter from "@/components/track-complaint/ComplaintSearchAndFilter"
import ComplaintTabs from "@/components/track-complaint/ComplaintTabs"
import ComplaintList from "@/components/track-complaint/ComplaintList"

export default function TrackComplaint() {
  const sidebarRef = useRef<StudentSidebarRef>(null)
  const [navOpen, setNavOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("all")
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function fetchComplaints() {
      try {
        const response = await fetch("/api/auth/complaints/complaints", {
          credentials: "include",
        })

        if (!response.ok) {
          if (response.status === 401) {
            router.push("/login?redirect=/track-complaint")
            return
          }
          throw new Error("Failed to fetch complaints")
        }

        const data = await response.json()
        setComplaints(data)
      } catch (error) {
        console.error("Error fetching complaints:", error)
        toast({
          title: "Error",
          description: "Failed to fetch complaints. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchComplaints()
  }, [router])

  const filteredComplaints = complaints.filter((complaint) => {
    const matchesSearch =
      complaint.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.examName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (complaint.complaintType && complaint.complaintType.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === "all" || complaint.status === statusFilter

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "pending" && complaint.status === "pending") ||
      (activeTab === "under-review" && complaint.status === "under-review") ||
      (activeTab === "resolved" && complaint.status === "resolved")

    return matchesSearch && matchesStatus && matchesTab
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200 dark:bg-amber-900/50 dark:text-amber-300 dark:border-amber-700">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        )
      case "under-review":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-700">
            <TrendingUp className="w-3 h-3 mr-1" />
            Under Review
          </Badge>
        )
      case "resolved":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-700">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Resolved
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400">
            {status}
          </Badge>
        )
    }
  }

  const pendingCount = complaints.filter((c) => c.status === "pending").length
  const reviewCount = complaints.filter((c) => c.status === "under-review").length
  const resolvedCount = complaints.filter((c) => c.status === "resolved").length

  return (
    <StudentSidebar ref={sidebarRef}>
      <div className="min-h-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20">
        <LoadingOverlay isLoading={isLoading} message="Loading your complaints..." />

        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200/20 dark:bg-purple-800/10 rounded-full opacity-60 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200/20 dark:bg-blue-800/10 rounded-full opacity-40 animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 w-full mx-auto px-1 sm:px-4 lg:px-6 py-2 sm:py-6 lg:py-8 space-y-4 sm:space-y-8">
          <TrackComplaintHeader />

          <ComplaintStatsCards 
            totalCount={complaints.length}
            pendingAndReviewCount={pendingCount + reviewCount}
            resolvedCount={resolvedCount}
          />

          {/* Main Content Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="glass-effect border-0 shadow-xl dark:bg-gray-800/50">
              <CardHeader className="border-b border-white/20 dark:border-gray-700/20 bg-gradient-to-r from-white/50 to-white/30 dark:from-gray-800/50 dark:to-gray-800/30">
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Complaint History
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  View and track all your submitted complaints in one place
                </CardDescription>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 lg:p-6">
                <div className="space-y-4 sm:space-y-6">
                  <ComplaintSearchAndFilter 
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                  />

                  <ComplaintTabs
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    totalCount={complaints.length}
                    pendingCount={pendingCount}
                    reviewCount={reviewCount}
                    resolvedCount={resolvedCount}
                  >
                    <ComplaintList complaints={filteredComplaints} getStatusBadge={getStatusBadge} />
                  </ComplaintTabs>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </StudentSidebar>
  )
}

// Add the logout handler
async function handleLogout() {
  const router = useRouter()

  try {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    })
    router.push("/login")
  } catch (error) {
    console.error("Logout failed:", error)
    toast({
      title: "Error",
      description: "Failed to sign out. Please try again.",
      variant: "destructive",
    })
  }
}
