import { FileText } from "lucide-react"
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export function LoginCardHeader() {
  return (
    <CardHeader className="text-center space-y-3 pb-6 sm:space-y-4 sm:pb-8">
      <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
        <FileText className="w-8 h-8 text-white" />
      </div>
      <div>
        <CardTitle className="text-xl sm:text-2xl font-bold text-gradient">Welcome Back</CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400 mt-2">
          Sign in to access your exam complaint dashboard
        </CardDescription>
      </div>
    </CardHeader>
  )
}
