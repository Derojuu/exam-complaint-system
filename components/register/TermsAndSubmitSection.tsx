"use client"

import Link from "next/link"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

interface TermsAndSubmitSectionProps {
  isLoading: boolean
}

export function TermsAndSubmitSection({ isLoading }: TermsAndSubmitSectionProps) {
  return (
    <>
      {/* Terms and Conditions */}
      <div className="flex items-start space-x-3 pt-4">
        <Checkbox id="terms" required className="mt-1" />
        <Label htmlFor="terms" className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          I agree to the{" "}
          <Link
            href="/terms"
            className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 font-medium transition-colors"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 font-medium transition-colors"
          >
            Privacy Policy
          </Link>
        </Label>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full h-10 sm:h-12 btn-gradient text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
            Creating Account...
          </>
        ) : (
          <>
            <CheckCircle className="w-5 h-5 mr-3" />
            Create Account
          </>
        )}
      </Button>
    </>
  )
}
