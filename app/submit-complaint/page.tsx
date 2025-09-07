"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { FileText, AlertCircle, CheckCircle, User } from "lucide-react"
import type { ComplaintFormState } from "@/app/actions/complaint-actions"
import { LoadingOverlay } from "@/components/loading-overlay"
import SubmitComplaintHeader from "@/components/submit-complaint/SubmitComplaintHeader"
import PersonalInformationSection from "@/components/submit-complaint/PersonalInformationSection"
import ExamInformationSection from "@/components/submit-complaint/ExamInformationSection"
import ComplaintDetailsSection from "@/components/submit-complaint/ComplaintDetailsSection"
import SubmitButtonSection from "@/components/submit-complaint/SubmitButtonSection"

const initialState: ComplaintFormState = {}

// Define the FilePreview type
type FilePreview = {
  url: string
  type: string
  name: string
}

export default function SubmitComplaint() {
  const router = useRouter()
  const [complaintType, setComplaintType] = useState<string>("")
  const [state, setState] = useState<ComplaintFormState>(initialState)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  // Add this useEffect for authentication check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/check-auth", {
          credentials: "include",
        })

        if (!response.ok) {
          router.push("/login?redirect=/submit-complaint")
        }
      } catch (error) {
        console.error("Auth check failed:", error)
        router.push("/login?redirect=/submit-complaint")
      }
    }

    checkAuth()
  }, [router])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true) // Start loading
    setIsSubmitting(true)

    try {
      // Auth check before submission
      const authCheck = await fetch("/api/auth/check-auth", {
        credentials: "include",
      })

      if (!authCheck.ok) {
        toast({
          title: "Authentication required",
          description: "Please login to submit a complaint",
          variant: "destructive",
        })
        router.push("/login?redirect=/submit-complaint")
        return
      }

      // Create FormData from form element
      const form = event.target as HTMLFormElement
      const formData = new FormData(form)

      // Add complaint type separately
      formData.append("complaintType", complaintType)

      // Handle file upload if a file is selected
      let evidenceUrl = null
      const evidenceFile = (form.elements.namedItem('evidence') as HTMLInputElement)?.files?.[0]
      
      if (evidenceFile) {
        try {
          const uploadFormData = new FormData()
          uploadFormData.append('file', evidenceFile)
          
          const uploadResponse = await fetch('/api/upload?type=evidence', {
            method: 'POST',
            body: uploadFormData,
            credentials: 'include'
          })
          
          if (uploadResponse.ok) {
            const uploadResult = await uploadResponse.json()
            evidenceUrl = uploadResult.url
          } else {
            const errorData = await uploadResponse.json()
            console.error('Upload response error:', errorData)
            throw new Error(errorData.message || 'File upload failed')
          }
        } catch (uploadError) {
          console.error('File upload error:', uploadError)
          const errorMessage = uploadError instanceof Error ? uploadError.message : 'Unknown error occurred'
          toast({
            title: "File upload failed",
            description: `Error: ${errorMessage}. Your complaint will be submitted without the evidence file.`,
            variant: "destructive",
          })
        }
      }

      // Remove the evidence file from formData and add the URL instead
      formData.delete("evidence")
      if (evidenceUrl) {
        formData.append("evidenceUrl", evidenceUrl)
      }

      try {
        // Debug: Log form data before sending
        console.log("Form data being sent:")
        for (let [key, value] of formData.entries()) {
          console.log(key, value)
        }
        
        const httpResponse = await fetch("/api/auth/complaints/complaints", {
          method: "POST",
          body: formData,
          credentials: "include",
        })

        const response = await httpResponse.json()
        
        // Debug: Log response
        console.log("API Response:", response)
        console.log("HTTP Status:", httpResponse.status)

        if (!httpResponse.ok) {
          console.error("Submission failed:", response)
          toast({
            title: "Submission failed",
            description: response.message || `Error ${httpResponse.status}: Failed to submit complaint.`,
            variant: "destructive",
            duration: 8000,
          })
          setIsLoading(false)
          setIsSubmitting(false)
          return
        }

        if (response.referenceNumber) {
          toast({
            title: "✅ Success!",
            description: `Complaint submitted! Reference ID: ${response.referenceNumber}`,
            duration: 8000,
          })
          // Don't set isLoading to false here
          setTimeout(() => {
            router.push(`/submission-success?ref=${response.referenceNumber}`)
          }, 3000)
        } else if (response.message) {
          toast({
            title: "Error",
            description: response.message,
            variant: "destructive",
          })
          setIsLoading(false)
          setIsSubmitting(false)
        }

        setState(response)
      } catch (error) {
        console.error("Error submitting complaint:", error)
        toast({
          title: "Network error",
          description: "An unexpected error occurred. Please try again later.",
          variant: "destructive",
        })
        setIsLoading(false)
        setIsSubmitting(false)
      }
    } catch (error) {
      console.error("Error during submission:", error)
      setIsLoading(false)
      setIsSubmitting(false)
      toast({
        title: "Submission error",
        description: "An error occurred while submitting your complaint. Please try again.",
        variant: "destructive",
      })
    }
  }

  const steps = [
    { number: 1, title: "Personal Info", icon: User },
    { number: 2, title: "Exam Details", icon: FileText },
    { number: 3, title: "Complaint", icon: AlertCircle },
    { number: 4, title: "Review", icon: CheckCircle },
  ]

  const [filePreview, setFilePreview] = useState<FilePreview | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Create preview URL
    const url = URL.createObjectURL(file)
    setFilePreview({
      url,
      type: file.type,
      name: file.name,
    })
  }

  useEffect(() => {
    return () => {
      // Cleanup preview URL when component unmounts
      if (filePreview) {
        URL.revokeObjectURL(filePreview.url)
      }
    }
  }, [filePreview])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20 p-0">
      <LoadingOverlay isLoading={isLoading} message="Submitting your complaint..." />
      <div className="w-full max-w-2xl sm:max-w-3xl md:max-w-4xl mx-auto px-2 sm:px-4 md:px-8 relative">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200/20 dark:bg-purple-800/10 rounded-full opacity-60 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200/20 dark:bg-blue-800/10 rounded-full opacity-40 animate-pulse delay-1000"></div>
        </div>

        <SubmitComplaintHeader steps={steps} currentStep={currentStep} />

        {/* Main Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="glass-effect border-0 shadow-2xl dark:bg-gray-800/50 w-full mx-auto">
            <CardHeader className="border-b border-white/20 dark:border-gray-700/20 bg-gradient-to-r from-white/50 to-white/30 dark:from-gray-800/50 dark:to-gray-800/30">
              <CardTitle className="text-xl font-semibold flex items-center text-gray-900 dark:text-gray-100">
                <FileText className="w-6 h-6 mr-3 text-purple-600 dark:text-purple-400" />
                Complaint Details
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Please fill out all required information accurately to ensure proper processing of your complaint.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-2 sm:p-4 md:p-6 lg:p-8">
              <form onSubmit={handleSubmit} className="space-y-8" encType="multipart/form-data">
                <PersonalInformationSection state={state} />
                <ExamInformationSection 
                  state={state} 
                  complaintType={complaintType} 
                  setComplaintType={setComplaintType} 
                />
                <ComplaintDetailsSection 
                  state={state} 
                  filePreview={filePreview} 
                  handleFileChange={handleFileChange} 
                />
                <SubmitButtonSection isSubmitting={isSubmitting} />
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      <Toaster />
    </div>
  )
}
