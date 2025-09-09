import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, Shield } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export function AdminRegisterHeader() {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/login"
          className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Login
        </Link>
        <ThemeToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
      </motion.div>
    </>
  )
}
