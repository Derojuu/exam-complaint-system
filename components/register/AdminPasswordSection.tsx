import React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Lock } from "lucide-react"

interface AdminPasswordSectionProps {
  formData: {
    password: string
    confirmPassword: string
  }
  errors: Record<string, string>
  showPassword: boolean
  showConfirmPassword: boolean
  setShowPassword: (show: boolean) => void
  setShowConfirmPassword: (show: boolean) => void
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function AdminPasswordSection({ 
  formData, 
  errors, 
  showPassword, 
  showConfirmPassword, 
  setShowPassword, 
  setShowConfirmPassword, 
  onChange 
}: AdminPasswordSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Security</h3>
      
      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
          <Lock className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
          Password
        </Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter password (min 8 characters)"
            value={formData.password}
            onChange={onChange}
            className={`h-12 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:border-red-500 focus:ring-red-500/20 pr-12 ${
              errors.password ? "border-red-500" : ""
            }`}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {errors.password && <p className="text-red-600 text-sm">{errors.password}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Confirm Password
        </Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={onChange}
            className={`h-12 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:border-red-500 focus:ring-red-500/20 pr-12 ${
              errors.confirmPassword ? "border-red-500" : ""
            }`}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {errors.confirmPassword && <p className="text-red-600 text-sm">{errors.confirmPassword}</p>}
      </div>

      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
        <p className="text-sm text-amber-800 dark:text-amber-200">
          <strong>Password Requirements:</strong> Must be at least 8 characters long and contain uppercase, lowercase, and number characters.
        </p>
      </div>
    </div>
  )
}
