import { Card, CardContent } from "@/components/ui/card";
import { FileText, Activity, CheckCircle2, Timer } from "lucide-react";
import React from "react";

interface AnalyticsSummaryCardsProps {
  summary: any;
  resolutionTimes: any;
}

export default function AnalyticsSummaryCards({ summary, resolutionTimes }: AnalyticsSummaryCardsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
      <Card className="glass-effect border-0 shadow-lg card-hover dark:bg-gray-800/50">
        <CardContent className="p-3 sm:p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">Total Complaints</p>
              <p className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                {summary.totalComplaints || 0}
              </p>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/50 dark:to-blue-900/50 rounded-lg lg:rounded-xl flex items-center justify-center flex-shrink-0">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="glass-effect border-0 shadow-lg card-hover dark:bg-gray-800/50">
        <CardContent className="p-3 sm:p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">Avg Daily</p>
              <p className="text-lg sm:text-2xl lg:text-3xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                {summary.avgDailyComplaints && typeof summary.avgDailyComplaints === 'number' 
                  ? (summary.avgDailyComplaints as number).toFixed(1) 
                  : '0.0'}
              </p>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 rounded-lg lg:rounded-xl flex items-center justify-between flex-shrink-0">
              <Activity className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="glass-effect border-0 shadow-lg card-hover dark:bg-gray-800/50">
        <CardContent className="p-3 sm:p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">Resolution Rate</p>
              <p className="text-lg sm:text-2xl lg:text-3xl font-bold text-green-600 dark:text-green-400 mt-1">
                {summary.resolutionRate && typeof summary.resolutionRate === 'number' 
                  ? summary.resolutionRate.toFixed(1) 
                  : '0.0'}%
              </p>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 rounded-lg lg:rounded-xl flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="glass-effect border-0 shadow-lg card-hover dark:bg-gray-800/50">
        <CardContent className="p-3 sm:p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">Avg Resolution</p>
              <p className="text-lg sm:text-2xl lg:text-3xl font-bold text-amber-600 dark:text-amber-400 mt-1">
                {resolutionTimes.avg_resolution_days ? Math.round(resolutionTimes.avg_resolution_days) : 0}d
              </p>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/50 dark:to-orange-900/50 rounded-lg lg:rounded-xl flex items-center justify-center flex-shrink-0">
              <Timer className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
