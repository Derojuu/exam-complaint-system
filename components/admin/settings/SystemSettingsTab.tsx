"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Save, RefreshCw, Database } from "lucide-react"

interface SystemSettings {
  autoAssignment: boolean
  requireApproval: boolean
  enableNotifications: boolean
  sessionTimeout: number
  maxFileSize: number
  allowedFileTypes: string[]
}

interface SystemSettingsTabProps {
  systemSettings: SystemSettings
  setSystemSettings: (settings: SystemSettings) => void
  saving: boolean
  onSave: () => void
  onExportData: (dataType: string) => void
}

export function SystemSettingsTab({
  systemSettings,
  setSystemSettings,
  saving,
  onSave,
  onExportData
}: SystemSettingsTabProps) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="space-y-1">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
          System Configuration
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Configure general system behavior and limits
        </p>
      </div>

      <Separator className="bg-gray-200 dark:bg-gray-700" />

      <div className="space-y-4 sm:space-y-6">
        {/* General Settings */}
        <Card className="bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-900 dark:text-gray-100">
              General Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
              <div className="space-y-1 flex-1">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Auto-assign complaints
                </Label>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Automatically assign new complaints to available admins
                </p>
              </div>
              <div className="flex-shrink-0">
                <Switch
                  checked={systemSettings.autoAssignment}
                  onCheckedChange={(checked) =>
                    setSystemSettings({ ...systemSettings, autoAssignment: checked })
                  }
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
              <div className="space-y-1 flex-1">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Require admin approval
                </Label>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  New student accounts require admin approval
                </p>
              </div>
              <div className="flex-shrink-0">
                <Switch
                  checked={systemSettings.requireApproval}
                  onCheckedChange={(checked) =>
                    setSystemSettings({ ...systemSettings, requireApproval: checked })
                  }
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
              <div className="space-y-1 flex-1">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Enable notifications
                </Label>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Allow the system to send notifications
                </p>
              </div>
              <div className="flex-shrink-0">
                <Switch
                  checked={systemSettings.enableNotifications}
                  onCheckedChange={(checked) =>
                    setSystemSettings({ ...systemSettings, enableNotifications: checked })
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Session & File Settings */}
        <Card className="bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-900 dark:text-gray-100">
              Session & File Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="sessionTimeout" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Session Timeout (minutes)
                </Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  min="5"
                  max="480"
                  value={systemSettings.sessionTimeout}
                  onChange={(e) =>
                    setSystemSettings({
                      ...systemSettings,
                      sessionTimeout: Number.parseInt(e.target.value) || 30,
                    })
                  }
                  className="h-10 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:border-purple-500 focus:ring-purple-500/20 text-gray-900 dark:text-gray-100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxFileSize" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Max File Size (MB)
                </Label>
                <Input
                  id="maxFileSize"
                  type="number"
                  min="1"
                  max="100"
                  value={systemSettings.maxFileSize}
                  onChange={(e) =>
                    setSystemSettings({
                      ...systemSettings,
                      maxFileSize: Number.parseInt(e.target.value) || 10,
                    })
                  }
                  className="h-10 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:border-purple-500 focus:ring-purple-500/20 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Allowed File Types
              </Label>
              <div className="flex flex-wrap gap-2">
                {["PDF", "DOC", "DOCX", "JPG", "PNG"].map((type) => (
                  <Badge
                    key={type}
                    className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-600 text-xs"
                  >
                    {type}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className="bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center text-gray-900 dark:text-gray-100">
              <Database className="w-4 h-4 mr-2 text-green-600 dark:text-green-400" />
              Data Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
              <Button
                onClick={() => onExportData("complaints")}
                disabled={saving}
                variant="outline"
                size="sm"
                className="border-blue-200 dark:border-blue-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Export Complaints
              </Button>
              
              <Button
                onClick={() => onExportData("users")}
                disabled={saving}
                variant="outline"
                size="sm"
                className="border-green-200 dark:border-green-700 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Export Users
              </Button>
              
              <Button
                onClick={() => onExportData("analytics")}
                disabled={saving}
                variant="outline"
                size="sm"
                className="border-purple-200 dark:border-purple-700 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Export Analytics
              </Button>
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
              Save System Settings
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
