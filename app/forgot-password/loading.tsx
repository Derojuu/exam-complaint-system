export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20 relative flex items-center justify-center">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200/20 dark:bg-purple-800/10 rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200/20 dark:bg-blue-800/10 rounded-full opacity-40 animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-md w-full mx-4 relative z-10">
        <div className="glass-effect border-0 shadow-xl rounded-xl overflow-hidden">
          {/* Header */}
          <div className="border-b border-white/20 dark:border-gray-700/20 bg-gradient-to-r from-white/50 to-white/30 dark:from-gray-800/50 dark:to-gray-800/30 p-6 text-center">
            <div className="w-40 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mx-auto mb-2"></div>
            <div className="w-56 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mx-auto"></div>
          </div>
          
          {/* Form */}
          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="w-full h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
            <div className="w-full h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="text-center">
              <div className="w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
