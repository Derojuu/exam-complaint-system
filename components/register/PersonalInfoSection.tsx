"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Mail } from "lucide-react"

interface PersonalInfoSectionProps {
  formData: {
    firstName: string
    lastName: string
    email: string
  }
  errors: Record<string, string>
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function PersonalInfoSection({ formData, errors, onChange }: PersonalInfoSectionProps) {
  return (
    <>
      {/* Name Fields */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label
            htmlFor="firstName"
            className="text-sm font-medium flex items-center text-gray-700 dark:text-gray-300"
          >
            <User className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
            First Name
          </Label>
          <Input
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={onChange}
            className="h-10 sm:h-12 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-purple-500/20 text-gray-900 dark:text-gray-100"
            placeholder="John"
          />
          {errors.firstName && <p className="text-sm text-red-500 dark:text-red-400">{errors.firstName}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Last Name
          </Label>
          <Input
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={onChange}
            className="h-10 sm:h-12 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-purple-500/20 text-gray-900 dark:text-gray-100"
            placeholder="Doe"
          />
          {errors.lastName && <p className="text-sm text-red-500 dark:text-red-400">{errors.lastName}</p>}
        </div>
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <Label
          htmlFor="email"
          className="text-sm font-medium flex items-center text-gray-700 dark:text-gray-300"
        >
          <Mail className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
          Email Address
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={onChange}
          className="h-10 sm:h-12 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-purple-500/20 text-gray-900 dark:text-gray-100"
          placeholder="john.doe@university.edu"
        />
        {errors.email && <p className="text-sm text-red-500 dark:text-red-400">{errors.email}</p>}
      </div>
    </>
  )
}
