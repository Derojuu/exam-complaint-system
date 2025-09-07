import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, FileText, Search, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-12 sm:py-16 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl lg:text-7xl font-bold leading-tight">
                Exam Complaint
                <span className="text-gradient block">System</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-lg">
                An Efficient Platform for Submitting and Tracking Exam Complaints with Transparency and
                Accountability.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/login">
                <Button size="lg" className="btn-gradient w-full sm:w-auto h-10 sm:h-12 text-sm sm:text-base">
                  Submit Complaint
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-2 h-10 sm:h-12 text-sm sm:text-base dark:border-gray-700 dark:text-gray-200 bg-white/70 dark:bg-gray-800/70 hover:bg-white/90 dark:hover:bg-gray-700/80 transition-colors"
                >
                  Track Status
                </Button>
              </Link>
            </div>

            <div className="flex items-center space-x-4 sm:space-x-8 pt-6 sm:pt-8">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">500+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Complaints Resolved</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">24h</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Average Response</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">98%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Satisfaction Rate</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10 glass-effect rounded-3xl p-8 shadow-2xl dark:bg-gray-900/70">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold dark:text-gray-100">Quick Actions</h3>
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-xl">
                    <FileText className="w-5 h-5 text-purple-600" />
                    <span className="font-medium dark:text-gray-100">Submit New Complaint</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-xl">
                    <Search className="w-5 h-5 text-blue-600" />
                    <span className="font-medium dark:text-gray-100">Track Existing Complaint</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-xl">
                    <Users className="w-5 h-5 text-green-600" />
                    <span className="font-medium dark:text-gray-100">Admin Dashboard</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-purple-200 dark:bg-purple-800/30 rounded-full opacity-60 animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-blue-200 dark:bg-blue-800/30 rounded-full opacity-40 animate-pulse delay-1000"></div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
