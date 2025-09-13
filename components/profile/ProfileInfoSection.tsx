"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { User, Mail, Phone, BookOpen, Award, School, Edit3, X, Save } from "lucide-react"

interface ProfileInfoSectionProps {
  user: any
  isAdmin: boolean
  formData: any
  setFormData: (data: any) => void
  isEditing: boolean
  setIsEditing: (editing: boolean) => void
  isSaving: boolean
  onSave: () => void
  onFileUpload: (file: File) => Promise<string>
}

export function ProfileInfoSection({
  user,
  isAdmin,
  formData,
  setFormData,
  isEditing,
  setIsEditing,
  isSaving,
  onSave,
  onFileUpload
}: ProfileInfoSectionProps) {
  const [uploading, setUploading] = useState(false)
  const { toast } = useToast()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev: any) => ({ ...prev, [name]: value }))
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    setUploading(true)
    try {
      const url = await onFileUpload(file)
      setFormData((prev: any) => ({ ...prev, profilePicUrl: url }))
      toast({ title: "Profile picture updated!" })
    } catch (err) {
      toast({ title: "Upload failed", description: "Try again.", variant: "destructive" })
    }
    setUploading(false)
  }

  return (
    <div className="space-y-6">
      {/* Profile Image/Avatar */}
      <div className="flex flex-col items-center justify-center gap-4 mb-4">
        {formData.profilePicUrl ? (
          <img
            src={formData.profilePicUrl}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover border"
          />
        ) : (
          <div className="w-20 h-20 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 rounded-xl flex items-center justify-center">
            <User className="w-10 h-10 text-purple-600 dark:text-purple-300" />
          </div>
        )}
        {isEditing && (
          <div>
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={uploading}
            />
            {uploading && <div className="text-xs text-gray-500 mt-1">Uploading...</div>}
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
            {isAdmin ? "Administrative Information" : "Personal Information"}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {isAdmin
              ? "Update your administrative details and contact information"
              : "Update your personal details and contact information"}
          </p>
        </div>
        {!isEditing ? (
          <Button
            onClick={() => setIsEditing(true)}
            variant="outline"
            size="sm"
            className="border-purple-200 text-purple-600 hover:bg-purple-50 w-full sm:w-auto dark:border-purple-700 dark:text-purple-400 dark:hover:bg-purple-900/20"
          >
            <Edit3 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              onClick={() => setIsEditing(false)}
              variant="outline"
              size="sm"
              className="border-gray-200 text-gray-600 hover:bg-gray-50 flex-1 sm:flex-none dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              <X className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Cancel
            </Button>
            <Button
              onClick={onSave}
              disabled={isSaving}
              size="sm"
              className="btn-gradient flex-1 sm:flex-none"
            >
              {isSaving ? (
                <>
                  <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1 sm:mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Save
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      <Separator className="bg-gray-200 dark:bg-gray-700" />

      <div className="grid gap-4 sm:gap-6">
        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label
              htmlFor="firstName"
              className="text-sm font-medium flex items-center text-gray-700 dark:text-gray-300"
            >
              <User className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-gray-500 dark:text-gray-400" />
              First Name
            </Label>
            <Input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="h-9 sm:h-10 lg:h-12 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-purple-500/20 disabled:bg-gray-50 disabled:text-gray-500 dark:disabled:bg-gray-800 dark:disabled:text-gray-400 text-gray-900 dark:text-gray-100"
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
              className="h-9 sm:h-10 lg:h-12 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-purple-500/20 disabled:bg-gray-50 disabled:text-gray-500 dark:disabled:bg-gray-800 dark:disabled:text-gray-400 text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="email"
            className="text-sm font-medium flex items-center text-gray-700 dark:text-gray-300"
          >
            <Mail className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-gray-500 dark:text-gray-400" />
            Email Address
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="h-9 sm:h-10 lg:h-12 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-purple-500/20 disabled:bg-gray-50 disabled:text-gray-500 dark:disabled:bg-gray-800 dark:disabled:text-gray-400 text-gray-900 dark:text-gray-100"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="phone"
            className="text-sm font-medium flex items-center text-gray-700 dark:text-gray-300"
          >
            <Phone className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-gray-500 dark:text-gray-400" />
            Phone Number
          </Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleInputChange}
            disabled={!isEditing}
            placeholder="Enter your phone number"
            className="h-9 sm:h-10 lg:h-12 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-purple-500/20 disabled:bg-gray-50 disabled:text-gray-500 dark:disabled:bg-gray-800 dark:disabled:text-gray-400 text-gray-900 dark:text-gray-100"
          />
        </div>

        {/* Role-specific fields */}
        {isAdmin ? (
          <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label
                htmlFor="department"
                className="text-sm font-medium flex items-center text-gray-700 dark:text-gray-300"
              >
                <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-gray-500 dark:text-gray-400" />
                Department
              </Label>
              <Input
                id="department"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="e.g., Academic Affairs"
                className="h-9 sm:h-10 lg:h-12 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-purple-500/20 disabled:bg-gray-50 disabled:text-gray-500 dark:disabled:bg-gray-800 dark:disabled:text-gray-400 text-gray-900 dark:text-gray-100"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="position"
                className="text-sm font-medium flex items-center text-gray-700 dark:text-gray-300"
              >
                <Award className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-gray-500 dark:text-gray-400" />
                Position
              </Label>
              <Input
                id="position"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="e.g., Senior Administrator"
                className="h-9 sm:h-10 lg:h-12 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-purple-500/20 disabled:bg-gray-50 disabled:text-gray-500 dark:disabled:bg-gray-800 dark:disabled:text-gray-400 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <Label
              htmlFor="studentId"
              className="text-sm font-medium flex items-center text-gray-700 dark:text-gray-300"
            >
              <School className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-gray-500 dark:text-gray-400" />
              Student ID
            </Label>
            <Input
              id="studentId"
              value={user?.studentId || ""}
              disabled
              className="h-9 sm:h-10 lg:h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400"
            />
          </div>
        )}
      </div>
    </div>
  )
}
