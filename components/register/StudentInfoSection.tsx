"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BadgeIcon as IdCard, Building2, GraduationCap, Layers } from "lucide-react"

interface StudentInfoSectionProps {
  formData: {
    studentId: string
    department: string
    faculty: string
    level: string
  }
  errors: Record<string, string>
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
}

export function StudentInfoSection({ formData, errors, onChange }: StudentInfoSectionProps) {
  return (
    <>
      {/* Student ID */}
      <div className="space-y-2">
        <Label
          htmlFor="studentId"
          className="text-sm font-medium flex items-center text-gray-700 dark:text-gray-300"
        >
          <IdCard className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
          Student ID
        </Label>
        <Input
          id="studentId"
          name="studentId"
          value={formData.studentId}
          onChange={onChange}
          className="h-10 sm:h-12 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-purple-500/20 text-gray-900 dark:text-gray-100"
          placeholder="STU2024001"
        />
        {errors.studentId && <p className="text-sm text-red-500 dark:text-red-400">{errors.studentId}</p>}
      </div>

      {/* Academic Information */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label
            htmlFor="department"
            className="text-sm font-medium flex items-center text-gray-700 dark:text-gray-300"
          >
            <Building2 className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
            Department
          </Label>
          <select
            id="department"
            name="department"
            value={formData.department}
            onChange={onChange}
            className="h-10 sm:h-12 w-full rounded-lg bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-purple-500/20 text-gray-900 dark:text-gray-100 px-3"
          >
            <option value="">Select Department</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Information Technology">Information Technology</option>
            <option value="Software Engineering">Software Engineering</option>
            <option value="Cybersecurity">Cybersecurity</option>
            <option value="Data Science">Data Science</option>
            <option value="Business Administration">Business Administration</option>
            <option value="Marketing">Marketing</option>
            <option value="Finance">Finance</option>
            <option value="Accounting">Accounting</option>
            <option value="Economics">Economics</option>
            <option value="Mechanical Engineering">Mechanical Engineering</option>
            <option value="Electrical Engineering">Electrical Engineering</option>
            <option value="Civil Engineering">Civil Engineering</option>
            <option value="Chemical Engineering">Chemical Engineering</option>
            <option value="Psychology">Psychology</option>
            <option value="Sociology">Sociology</option>
            <option value="Political Science">Political Science</option>
            <option value="International Relations">International Relations</option>
            <option value="English Literature">English Literature</option>
            <option value="Mass Communication">Mass Communication</option>
          </select>
          {errors.department && <p className="text-sm text-red-500 dark:text-red-400">{errors.department}</p>}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="faculty"
            className="text-sm font-medium flex items-center text-gray-700 dark:text-gray-300"
          >
            <GraduationCap className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
            Faculty
          </Label>
          <select
            id="faculty"
            name="faculty"
            value={formData.faculty}
            onChange={onChange}
            className="h-10 sm:h-12 w-full rounded-lg bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-purple-500/20 text-gray-900 dark:text-gray-100 px-3"
          >
            <option value="">Select Faculty</option>
            <option value="Faculty of Computing">Faculty of Computing</option>
            <option value="Faculty of Business">Faculty of Business</option>
            <option value="Faculty of Engineering">Faculty of Engineering</option>
            <option value="Faculty of Social Sciences">Faculty of Social Sciences</option>
            <option value="Faculty of Arts">Faculty of Arts</option>
            <option value="Faculty of Sciences">Faculty of Sciences</option>
            <option value="Faculty of Medicine">Faculty of Medicine</option>
            <option value="Faculty of Law">Faculty of Law</option>
            <option value="Faculty of Education">Faculty of Education</option>
          </select>
          {errors.faculty && <p className="text-sm text-red-500 dark:text-red-400">{errors.faculty}</p>}
        </div>
      </div>

      {/* Level */}
      <div className="space-y-2">
        <Label
          htmlFor="level"
          className="text-sm font-medium flex items-center text-gray-700 dark:text-gray-300"
        >
          <Layers className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
          Level
        </Label>
        <select
          id="level"
          name="level"
          value={formData.level}
          onChange={onChange}
          className="h-10 sm:h-12 w-full rounded-lg bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-purple-500/20 text-gray-900 dark:text-gray-100 px-3"
        >
          <option value="">Select Level</option>
          <option value="100">100 Level (Year 1)</option>
          <option value="200">200 Level (Year 2)</option>
          <option value="300">300 Level (Year 3)</option>
          <option value="400">400 Level (Year 4)</option>
          <option value="500">500 Level (Year 5)</option>
          <option value="600">600 Level (Year 6)</option>
        </select>
        {errors.level && <p className="text-sm text-red-500 dark:text-red-400">{errors.level}</p>}
      </div>
    </>
  )
}
