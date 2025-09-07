"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Save, Mail, Clock } from "lucide-react"

interface NotificationSettings {
  emailEnabled: boolean
  smsEnabled: boolean
  escalationTime: number
  reminderTime: number
  adminNotifications: boolean
  studentNotifications: boolean
}

interface NotificationSettingsTabProps {
  notificationSettings: NotificationSettings
  setNotificationSettings: (settings: NotificationSettings) => void
  saving: boolean
  onSave: () => void
  onTestEmail: () => void
}

export function NotificationSettingsTab({
  notificationSettings,
  setNotificationSettings,
  saving,
  onSave,
  onTestEmail
}: NotificationSettingsTabProps) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="space-y-1">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
          Notification Settings
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Configure how and when the system sends notifications
        </p>
      </div>

      <Separator className="bg-gray-200 dark:bg-gray-700" />

      <div className="space-y-4 sm:space-y-6">
        {/* User Notifications */}
        <Card className="bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-900 dark:text-gray-100">
              User Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
              <div className="space-y-1 flex-1">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Admin notifications
                </Label>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Send notifications to admins for new complaints
                </p>
              </div>
              <div className="flex-shrink-0">
                <Switch
                  checked={notificationSettings.adminNotifications}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({ ...notificationSettings, adminNotifications: checked })
                  }
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
              <div className="space-y-1 flex-1">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Student notifications
                </Label>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Send status updates to students via email
                </p>
              </div>
              <div className="flex-shrink-0">
                <Switch
                  checked={notificationSettings.studentNotifications}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({ ...notificationSettings, studentNotifications: checked })
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Email Configuration */}
        <Card className="bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center text-gray-900 dark:text-gray-100">
              <Mail className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
              Email Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
              <div className="space-y-1 flex-1">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Enable email notifications
                </Label>
                <p className="text-xs text-gray-600 dark:text-gray-400">Send notifications via email</p>
              </div>
              <div className="flex-shrink-0">
                <Switch
                  checked={notificationSettings.emailEnabled}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({ ...notificationSettings, emailEnabled: checked })
                  }
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
              <div className="space-y-1 flex-1">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Enable SMS notifications
                </Label>
                <p className="text-xs text-gray-600 dark:text-gray-400">Send urgent notifications via SMS</p>
              </div>
              <div className="flex-shrink-0">
                <Switch
                  checked={notificationSettings.smsEnabled}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({ ...notificationSettings, smsEnabled: checked })
                  }
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={onTestEmail}
                disabled={saving}
                variant="outline"
                size="sm"
                className="border-blue-200 dark:border-blue-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                <Mail className="w-4 h-4 mr-2" />
                Send Test Email
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Timing Settings */}
        <Card className="bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center text-gray-900 dark:text-gray-100">
              <Clock className="w-4 h-4 mr-2 text-orange-600 dark:text-orange-400" />
              Timing Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="escalationTime" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Escalation Time (hours)
                </Label>
                <Input
                  id="escalationTime"
                  type="number"
                  min="1"
                  max="168"
                  value={notificationSettings.escalationTime}
                  onChange={(e) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      escalationTime: Number.parseInt(e.target.value) || 48,
                    })
                  }
                  className="h-10 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:border-purple-500 focus:ring-purple-500/20 text-gray-900 dark:text-gray-100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reminderTime" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Reminder Time (hours)
                </Label>
                <Input
                  id="reminderTime"
                  type="number"
                  min="1"
                  max="72"
                  value={notificationSettings.reminderTime}
                  onChange={(e) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      reminderTime: Number.parseInt(e.target.value) || 24,
                    })
                  }
                  className="h-10 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:border-purple-500 focus:ring-purple-500/20 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Button onClick={onSave} disabled={saving} className="btn-gradient w-full sm:w-auto">
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Notification Settings
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
