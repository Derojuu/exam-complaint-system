"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Menu, Shield } from "lucide-react"
import type { User as UserType } from "@/app/types/index"
import { LoadingOverlay } from "@/components/loading-overlay"
import { AdminSidebar, AdminSidebarRef } from "@/components/admin-sidebar"
import { AdminProfileHeader } from "@/components/admin/profile/AdminProfileHeader"
import { AdminStatsCards } from "@/components/admin/profile/AdminStatsCards"
import { AdminProfileTabs } from "@/components/admin/profile/AdminProfileTabs"
import { AdminProfileInfo } from "@/components/admin/profile/AdminProfileInfo"
import { AdminSecuritySection } from "@/components/admin/profile/AdminSecuritySection"

export default function AdminProfile() {
  const router = useRouter()
  const adminSidebarRef = useRef<AdminSidebarRef>(null)
  const [user, setUser] = useState<UserType | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    bio: "",
    department: "",
    position: "",
    faculty: "",
    adminLevel: "",
    profilePicUrl: "",
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [adminStats, setAdminStats] = useState({
    totalStudents: 0,
    totalComplaints: 0,
    pendingReview: 0,
    resolvedThisMonth: 0,
    avgResolutionTime: "0 days",
    activeAdmins: 0,
    systemUptime: "99.8%",
    lastLogin: "Loading...",
    recentActivity: 0
  })

  useEffect(() => {
    async function loadAdminProfile() {
      try {
        const authResponse = await fetch("/api/auth/check-auth", {
          credentials: "include",
        })

        if (!authResponse.ok) {
          throw new Error("Auth check failed")
        }

        const authData = await authResponse.json()

        if (authData.role !== "admin") {
          router.push("/profile")
          return
        }

        const profileResponse = await fetch("/api/admin/profile", {
          credentials: "include",
        })

        if (!profileResponse.ok) {
          throw new Error("Failed to fetch admin profile")
        }

        const profileData = await profileResponse.json()
        setUser(profileData)
        setFormData({
          firstName: profileData.firstName || "",
          lastName: profileData.lastName || "",
          email: profileData.email || "",
          phone: profileData.phone || "",
          bio: profileData.bio || "",
          department: profileData.department || "",
          position: profileData.position || "",
          faculty: profileData.faculty || "",
          adminLevel: profileData.adminLevel || "Standard",
          profilePicUrl: profileData.profilePicUrl || "",
        })

        try {
          const statsResponse = await fetch("/api/admin/stats", {
            credentials: "include",
          })

          if (statsResponse.ok) {
            const statsData = await statsResponse.json()
            setAdminStats(statsData)
          }
        } catch (error) {
          console.error("Failed to load admin stats:", error)
        }

      } catch (error) {
        console.error("Failed to load admin profile:", error)
        toast({
          title: "Error",
          description: "Failed to load admin profile. Please try again.",
          variant: "destructive",
        })
        router.push("/login")
      } finally {
        setLoading(false)
      }
    }

    loadAdminProfile()
  }, [router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSaveProfile = async () => {
    setIsSaving(true)
    try {
      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        bio: formData.bio,
        department: formData.department,
        position: formData.position,
        faculty: formData.faculty,
        profilePicUrl: formData.profilePicUrl,
      }

      const response = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updateData),
      })

      if (!response.ok) {
        throw new Error("Failed to update profile")
      }

      const updatedUser = await response.json()
      setUser(updatedUser)
      setFormData(prev => ({
        ...prev,
        firstName: updatedUser.firstName || "",
        lastName: updatedUser.lastName || "",
        email: updatedUser.email || "",
        phone: updatedUser.phone || "",
        department: updatedUser.department || "",
        position: updatedUser.position || "",
        faculty: updatedUser.faculty || "",
      }))
      
      toast({
        title: "Admin profile updated successfully",
        description: "Your administrative information has been saved.",
      })
      setIsEditing(false)
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Failed to update profile",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please ensure both password fields match.",
        variant: "destructive",
      })
      return
    }

    if (passwordData.newPassword.length < 8) {
      toast({
        title: "Password too short",
        description: "Admin passwords must be at least 8 characters long.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch("/api/auth/update-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
        credentials: "include",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to update password")
      }

      toast({
        title: "Password updated successfully",
        description: "Your admin password has been changed.",
      })

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (error: any) {
      console.error("Password change error:", error)
      toast({
        title: "Failed to update password",
        description: error.message || "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return <LoadingOverlay isLoading={true} message="Loading admin profile..." />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20">
      <AdminSidebar ref={adminSidebarRef}>
        <div />
      </AdminSidebar>
      
      <div className="lg:ml-64 flex flex-col min-h-screen">
        <header className="sticky top-0 z-40 glass-effect border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-4 min-w-0 flex-1">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden p-2 hover:bg-purple-100 dark:hover:bg-purple-900/20"
                onClick={() => adminSidebarRef.current?.toggleSidebar()}
              >
                <Menu className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </Button>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl font-bold text-gradient truncate">Admin Profile</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 hidden sm:block">
                  Manage your admin profile and settings
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 relative z-10 max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 truncate">Admin Profile</h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
                Manage your administrative account and system access
              </p>
            </div>
            <Badge className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800 px-3 py-1 w-fit self-start sm:self-center">
              <Shield className="w-4 h-4 mr-2" />
              Administrator
            </Badge>
          </div>

          <AdminProfileHeader user={user} />
          <AdminStatsCards adminStats={adminStats} />

          <Card className="glass-effect border-0 shadow-lg mx-auto max-w-full">
            <CardContent className="p-4 sm:p-6">
              <AdminProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />
              
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
                <TabsContent value="profile" className="space-y-4 sm:space-y-6">
                  <AdminProfileInfo
                    user={user}
                    formData={formData}
                    isEditing={isEditing}
                    isSaving={isSaving}
                    setIsEditing={setIsEditing}
                    handleInputChange={handleInputChange}
                    handleSaveProfile={handleSaveProfile}
                  />
                </TabsContent>

                <TabsContent value="security" className="space-y-4 sm:space-y-6">
                  <AdminSecuritySection
                    passwordData={passwordData}
                    showCurrentPassword={showCurrentPassword}
                    showNewPassword={showNewPassword}
                    showConfirmPassword={showConfirmPassword}
                    isSaving={isSaving}
                    setPasswordData={setPasswordData}
                    setShowCurrentPassword={setShowCurrentPassword}
                    setShowNewPassword={setShowNewPassword}
                    setShowConfirmPassword={setShowConfirmPassword}
                    handleChangePassword={handleChangePassword}
                  />
                </TabsContent>

                <TabsContent value="stats" className="space-y-4 sm:space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <AdminStatsCards adminStats={adminStats} />
                  </motion.div>
                </TabsContent>

                <TabsContent value="notifications" className="space-y-4 sm:space-y-6">
                  <Card className="glass-effect border-0 shadow-lg">
                    <CardContent className="p-4 sm:p-6">
                      <h3 className="text-lg sm:text-xl font-bold mb-4">Notification Settings</h3>
                      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                        Notification settings will be available in a future update.
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="preferences" className="space-y-4 sm:space-y-6">
                  <Card className="glass-effect border-0 shadow-lg">
                    <CardContent className="p-4 sm:p-6">
                      <h3 className="text-lg sm:text-xl font-bold mb-4">Admin Preferences</h3>
                      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                        Advanced admin preferences will be available in a future update.
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
      <Toaster />
    </div>
  )
}
