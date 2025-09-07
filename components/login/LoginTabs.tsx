import { Shield, Users } from "lucide-react"
import { TabsList, TabsTrigger } from "@/components/ui/tabs"

export function LoginTabs() {
  return (
    <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-100/50 dark:bg-gray-800/50 p-1 rounded-xl">
      <TabsTrigger
        value="student"
        id="login-tab-student"
        className="flex items-center space-x-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm rounded-lg transition-all text-gray-700 dark:text-gray-300"
      >
        <Users className="w-4 h-4" />
        <span>Student</span>
      </TabsTrigger>
      <TabsTrigger
        value="admin"
        id="login-tab-admin"
        className="flex items-center space-x-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm rounded-lg transition-all text-gray-700 dark:text-gray-300"
      >
        <Shield className="w-4 h-4" />
        <span>Admin</span>
      </TabsTrigger>
    </TabsList>
  )
}
