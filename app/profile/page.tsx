"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { DashboardLayout } from "@/components/dashboard-layout"
import { toast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { LoadingOverlay } from "@/components/loading-overlay"
import { getCurrentUser } from "@/app/actions/auth"
import type { User as UserType } from "@/app/types/index"
import { ProfileHeader } from "@/components/profile/ProfileHeader"
import { ProfileStatsCards } from "@/components/profile/ProfileStatsCards"
import { ProfileTabs } from "@/components/profile/ProfileTabs"

interface UserStats {
  totalComplaints: number
  pendingComplaints: number
  resolvedComplaints: number
  totalStudents?: number
}

export default function Profile() {
  const router = useRouter()
  const [user, setUser] = useState<UserType | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")
  const [stats, setStats] = useState<UserStats>({
    totalComplaints: 0,
    pendingComplaints: 0,
    resolvedComplaints: 0,
    totalStudents: 0
  })

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    bio: "",
    profilePicUrl: "",
    department: "",
    position: ""
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await getCurrentUser()
        if (!currentUser) {
          router.push("/login")
          return
        }
        
        setUser(currentUser)
        
        // Initialize form data with user data
        setFormData({
          firstName: currentUser.firstName || "",
          lastName: currentUser.lastName || "",
          email: currentUser.email || "",
          phone: currentUser.phone || "",
          bio: currentUser.bio || "",
          profilePicUrl: currentUser.profilePicUrl || "",
          department: currentUser.department || "",
          position: currentUser.position || ""
        })

        // Load stats
        await loadUserStats(currentUser)
      } catch (error) {
        console.error("Error loading user:", error)
        toast({
          title: "Error",
          description: "Failed to load user profile. Please try again.",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [router])

  const loadUserStats = async (currentUser: UserType) => {
    try {
      const isAdmin = currentUser.role === "admin"
      
      if (isAdmin) {
        // Load admin stats
        const [complaintsRes, studentsRes] = await Promise.all([
          fetch("/api/admin/complaints/stats"),
          fetch("/api/admin/users/stats")
        ])

        const complaintsData = await complaintsRes.json()
        const studentsData = await studentsRes.json()

        setStats({
          totalComplaints: complaintsData.total || 0,
          pendingComplaints: complaintsData.pending || 0,
          resolvedComplaints: complaintsData.resolved || 0,
          totalStudents: studentsData.total || 0
        })
      } else {
        // Load student stats
        const res = await fetch(`/api/student/complaints/stats?userId=${currentUser.id}`)
        const data = await res.json()

        setStats({
          totalComplaints: data.total || 0,
          pendingComplaints: data.pending || 0,
          resolvedComplaints: data.resolved || 0
        })
      }
    } catch (error) {
      console.error("Error loading stats:", error)
    }
  }

  const handleSaveProfile = async () => {
    if (!user) return

    setIsSaving(true)
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error("Failed to update profile")
      }

      const updatedUser = await response.json()
      setUser(updatedUser)
      setIsEditing(false)
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated."
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (!user) return

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "New password and confirmation do not match.",
        variant: "destructive"
      })
      return
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long.",
        variant: "destructive"
      })
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch(`/api/users/${user.id}/password`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to update password")
      }

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      })

      toast({
        title: "Password updated",
        description: "Your password has been successfully updated."
      })
    } catch (error: any) {
      console.error("Error updating password:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update password. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  const uploadProfilePic = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", "ml_default")

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData
      }
    )

    if (!response.ok) {
      throw new Error("Failed to upload image")
    }

    const data = await response.json()
    return data.secure_url
  }

  if (loading) {
    return <LoadingOverlay isLoading={true} />
  }

  if (!user) {
    return null
  }

  const isAdmin = user.role === "admin"
  const userName = `${user.firstName} ${user.lastName}`.trim() || user.email

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 sm:p-6">
        <ProfileHeader isAdmin={isAdmin} userName={userName} />
        
        <ProfileStatsCards isAdmin={isAdmin} stats={stats} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <ProfileTabs
            isAdmin={isAdmin}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            user={user}
            formData={formData}
            setFormData={setFormData}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            isSaving={isSaving}
            passwordData={passwordData}
            setPasswordData={setPasswordData}
            onSaveProfile={handleSaveProfile}
            onChangePassword={handleChangePassword}
            onFileUpload={uploadProfilePic}
          />
        </motion.div>
      </div>
      <Toaster />
    </DashboardLayout>
  )
}
