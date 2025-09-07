"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { LoadingOverlay } from "@/components/loading-overlay"
import { LoginPageHeader } from "@/components/login/LoginPageHeader"
import { LoginCardHeader } from "@/components/login/LoginCardHeader"
import { LoginTabs } from "@/components/login/LoginTabs"
import { StudentLoginForm } from "@/components/login/StudentLoginForm"
import { AdminLoginForm } from "@/components/login/AdminLoginForm"
import { LoginFooter } from "@/components/login/LoginFooter"

export default function Login() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"student" | "admin">("student")
  const [error, setError] = useState<string | null>(null)
  const [showStudentPassword, setShowStudentPassword] = useState(false)
  const [showAdminPassword, setShowAdminPassword] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>, role: "student" | "admin") => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim(),
          role,
        }),
        credentials: "include",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`)
      }

      if (data.success) {
        // Don't set isLoading to false here!
        router.push(role === "student" ? "/track-complaint" : "/admin/dashboard")
      } else {
        throw new Error(data.message || "Login failed")
      }
    } catch (err: any) {
      setError(err.message || "Failed to connect to the server")
      setIsLoading(false) // Only set to false on error
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20 p-3 sm:p-4 overflow-auto">
      <LoadingOverlay isLoading={isLoading} message="Signing you in..." />

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200/20 dark:bg-purple-800/10 rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200/20 dark:bg-blue-800/10 rounded-full opacity-40 animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 w-full max-w-sm sm:max-w-md">
        <LoginPageHeader />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Card className="glass-effect shadow-2xl border-0 dark:bg-gray-800/50">
            <LoginCardHeader />

            <CardContent className="space-y-6">
              {mounted ? (
                <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "student" | "admin")} className="w-full">
                  <LoginTabs />

                  <TabsContent value="student" id="login-content-student">
                    <StudentLoginForm
                      showPassword={showStudentPassword}
                      setShowPassword={setShowStudentPassword}
                      error={error}
                      isLoading={isLoading}
                      onSubmit={(e) => handleLogin(e, "student")}
                    />
                  </TabsContent>

                  <TabsContent value="admin" id="login-content-admin">
                    <AdminLoginForm
                      showPassword={showAdminPassword}
                      setShowPassword={setShowAdminPassword}
                      error={error}
                      isLoading={isLoading}
                      onSubmit={(e) => handleLogin(e, "admin")}
                    />
                  </TabsContent>
                </Tabs>
              ) : (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                </div>
              )}
            </CardContent>

            <LoginFooter activeTab={activeTab} />
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
