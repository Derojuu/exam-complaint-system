"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { LoadingOverlay } from "@/components/loading-overlay"
import { Shield } from "lucide-react"
import { registerAdmin } from "@/app/actions/auth"
import { AdminRegisterHeader } from "@/components/register/AdminRegisterHeader"
import { AdminPersonalInfo } from "@/components/register/AdminPersonalInfo"
import { AdminRoleInfo } from "@/components/register/AdminRoleInfo"
import { AdminPasswordSection } from "@/components/register/AdminPasswordSection"
import { AdminSubmitSection } from "@/components/register/AdminSubmitSection"

export default function AdminRegister() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [position, setPosition] = useState("")
  const [department, setDepartment] = useState("")
  const [faculty, setFaculty] = useState("")
  const [courses, setCourses] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    staffId: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required"
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.staffId.trim()) {
      newErrors.staffId = "Staff ID is required"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    if (!position) {
      newErrors.position = "Position is required"
    }

    if (position === "hod" && !department) {
      newErrors.department = "Department is required for HOD"
    }

    if (position === "dean" && !faculty) {
      newErrors.faculty = "Faculty is required for Dean"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    if (!agreeToTerms) {
      toast({
        title: "Terms Required",
        description: "Please agree to the terms and conditions.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const registrationData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        staffId: formData.staffId,
        password: formData.password,
        position,
        department: department || undefined,
        faculty: faculty || undefined,
        courses: courses || undefined,
      }

      const result = await registerAdmin(registrationData)

      if (result.success) {
        toast({
          title: "Registration successful!",
          description: "Your admin account has been created successfully.",
        })
        router.push("/login")
      } else {
        toast({
          title: "Registration failed",
          description: result.message || "Something went wrong",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Registration error:", error)
      toast({
        title: "Error",
        description: "Failed to register. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 dark:from-gray-900 dark:via-red-900/20 dark:to-orange-900/20 flex items-center justify-center p-4">
      <LoadingOverlay isLoading={isLoading} message="Creating your admin account..." />

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-200/20 dark:bg-red-800/10 rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-200/20 dark:bg-orange-800/10 rounded-full opacity-40 animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        <AdminRegisterHeader />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Card className="glass-effect shadow-2xl border-0 dark:bg-gray-800/50">
            <CardHeader className="text-center space-y-4 pb-8">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                  Create Admin Account
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400 mt-2">
                  Register as an administrator to manage the exam complaint system
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                <AdminPersonalInfo
                  formData={formData}
                  errors={errors}
                  onChange={handleChange}
                />

                <AdminRoleInfo
                  position={position}
                  department={department}
                  faculty={faculty}
                  courses={courses}
                  errors={errors}
                  setPosition={setPosition}
                  setDepartment={setDepartment}
                  setFaculty={setFaculty}
                  setCourses={setCourses}
                />

                <AdminPasswordSection
                  formData={formData}
                  errors={errors}
                  showPassword={showPassword}
                  showConfirmPassword={showConfirmPassword}
                  setShowPassword={setShowPassword}
                  setShowConfirmPassword={setShowConfirmPassword}
                  onChange={handleChange}
                />

                <AdminSubmitSection
                  isLoading={isLoading}
                  agreeToTerms={agreeToTerms}
                  setAgreeToTerms={setAgreeToTerms}
                />
              </form>
            </CardContent>

            <div className="px-6 pb-6">
              <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Already have an admin account?{" "}
                  <Link
                    href="/login"
                    className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium transition-colors"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
      <Toaster />
    </div>
  )
}
