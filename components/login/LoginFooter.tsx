import Link from "next/link"

interface LoginFooterProps {
  activeTab: "student" | "admin"
}

export function LoginFooter({ activeTab }: LoginFooterProps) {
  return (
    <div className="px-6 pb-6">
      <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{" "}
          <Link
            href={activeTab === "student" ? "/register" : "/register/admin"}
            className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 font-medium transition-colors"
          >
            Create one here
          </Link>
        </p>
      </div>
    </div>
  )
}
