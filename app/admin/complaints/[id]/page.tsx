"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Clock,
  Calendar,
  FileText,
  User,
  Mail,
  School,
  GraduationCap,
  MessageSquare,
  Send,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  Download,
  Eye,
  Layers,
  Building2,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { ThemeToggle } from "@/components/theme-toggle"
import { NotificationDropdown } from "@/components/notification-dropdown"
import { ComplaintHeader } from "@/components/admin/complaint-detail/ComplaintHeader"
import { ComplaintOverviewCard } from "@/components/admin/complaint-detail/ComplaintOverviewCard"
import { ResponseHistoryCard } from "@/components/admin/complaint-detail/ResponseHistoryCard"
import { StatusTimelineCard } from "@/components/admin/complaint-detail/StatusTimelineCard"
import { QuickActionsCard } from "@/components/admin/complaint-detail/QuickActionsCard"
import { AddResponseCard } from "@/components/admin/complaint-detail/AddResponseCard"
import { ComplaintNotFoundCard } from "@/components/admin/complaint-detail/ComplaintNotFoundCard"
import { ComplaintDetailLoadingSkeleton } from "@/components/admin/complaint-detail/ComplaintDetailLoadingSkeleton"
import type { Complaint } from "@/app/types"
import { LoadingOverlay } from "@/components/loading-overlay"
import { AdminSidebar } from "@/components/admin-sidebar"

export default function ComplaintDetail() {
  const params = useParams()
  const complaintId = params?.id as string

  const [complaint, setComplaint] = useState<Complaint | null>(null)
  const [status, setStatus] = useState("")
  const [response, setResponse] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [keyCounter, setKeyCounter] = useState(0)

  useEffect(() => {
    async function fetchComplaintDetails() {
      try {
        const response = await fetch(`/api/auth/complaints/${complaintId}`)
        if (!response.ok) {
          throw new Error("Failed to fetch complaint details")
        }
        const data = await response.json()
        
        if (!data.statusHistory) {
          data.statusHistory = [{
            id: `status-${keyCounter}`,
            new_status: data.status,
            old_status: '',
            changed_by_name: 'System',
            formatted_date: new Date(data.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit"
            })
          }]
          setKeyCounter(prev => prev + 1)
        }

        if (!data.responses) {
          data.responses = []
        }
        
        setComplaint(data)
        setStatus(data.status)
      } catch (error) {
        console.error("Error fetching complaint details:", error)
        toast({
          title: "Error",
          description: "Failed to fetch complaint details",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (complaintId) {
      fetchComplaintDetails()
    }
  }, [complaintId, keyCounter])

  const handleUpdateStatus = async (newStatus: string) => {
    try {
      const res = await fetch(`/api/auth/complaints/${complaintId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!res.ok) {
        throw new Error("Failed to update status")
      }

      setStatus(newStatus)
      setComplaint((prev) => {
        if (!prev) return prev
        
        const newStatusHistory = [
          ...(prev.statusHistory || []),
          {
            id: `status-${keyCounter}`,
            new_status: newStatus,
            old_status: prev.status,
            changed_by_name: 'Admin',
            formatted_date: new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit"
            })
          }
        ]
        
        setKeyCounter(prev => prev + 1)
        
        return {
          ...prev,
          status: newStatus,
          statusHistory: newStatusHistory
        }
      })

      toast({
        title: "Status updated successfully",
        description: `Complaint status has been changed to ${newStatus}`,
      })
    } catch (error) {
      console.error("Error updating status:", error)
      toast({
        title: "Failed to update status",
        description: "There was an error updating the complaint status",
        variant: "destructive",
      })
    }
  }

  const handleSubmitResponse = async () => {
    if (!response.trim()) return

    setIsSubmitting(true)

    try {
      const res = await fetch(`/api/auth/complaints/${complaintId}/response`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: response }),
      })

      if (!res.ok) {
        throw new Error("Failed to submit response")
      }

      const newResponse = await res.json()

      toast({
        title: "Response sent successfully",
        description: "Your response has been sent to the student.",
      })

      setComplaint((prev) => ({
        ...prev!,
        responses: [...prev!.responses, newResponse],
      }))

      setResponse("")
    } catch (error) {
      console.error("Error submitting response:", error)
      toast({
        title: "Failed to send response",
        description: "There was an error sending your response. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return <ComplaintDetailLoadingSkeleton />;
  }

  if (!complaint) {
    return <ComplaintNotFoundCard />;
  }

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
            className="bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200 dark:bg-gray-900/50 dark:text-gray-300 dark:border-gray-700 text-xs"
          >
            {status}
          </Badge>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20 relative">
      <LoadingOverlay isLoading={isSubmitting} />
      
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-700/25 bg-[size:75px_75px] opacity-30" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-96 bg-gradient-to-b from-blue-200/30 to-transparent dark:from-blue-800/20 rounded-full blur-3xl" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 relative z-10">
        {/* Header */}
        <ComplaintHeader referenceNumber={complaint.referenceNumber} />

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Complaint Overview */}
            <ComplaintOverviewCard
              complaint={complaint}
              status={status}
              getStatusBadge={getStatusBadge}
              handleUpdateStatus={handleUpdateStatus}
            />
            {/* Response History */}
            <ResponseHistoryCard responses={complaint.responses} />
            {/* Status Timeline */}
            <StatusTimelineCard statusHistory={complaint.statusHistory} />
          </div>
          {/* Sidebar */}
          <div className="space-y-6 lg:col-span-1">
            {/* Quick Actions */}
            <QuickActionsCard />
            {/* Add Response */}
            <AddResponseCard
              response={response}
              setResponse={setResponse}
              isSubmitting={isSubmitting}
              handleSubmitResponse={handleSubmitResponse}
            />
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  )
}