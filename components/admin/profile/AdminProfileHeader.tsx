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
    <Card className="mb-8 border-0 shadow-lg glass-effect">
      <CardHeader className="text-center pb-6">
        <div className="relative mx-auto w-24 h-24 mb-4">
          <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
            {user.profilePicUrl ? (
              <img
                src={user.profilePicUrl}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <User className="w-12 h-12 text-white" />
            )}
          </div>
          <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-4 border-white dark:border-gray-800 flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-gradient">
          {user.firstName} {user.lastName}
        </CardTitle>
        <CardDescription className="text-lg text-gray-600 dark:text-gray-300">
          System Administrator
        </CardDescription>
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
            <Shield className="w-3 h-3 mr-1" />
            {user.role === "admin" ? "Administrator" : "Standard"}
          </Badge>
          {user.department && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
              <BookOpen className="w-3 h-3 mr-1" />
              {user.department}
            </Badge>
          )}
          {user.position && (
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
              <Award className="w-3 h-3 mr-1" />
              {user.position}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <Mail className="w-5 h-5 text-purple-600" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>
          </div>
          {user.phone && (
            <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <Phone className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
                <p className="font-medium">{user.phone}</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
