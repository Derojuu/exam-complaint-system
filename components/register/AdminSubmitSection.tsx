import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Shield, AlertTriangle } from "lucide-react"

interface AdminSubmitSectionProps {
  isLoading: boolean
  agreeToTerms: boolean
  setAgreeToTerms: (agree: boolean) => void
}

export function AdminSubmitSection({ isLoading, agreeToTerms, setAgreeToTerms }: AdminSubmitSectionProps) {
  return (
    <div className="space-y-6">
      <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-purple-800 dark:text-purple-200">
            <p className="font-semibold mb-1">Administrator Account Notice</p>
            <p>
              You are registering for an administrator account with elevated privileges. 
              This account will have access to sensitive student data and system settings. 
              Please ensure all information is accurate and keep your credentials secure.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-start space-x-3">
        <Checkbox
          id="terms"
          checked={agreeToTerms}
          onCheckedChange={setAgreeToTerms}
          className="mt-1"
        />
        <Label htmlFor="terms" className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          I agree to the{" "}
          <a href="#" className="text-purple-600 dark:text-purple-400 hover:underline">
            Terms of Service
          </a>
          ,{" "}
          <a href="#" className="text-purple-600 dark:text-purple-400 hover:underline">
            Privacy Policy
          </a>
          , and{" "}
          <a href="#" className="text-purple-600 dark:text-purple-400 hover:underline">
            Administrator Code of Conduct
          </a>
          . I understand the responsibilities and obligations associated with administrative access.
        </Label>
      </div>

      <Button
        type="submit"
        disabled={isLoading || !agreeToTerms}
        className="w-full h-12 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium"
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            Creating Admin Account...
          </>
        ) : (
          <>
            <Shield className="w-5 h-5 mr-2" />
            Create Administrator Account
          </>
        )}
      </Button>
    </div>
  )
}
