"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Shield, Settings } from "lucide-react"
import { ProfileInfoSection } from "./ProfileInfoSection"
import { SecuritySection } from "./SecuritySection"
import { PreferencesSection } from "./PreferencesSection"

interface ProfileTabsProps {
  isAdmin: boolean
  activeTab: string
  setActiveTab: (tab: string) => void
  user: any
  formData: any
  setFormData: (data: any) => void
  isEditing: boolean
  setIsEditing: (editing: boolean) => void
  isSaving: boolean
  passwordData: any
  setPasswordData: (data: any) => void
  onSaveProfile: () => void
  onChangePassword: () => void
  onFileUpload: (file: File) => Promise<string>
}

export function ProfileTabs({
  isAdmin,
  activeTab,
  setActiveTab,
  user,
  formData,
  setFormData,
  isEditing,
  setIsEditing,
  isSaving,
  passwordData,
  setPasswordData,
  onSaveProfile,
  onChangePassword,
  onFileUpload
}: ProfileTabsProps) {
  return (
    <Card className="glass-effect border-0 shadow-xl dark:bg-gray-800/50">
      <CardHeader className="border-b border-white/20 dark:border-gray-700/20 bg-gradient-to-r from-white/50 to-white/30 dark:from-gray-800/50 dark:to-gray-800/30">
        <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
          Account Settings
        </CardTitle>
        <CardDescription className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          {isAdmin
            ? "Manage your administrative account and system preferences"
            : "Manage your personal information and account preferences"}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 sm:mb-8 bg-gray-100/50 dark:bg-gray-800/50 p-1 rounded-xl h-10 sm:h-12">
            <TabsTrigger
              value="profile"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm rounded-lg transition-all font-medium text-xs sm:text-sm text-gray-700 dark:text-gray-300"
            >
              <User className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm rounded-lg transition-all font-medium text-xs sm:text-sm text-gray-700 dark:text-gray-300"
            >
              <Shield className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger
              value="preferences"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm rounded-lg transition-all font-medium text-xs sm:text-sm text-gray-700 dark:text-gray-300"
            >
              <Settings className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              {isAdmin ? "Admin Settings" : "Preferences"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <ProfileInfoSection
              user={user}
              isAdmin={isAdmin}
              formData={formData}
              setFormData={setFormData}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              isSaving={isSaving}
              onSave={onSaveProfile}
              onFileUpload={onFileUpload}
            />
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <SecuritySection
              passwordData={passwordData}
              setPasswordData={setPasswordData}
              isSaving={isSaving}
              onChangePassword={onChangePassword}
            />
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <PreferencesSection isAdmin={isAdmin} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
