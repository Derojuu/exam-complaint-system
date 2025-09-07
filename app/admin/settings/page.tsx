"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { AdminSidebar, AdminSidebarRef } from "@/components/admin-sidebar"
import { LoadingOverlay } from "@/components/loading-overlay"
import { toast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import type { User as UserType } from "@/app/types/index"
import { AdminSettingsHeader } from "@/components/admin/settings/AdminSettingsHeader"
import { AdminSettingsTabs } from "@/components/admin/settings/AdminSettingsTabs"
import {
  getAdminSettings,
  updateComplaintCategories,
  updateSystemSettings,
  updateNotificationSettings,
  createComplaintCategory,
  deleteComplaintCategory,
  testEmailConfiguration,
  exportSystemData,
} from "@/app/actions/admin-settings"

interface ComplaintCategory {
  id: string
  name: string
  description: string
  isActive: boolean
}

interface StatusWorkflow {
  id: string
  name: string
  order: number
  color: string
  isActive: boolean
}

interface SystemSettings {
  autoAssignment: boolean
  requireApproval: boolean
  enableNotifications: boolean
  sessionTimeout: number
  maxFileSize: number
  allowedFileTypes: string[]
}

interface NotificationSettings {
  emailEnabled: boolean
  smsEnabled: boolean
  escalationTime: number
  reminderTime: number
  adminNotifications: boolean
  studentNotifications: boolean
}

export default function AdminSettings() {
  const router = useRouter()
  const adminSidebarRef = useRef<AdminSidebarRef>(null)
  const [user, setUser] = useState<UserType | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("categories")

  // Data states
  const [categories, setCategories] = useState<ComplaintCategory[]>([])
  const [statuses, setStatuses] = useState<StatusWorkflow[]>([])
  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    autoAssignment: false,
    requireApproval: false,
    enableNotifications: false,
    sessionTimeout: 30,
    maxFileSize: 10,
    allowedFileTypes: [],
  })
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailEnabled: false,
    smsEnabled: false,
    escalationTime: 48,
    reminderTime: 24,
    adminNotifications: false,
    studentNotifications: false,
  })

  // Form states
  const [newCategory, setNewCategory] = useState({ name: "", description: "" })
  const [editingCategory, setEditingCategory] = useState<string | null>(null)

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
        loadSettings()
      } catch (error) {
        console.error("Auth error:", error)
        router.push("/login")
      }
    }

    checkAuth()
  }, [router])

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })

      const data = await response.json()

      if (data.success) {
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

  const loadSettings = async () => {
    try {
      const result = await getAdminSettings()
      if (result.success && result.data) {
        setCategories(result.data.complaintCategories)
        setStatuses(result.data.statusWorkflow)
        setSystemSettings(result.data.systemSettings)
        setNotificationSettings(result.data.notificationSettings)
      } else {
        toast({
          title: "Error loading settings",
          description: result.error || "Failed to load admin settings",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load admin settings",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCategory = async () => {
    if (!newCategory.name.trim()) return
    
    setSaving(true)
    try {
      const result = await createComplaintCategory(newCategory)
      if (result.success && result.data) {
        setCategories([...categories, result.data])
        setNewCategory({ name: "", description: "" })
        toast({
          title: "Success",
          description: "Category created successfully",
        })
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create category",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleUpdateCategory = async (id: string, data: { name: string; description: string }) => {
    setSaving(true)
    try {
      const result = await updateComplaintCategories([{ id, ...data }])
      if (result.success) {
        setCategories(categories.map(cat => cat.id === id ? { ...cat, ...data } : cat))
        toast({
          title: "Success",
          description: "Category updated successfully",
        })
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update category",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteCategory = async (id: string) => {
    setSaving(true)
    try {
      const result = await deleteComplaintCategory(id)
      if (result.success) {
        setCategories(categories.filter(cat => cat.id !== id))
        toast({
          title: "Success",
          description: "Category deleted successfully",
        })
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleUpdateSystemSettings = async () => {
    setSaving(true)
    try {
      const result = await updateSystemSettings(systemSettings)
      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update system settings",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleUpdateNotificationSettings = async () => {
    setSaving(true)
    try {
      const result = await updateNotificationSettings(notificationSettings)
      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update notification settings",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleTestEmail = async () => {
    setSaving(true)
    try {
      const result = await testEmailConfiguration()
      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send test email",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleExportData = async (dataType: string) => {
    setSaving(true)
    try {
      const result = await exportSystemData(dataType)
      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })
        // In a real app, trigger file download here
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export data",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <LoadingOverlay isLoading={true} />
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminSidebar ref={adminSidebarRef} children={undefined}>
        {/* Sidebar content will be handled by the component */}
      </AdminSidebar>
      
      <main className="flex-1 flex flex-col lg:ml-64">
        <AdminSettingsHeader 
          user={user} 
          onLogout={handleLogout} 
          adminSidebarRef={adminSidebarRef} 
        />
        
        <div className="flex-1 p-4 sm:p-6 bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <AdminSettingsTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              categories={categories}
              statuses={statuses}
              systemSettings={systemSettings}
              notificationSettings={notificationSettings}
              newCategory={newCategory}
              setNewCategory={setNewCategory}
              editingCategory={editingCategory}
              setEditingCategory={setEditingCategory}
              setSystemSettings={setSystemSettings}
              setNotificationSettings={setNotificationSettings}
              saving={saving}
              onCreateCategory={handleCreateCategory}
              onUpdateCategory={handleUpdateCategory}
              onDeleteCategory={handleDeleteCategory}
              onUpdateSystemSettings={handleUpdateSystemSettings}
              onUpdateNotificationSettings={handleUpdateNotificationSettings}
              onTestEmail={handleTestEmail}
              onExportData={handleExportData}
            />
          </motion.div>
        </div>
      </main>
      <Toaster />
    </div>
  )
}
