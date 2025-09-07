"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Settings, Database, Bell } from "lucide-react"
import { ComplaintCategoriesTab } from "./ComplaintCategoriesTab"
import { StatusWorkflowTab } from "./StatusWorkflowTab"
import { SystemSettingsTab } from "./SystemSettingsTab"
import { NotificationSettingsTab } from "./NotificationSettingsTab"

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

interface AdminSettingsTabsProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  categories: ComplaintCategory[]
  statuses: StatusWorkflow[]
  systemSettings: SystemSettings
  notificationSettings: NotificationSettings
  newCategory: { name: string; description: string }
  setNewCategory: (category: { name: string; description: string }) => void
  editingCategory: string | null
  setEditingCategory: (id: string | null) => void
  setSystemSettings: (settings: SystemSettings) => void
  setNotificationSettings: (settings: NotificationSettings) => void
  saving: boolean
  onCreateCategory: () => void
  onUpdateCategory: (id: string, data: { name: string; description: string }) => void
  onDeleteCategory: (id: string) => void
  onUpdateSystemSettings: () => void
  onUpdateNotificationSettings: () => void
  onTestEmail: () => void
  onExportData: (dataType: string) => void
}

export function AdminSettingsTabs({
  activeTab,
  setActiveTab,
  categories,
  statuses,
  systemSettings,
  notificationSettings,
  newCategory,
  setNewCategory,
  editingCategory,
  setEditingCategory,
  setSystemSettings,
  setNotificationSettings,
  saving,
  onCreateCategory,
  onUpdateCategory,
  onDeleteCategory,
  onUpdateSystemSettings,
  onUpdateNotificationSettings,
  onTestEmail,
  onExportData
}: AdminSettingsTabsProps) {
  return (
    <Card className="glass-effect border-0 shadow-xl">
      <CardHeader className="border-b border-white/20 dark:border-gray-700/20 bg-gradient-to-r from-white/50 to-white/30 dark:from-gray-800/50 dark:to-gray-800/30">
        <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
          Admin Configuration
        </CardTitle>
        <CardDescription className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          Manage system-wide settings that affect all users
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-6 sm:mb-8 bg-gray-100/50 dark:bg-gray-800/50 p-1 rounded-xl h-auto">
            <TabsTrigger
              value="categories"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm rounded-lg transition-all font-medium text-xs sm:text-sm p-2 sm:p-3 text-gray-700 dark:text-gray-300 data-[state=active]:text-gray-900 dark:data-[state=active]:text-gray-100"
            >
              <FileText className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Categories
            </TabsTrigger>
            <TabsTrigger
              value="workflow"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm rounded-lg transition-all font-medium text-xs sm:text-sm p-2 sm:p-3 text-gray-700 dark:text-gray-300 data-[state=active]:text-gray-900 dark:data-[state=active]:text-gray-100"
            >
              <Settings className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Workflow
            </TabsTrigger>
            <TabsTrigger
              value="system"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm rounded-lg transition-all font-medium text-xs sm:text-sm p-2 sm:p-3 text-gray-700 dark:text-gray-300 data-[state=active]:text-gray-900 dark:data-[state=active]:text-gray-100"
            >
              <Database className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              System
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm rounded-lg transition-all font-medium text-xs sm:text-sm p-2 sm:p-3 text-gray-700 dark:text-gray-300 data-[state=active]:text-gray-900 dark:data-[state=active]:text-gray-100"
            >
              <Bell className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Notifications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="categories" className="space-y-4 sm:space-y-6">
            <ComplaintCategoriesTab
              categories={categories}
              newCategory={newCategory}
              setNewCategory={setNewCategory}
              editingCategory={editingCategory}
              setEditingCategory={setEditingCategory}
              saving={saving}
              onCreateCategory={onCreateCategory}
              onUpdateCategory={onUpdateCategory}
              onDeleteCategory={onDeleteCategory}
            />
          </TabsContent>

          <TabsContent value="workflow" className="space-y-4 sm:space-y-6">
            <StatusWorkflowTab statuses={statuses} />
          </TabsContent>

          <TabsContent value="system" className="space-y-4 sm:space-y-6">
            <SystemSettingsTab
              systemSettings={systemSettings}
              setSystemSettings={setSystemSettings}
              saving={saving}
              onSave={onUpdateSystemSettings}
              onExportData={onExportData}
            />
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4 sm:space-y-6">
            <NotificationSettingsTab
              notificationSettings={notificationSettings}
              setNotificationSettings={setNotificationSettings}
              saving={saving}
              onSave={onUpdateNotificationSettings}
              onTestEmail={onTestEmail}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
