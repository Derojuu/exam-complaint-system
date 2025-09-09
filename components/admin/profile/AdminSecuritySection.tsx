import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Key, Lock, Shield } from "lucide-react"

interface AdminSecuritySectionProps {
  passwordData: {
    currentPassword: string
    newPassword: string
    confirmPassword: string
  }
  showCurrentPassword: boolean
  showNewPassword: boolean
  showConfirmPassword: boolean
  isSaving: boolean
  setPasswordData: (data: any) => void
  setShowCurrentPassword: (show: boolean) => void
  setShowNewPassword: (show: boolean) => void
  setShowConfirmPassword: (show: boolean) => void
  handleChangePassword: () => void
}

export function AdminSecuritySection({
  passwordData,
  showCurrentPassword,
  showNewPassword,
  showConfirmPassword,
  isSaving,
  setPasswordData,
  setShowCurrentPassword,
  setShowNewPassword,
  setShowConfirmPassword,
  handleChangePassword
}: AdminSecuritySectionProps) {
  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData((prev: any) => ({ ...prev, [field]: value }))
  }

  return (
    <Card className="glass-effect border-0 shadow-lg">
      <CardHeader className="px-4 sm:px-6 pb-4 sm:pb-6">
        <CardTitle className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
          <Shield className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-purple-600" />
          Security Settings
        </CardTitle>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Change your admin password</p>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6 pb-4 sm:pb-6">
        <div className="space-y-2">
          <Label htmlFor="currentPassword" className="text-sm font-medium flex items-center text-gray-700 dark:text-gray-300">
            <Key className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
            Current Password
          </Label>
          <div className="relative">
            <Input
              id="currentPassword"
              type={showCurrentPassword ? "text" : "password"}
              value={passwordData.currentPassword}
              onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
              placeholder="Enter current password"
              className="h-10 sm:h-12 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-purple-500/20 pr-12 text-sm sm:text-base"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            >
              {showCurrentPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="newPassword" className="text-sm font-medium flex items-center text-gray-700 dark:text-gray-300">
            <Lock className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
            New Password
          </Label>
          <div className="relative">
            <Input
              id="newPassword"
              type={showNewPassword ? "text" : "password"}
              value={passwordData.newPassword}
              onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
              placeholder="Enter new password (min 8 characters)"
              className="h-10 sm:h-12 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-purple-500/20 pr-12 text-sm sm:text-base"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Confirm New Password
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={passwordData.confirmPassword}
              onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
              placeholder="Confirm new password"
              className="h-10 sm:h-12 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-purple-500/20 pr-12 text-sm sm:text-base"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
          </div>
        </div>

        <Button
          onClick={handleChangePassword}
          disabled={isSaving || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
          className="w-full h-10 sm:h-12 btn-gradient text-sm sm:text-base"
        >
          {isSaving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Updating Password...
            </>
          ) : (
            <>
              <Key className="w-4 h-4 mr-2" />
              Update Password
            </>
          )}
        </Button>

        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-200">
            <strong>Password Requirements:</strong> Admin passwords must be at least 8 characters long and contain a mix of letters, numbers, and special characters for security.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
