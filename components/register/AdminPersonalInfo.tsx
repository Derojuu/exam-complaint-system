import React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Mail, IdCard } from "lucide-react"

interface AdminPersonalInfoProps {
  formData: {
    firstName: string
    lastName: string
    email: string
    staffId: string
  }
  errors: Record<string, string>
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function AdminPersonalInfo({ formData, errors, onChange }: AdminPersonalInfoProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Personal Information</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
            <User className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
            First Name
          </Label>
          <Input
            id="firstName"
            name="firstName"
            type="text"
            placeholder="Enter first name"
            value={formData.firstName}
            onChange={onChange}
            className={`h-12 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:border-red-500 focus:ring-red-500/20 ${
              errors.firstName ? "border-red-500" : ""
            }`}
          />
          {errors.firstName && <p className="text-red-600 text-sm">{errors.firstName}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Last Name
          </Label>
          <Input
            id="lastName"
            name="lastName"
            type="text"
            placeholder="Enter last name"
            value={formData.lastName}
            onChange={onChange}
            className={`h-12 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:border-red-500 focus:ring-red-500/20 ${
              errors.lastName ? "border-red-500" : ""
            }`}
          />
          {errors.lastName && <p className="text-red-600 text-sm">{errors.lastName}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
          <Mail className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
          Email Address
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="Enter email address"
          value={formData.email}
          onChange={onChange}
          className={`h-12 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:border-red-500 focus:ring-red-500/20 ${
            errors.email ? "border-red-500" : ""
          }`}
        />
        {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="staffId" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
          <IdCard className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
          Staff ID
        </Label>
        <Input
          id="staffId"
          name="staffId"
          type="text"
          placeholder="Enter staff ID"
          value={formData.staffId}
          onChange={onChange}
          className={`h-12 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:border-red-500 focus:ring-red-500/20 ${
            errors.staffId ? "border-red-500" : ""
          }`}
        />
        {errors.staffId && <p className="text-red-600 text-sm">{errors.staffId}</p>}
      </div>
    </div>
  )
}
