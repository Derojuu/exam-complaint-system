import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { FileText, Timer } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AnalyticsTablesProps {
  topExamTypes: any[];
  responseStats: any;
}

export default function AnalyticsTables({ topExamTypes, responseStats }: AnalyticsTablesProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Top Exam Types */}
      <Card className="glass-effect border-0 shadow-xl dark:bg-gray-800/50">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center text-gray-900 dark:text-gray-100">
            <FileText className="w-5 h-5 mr-2 text-red-600 dark:text-red-400" />
            Top Exam Types by Complaints
          </CardTitle>
          <CardDescription>Exams with the most complaints</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topExamTypes.slice(0, 5).map((exam, index) => (
              <div key={exam.exam_name} className="flex items-center justify-between p-3 bg-white/50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900/50 dark:to-pink-900/50 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-bold text-red-600 dark:text-red-400">#{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100 truncate max-w-40">
                      {exam.exam_name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Avg resolution: {exam.avg_resolution_time ? Math.round(exam.avg_resolution_time) : 0} days
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                  {exam.complaint_count} complaints
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      {/* Response Statistics */}
      <Card className="glass-effect border-0 shadow-xl dark:bg-gray-800/50">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center text-gray-900 dark:text-gray-100">
            <Timer className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" />
            Response Statistics
          </CardTitle>
          <CardDescription>Admin response performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-gray-700/50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">Complaints with Responses</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total complaints that received responses</p>
              </div>
              <Badge className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300">
                {responseStats.complaints_with_responses}
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-gray-700/50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">Total Responses</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">All responses sent by admins</p>
              </div>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">
                {responseStats.total_responses}
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-gray-700/50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">Avg First Response Time</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Time to first admin response</p>
              </div>
              <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300">
                {responseStats.avg_first_response_time ? Math.round(responseStats.avg_first_response_time) : 0} days
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
