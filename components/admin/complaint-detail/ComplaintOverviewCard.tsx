import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar, User, Mail, GraduationCap, School, AlertCircle, MessageSquare, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Complaint } from "@/app/types";
import React from "react";

interface ComplaintOverviewCardProps {
  complaint: Complaint;
  status: string;
  getStatusBadge: (status: string) => React.ReactNode;
  handleUpdateStatus: (value: string) => void;
}

export function ComplaintOverviewCard({ complaint, status, getStatusBadge, handleUpdateStatus }: ComplaintOverviewCardProps) {
  return (
    <Card className="glass-effect border-0 shadow-xl overflow-hidden">
      <CardHeader className="border-b border-white/20 dark:border-gray-700/20 bg-gradient-to-r from-white/50 to-white/30 dark:from-gray-800/50 dark:to-gray-800/30">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <CardTitle className="text-xl sm:text-2xl font-bold flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-800 dark:to-blue-800 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              Complaint {complaint.referenceNumber}
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Submitted on {complaint.createdAt
                ? new Date(complaint.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : "N/A"}
            </CardDescription>
          </div>
          <div className="flex items-center gap-3">
            {getStatusBadge(status)}
            <Select value={status} onValueChange={handleUpdateStatus}>
              <SelectTrigger className="w-[180px] h-10 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700">
                <SelectValue placeholder="Update Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="under-review">Under Review</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 lg:p-8">
        <div className="space-y-8">
          {/* Student Information */}
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Student Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-start gap-3 p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
                <User className="h-5 w-5 text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Student Name</p>
                  <p className="text-gray-900 dark:text-gray-100 font-medium break-words">{complaint.fullName}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
                <User className="h-5 w-5 text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Student ID</p>
                  <p className="text-gray-900 dark:text-gray-100 font-medium break-words">{complaint.studentId}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
                <Mail className="h-5 w-5 text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
                  <p className="text-gray-900 dark:text-gray-100 break-all">{complaint.email}</p>
                  {complaint.phone && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{complaint.phone}</p>
                  )}
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
                <GraduationCap className="h-5 w-5 text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Department</p>
                  <p className="text-gray-900 dark:text-gray-100 break-words">
                    {complaint.userDepartment || 'Not specified'}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <Separator className="bg-gray-200 dark:bg-gray-700" />
          {/* Exam Information */}
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <School className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Exam Information
            </h3>
            <div className="space-y-6">
              {/* Exam Name - Full Width Row */}
              <div className="flex items-start gap-3 p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
                <FileText className="h-5 w-5 text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Exam Name</p>
                  <p className="text-gray-900 dark:text-gray-100 font-medium break-words">{complaint.examName}</p>
                </div>
              </div>
              {/* Other Fields - Second Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="flex items-start gap-3 p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
                  <School className="h-5 w-5 text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Course Code</p>
                    <p className="text-gray-900 dark:text-gray-100 font-medium break-words">{complaint.course || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
                  <Calendar className="h-5 w-5 text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Exam Date</p>
                    <p className="text-gray-900 dark:text-gray-100 break-words">
                      {complaint.examDate
                        ? new Date(complaint.examDate).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
                  <AlertCircle className="h-5 w-5 text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Complaint Type</p>
                    <p className="text-gray-900 dark:text-gray-100 break-words capitalize">{complaint.complaintType}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Separator className="bg-gray-200 dark:bg-gray-700" />
          {/* Complaint Details */}
          <div className="space-y-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-red-600 dark:text-red-400" />
              Complaint Details
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-3 text-gray-900 dark:text-gray-100">Description</h4>
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 p-6 rounded-xl border border-gray-200 dark:border-gray-600">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{complaint.description}</p>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-3 text-gray-900 dark:text-gray-100">Desired Resolution</h4>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 p-6 rounded-xl border border-blue-200 dark:border-blue-700">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{complaint.desiredResolution}</p>
                </div>
              </div>
              {complaint.evidenceFile && (
                <div>
                  <h4 className="font-medium mb-3 text-gray-900 dark:text-gray-100">Supporting Evidence</h4>
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 p-4 sm:p-6 rounded-xl border border-purple-200 dark:border-purple-700">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 dark:text-gray-100 text-sm sm:text-base">Evidence File</p>
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Evidence file attached</p>
                        </div>
                      </div>
                      <div className="flex gap-2 w-full sm:w-auto">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(complaint.evidenceFile, '_blank')}
                          className="border-purple-200 dark:border-purple-700 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 flex-1 sm:flex-none text-xs sm:text-sm"
                        >
                          <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const evidenceUrl = complaint.evidenceFile
                            if (evidenceUrl) {
                              const link = document.createElement('a')
                              link.href = evidenceUrl
                              link.download = 'evidence-file'
                              link.click()
                            }
                          }}
                          className="border-purple-200 dark:border-purple-700 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 flex-1 sm:flex-none text-xs sm:text-sm"
                        >
                          <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
