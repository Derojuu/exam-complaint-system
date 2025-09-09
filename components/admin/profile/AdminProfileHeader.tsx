import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Phone, Shield, BookOpen, Award } from "lucide-react"
import type { User as UserType } from "@/app/types/index"

interface AdminProfileHeaderProps {
  user: UserType | null
}

export function AdminProfileHeader({ user }: AdminProfileHeaderProps) {
  if (!user) return null

  return (
    <Card className="mb-6 sm:mb-8 border-0 shadow-lg glass-effect">
      <CardHeader className="text-center pb-4 sm:pb-6 px-4 sm:px-6">
        <div className="relative mx-auto w-20 h-20 sm:w-24 sm:h-24 mb-3 sm:mb-4">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
            {user.profilePicUrl ? (
              <img
                src={user.profilePicUrl}
                alt="Profile"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover"
              />
            ) : (
              <User className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
            )}
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full border-4 border-white dark:border-gray-800 flex items-center justify-center">
            <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
          </div>
        </div>
        <CardTitle className="text-xl sm:text-2xl font-bold text-gradient">
          {user.firstName} {user.lastName}
        </CardTitle>
        <CardDescription className="text-base sm:text-lg text-gray-600 dark:text-gray-300">
          System Administrator
        </CardDescription>
        <div className="flex flex-wrap justify-center gap-2 mt-3 sm:mt-4">
          <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 text-xs sm:text-sm">
            <Shield className="w-3 h-3 mr-1" />
            {user.role === "admin" ? "Administrator" : "Standard"}
          </Badge>
          {user.department && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 text-xs sm:text-sm">
              <BookOpen className="w-3 h-3 mr-1" />
              {user.department}
            </Badge>
          )}
          {user.position && (
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 text-xs sm:text-sm">
              <Award className="w-3 h-3 mr-1" />
              {user.position}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
        <div className="grid grid-cols-1 gap-3 sm:gap-4">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Email</p>
              <p className="font-medium text-sm sm:text-base truncate">{user.email}</p>
            </div>
          </div>
          {user.phone && (
            <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Phone</p>
                <p className="font-medium text-sm sm:text-base">{user.phone}</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
