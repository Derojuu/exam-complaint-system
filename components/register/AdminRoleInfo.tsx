import React from "react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Award, Building, BookOpen, GraduationCap } from "lucide-react"

interface AdminRoleInfoProps {
  position: string
  department: string
  faculty: string
  courses: string
  errors: Record<string, string>
  setPosition: (value: string) => void
  setDepartment: (value: string) => void
  setFaculty: (value: string) => void
  setCourses: (value: string) => void
}

export function AdminRoleInfo({ 
  position, 
  department, 
  faculty, 
  courses, 
  errors, 
  setPosition, 
  setDepartment, 
  setFaculty, 
  setCourses 
}: AdminRoleInfoProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Administrative Role</h3>
      
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
          <Award className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
          Position
        </Label>
        <Select value={position} onValueChange={setPosition}>
          <SelectTrigger className={`h-12 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:border-red-500 focus:ring-red-500/20 ${
            errors.position ? "border-red-500" : ""
          }`}>
            <SelectValue placeholder="Select your position" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">System Administrator</SelectItem>
            <SelectItem value="coordinator">Exam Coordinator</SelectItem>
            <SelectItem value="hod">Head of Department</SelectItem>
            <SelectItem value="dean">Dean</SelectItem>
            <SelectItem value="registrar">Registrar</SelectItem>
          </SelectContent>
        </Select>
        {errors.position && <p className="text-red-600 text-sm">{errors.position}</p>}
      </div>

      {(position === "hod" || position === "coordinator") && (
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
            <Building className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
            Department
          </Label>
          <Select value={department} onValueChange={setDepartment}>
            <SelectTrigger className={`h-12 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:border-red-500 focus:ring-red-500/20 ${
              errors.department ? "border-red-500" : ""
            }`}>
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Computer Science">Computer Science</SelectItem>
              <SelectItem value="Mathematics">Mathematics</SelectItem>
              <SelectItem value="Physics">Physics</SelectItem>
              <SelectItem value="Chemistry">Chemistry</SelectItem>
              <SelectItem value="Biology">Biology</SelectItem>
              <SelectItem value="English">English</SelectItem>
              <SelectItem value="Economics">Economics</SelectItem>
            </SelectContent>
          </Select>
          {errors.department && <p className="text-red-600 text-sm">{errors.department}</p>}
        </div>
      )}

      {position === "dean" && (
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
            <BookOpen className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
            Faculty
          </Label>
          <Select value={faculty} onValueChange={setFaculty}>
            <SelectTrigger className={`h-12 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:border-red-500 focus:ring-red-500/20 ${
              errors.faculty ? "border-red-500" : ""
            }`}>
              <SelectValue placeholder="Select faculty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Science">Faculty of Science</SelectItem>
              <SelectItem value="Arts">Faculty of Arts</SelectItem>
              <SelectItem value="Engineering">Faculty of Engineering</SelectItem>
              <SelectItem value="Medicine">Faculty of Medicine</SelectItem>
              <SelectItem value="Law">Faculty of Law</SelectItem>
              <SelectItem value="Education">Faculty of Education</SelectItem>
            </SelectContent>
          </Select>
          {errors.faculty && <p className="text-red-600 text-sm">{errors.faculty}</p>}
        </div>
      )}

      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
          <GraduationCap className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
          Courses/Subjects (Optional)
        </Label>
        <Select value={courses} onValueChange={setCourses}>
          <SelectTrigger className="h-12 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:border-red-500 focus:ring-red-500/20">
            <SelectValue placeholder="Select courses you oversee" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Courses</SelectItem>
            <SelectItem value="undergraduate">Undergraduate Courses</SelectItem>
            <SelectItem value="postgraduate">Postgraduate Courses</SelectItem>
            <SelectItem value="specific">Specific Courses</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
