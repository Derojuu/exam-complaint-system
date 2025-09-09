import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Edit3, Save, X, User, Mail, Phone, BookOpen, Award } from "lucide-react"

interface AdminProfileInfoProps {
  user: any
  formData: any
  isEditing: boolean
  isSaving: boolean
  setIsEditing: (editing: boolean) => void
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  handleSaveProfile: () => void
}

export function AdminProfileInfo({
  user,
  formData,
  isEditing,
  isSaving,
  setIsEditing,
  handleInputChange,
  handleSaveProfile
}: AdminProfileInfoProps) {
  if (!user) return null

  return (
    <Card className="glass-effect border-0 shadow-lg">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 pb-4 sm:pb-6 px-4 sm:px-6">
        <div className="min-w-0 flex-1">
          <CardTitle className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">Personal Information</CardTitle>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">Manage your admin profile details</p>
        </div>
        <div className="flex gap-2 justify-start sm:justify-end">
          {!isEditing ? (
            <Button
              onClick={() => setIsEditing(true)}
              size="sm"
              className="btn-gradient text-sm"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                onClick={() => setIsEditing(false)}
                variant="outline"
                size="sm"
                className="border-gray-200 dark:border-gray-700 text-sm"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleSaveProfile}
                disabled={isSaving}
                size="sm"
                className="btn-gradient text-sm"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6 pb-4 sm:pb-6">
        <Separator />
        
        <div className="grid gap-4 sm:gap-6">
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-sm font-medium flex items-center text-gray-700 dark:text-gray-300">
                <User className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                First Name
              </Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="h-10 sm:h-12 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-purple-500/20 disabled:bg-gray-50 dark:disabled:bg-gray-800 text-sm sm:text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Last Name
              </Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="h-10 sm:h-12 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-purple-500/20 disabled:bg-gray-50 dark:disabled:bg-gray-800 text-sm sm:text-base"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium flex items-center text-gray-700 dark:text-gray-300">
              <Mail className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
              Email Address
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="h-10 sm:h-12 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-purple-500/20 disabled:bg-gray-50 dark:disabled:bg-gray-800 text-sm sm:text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium flex items-center text-gray-700 dark:text-gray-300">
              <Phone className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
              Phone Number
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              disabled={!isEditing}
              placeholder="Enter phone number"
              className="h-10 sm:h-12 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-purple-500/20 disabled:bg-gray-50 dark:disabled:bg-gray-800 text-sm sm:text-base"
            />
          </div>

          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="department" className="text-sm font-medium flex items-center text-gray-700 dark:text-gray-300">
                <BookOpen className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                Department
              </Label>
              <Input
                id="department"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="Enter department"
                className="h-10 sm:h-12 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-purple-500/20 disabled:bg-gray-50 dark:disabled:bg-gray-800 text-sm sm:text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="position" className="text-sm font-medium flex items-center text-gray-700 dark:text-gray-300">
                <Award className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                Position
              </Label>
              <Input
                id="position"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="Enter position"
                className="h-10 sm:h-12 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-purple-500/20 disabled:bg-gray-50 dark:disabled:bg-gray-800 text-sm sm:text-base"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Bio
            </Label>
            <Textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              disabled={!isEditing}
              placeholder="Tell us about yourself..."
              className="min-h-[80px] sm:min-h-[100px] bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-purple-500/20 disabled:bg-gray-50 dark:disabled:bg-gray-800 text-sm sm:text-base"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
