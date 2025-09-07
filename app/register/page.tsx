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
import { FileText } from "lucide-react"
import { RegisterHeader } from "@/components/register/RegisterHeader"
import { PersonalInfoSection } from "@/components/register/PersonalInfoSection"
import { StudentInfoSection } from "@/components/register/StudentInfoSection"
import { PasswordSection } from "@/components/register/PasswordSection"
import { TermsAndSubmitSection } from "@/components/register/TermsAndSubmitSection"

export default function Register() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    studentId: "",
    password: "",
    confirmPassword: "",
    department: "",
    faculty: "",
    level: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

    if (!formData.studentId.trim()) {
      newErrors.studentId = "Student ID is required"
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

    if (!formData.department) {
      newErrors.department = "Department is required"
    }

    if (!formData.faculty) {
      newErrors.faculty = "Faculty is required"
    }

    if (!formData.level) {
      newErrors.level = "Level is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          studentId: formData.studentId,
          password: formData.password,
          department: formData.department,
          faculty: formData.faculty,
          level: formData.level,
        }),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        toast({
          title: "Registration successful!",
          description: "Your account has been created successfully. Please log in.",
        })
        router.push("/login")
      } else {
        toast({
          title: "Registration failed",
          description: result.message || "Something went wrong",
          variant: "destructive",
        })
        setIsLoading(false)
      }
    } catch (error) {
      console.error("Registration error:", error)
      toast({
        title: "Error",
        description: "Failed to register. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center p-3 sm:p-4">
      <LoadingOverlay isLoading={isLoading} message="Registering your details..." />

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200/20 dark:bg-purple-800/10 rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200/20 dark:bg-blue-800/10 rounded-full opacity-40 animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 w-full max-w-sm sm:max-w-lg">
        <RegisterHeader />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Card className="glass-effect shadow-2xl border-0 dark:bg-gray-800/50">
            <CardHeader className="text-center space-y-4 pb-8">
              <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl sm:text-2xl font-bold text-gradient">Create Account</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400 mt-2">
                  Join EXCOS to submit and track your exam complaints
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <PersonalInfoSection 
                  formData={formData} 
                  errors={errors} 
                  onChange={handleChange} 
                />
                
                <StudentInfoSection 
                  formData={formData} 
                  errors={errors} 
                  onChange={handleChange} 
                />
                
                <PasswordSection 
                  formData={formData} 
                  errors={errors} 
                  onChange={handleChange} 
                />
                
                <TermsAndSubmitSection isLoading={isLoading} />
              </form>
            </CardContent>

            <div className="px-6 pb-6">
              <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 font-medium transition-colors"
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
