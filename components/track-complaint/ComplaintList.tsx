import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, FileText, PlusCircle, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react";
import type { Complaint } from "@/app/types";

interface ComplaintListProps {
  complaints: Complaint[];
  getStatusBadge: (status: string) => React.ReactNode;
}

export default function ComplaintList({ complaints, getStatusBadge }: ComplaintListProps) {
  if (complaints.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="py-12 sm:py-16 text-center"
      >
        <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
          <FileText className="w-12 h-12 text-gray-400 dark:text-gray-500" />
        </div>
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No complaints found</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
          We couldn't find any complaints matching your criteria. Start by submitting your first complaint.
        </p>
        <Link href="/submit-complaint">
          <Button className="btn-gradient shadow-lg">
            <PlusCircle className="mr-2 h-4 w-4" />
            Submit Your First Complaint
          </Button>
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {complaints.map((complaint, index) => (
        <motion.div
          key={complaint.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
        >
          <Link href={`/complaints/${complaint.id}`}>
            <Card className="glass-effect border-0 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group dark:bg-gray-800/30">
              <CardContent className="p-3 sm:p-4 lg:p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-start justify-between">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {complaint.examName}
                      </h3>
                      {getStatusBadge(complaint.status)}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                        <span>
                          {complaint.examDate
                            ? new Date(complaint.examDate).toLocaleDateString("en-US", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })
                            : "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                        <span>{complaint.type || complaint.complaintType}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                        <span>{complaint.course || 'N/A'}</span>
                      </div>
                      {complaint.referenceNumber && (
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                          <span className="font-mono text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                            {complaint.referenceNumber}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300 dark:border-purple-700 dark:text-purple-400 dark:hover:bg-purple-900/20 transition-all"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
