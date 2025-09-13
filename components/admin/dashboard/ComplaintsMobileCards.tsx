import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FileText } from "lucide-react";
import { motion } from "framer-motion";
import React from "react";
import { ComplaintComponentProps } from "@/app/types/admin";

export function ComplaintsMobileCards({ complaints, getStatusBadge }: ComplaintComponentProps) {
  if (!complaints.length) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-gray-400 dark:text-gray-500" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">No complaints found</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          No complaints match your search criteria.
        </p>
      </div>
    );
  }
  return (
    <div className="space-y-3">
      {complaints.map((complaint, index: number) => (
        <motion.div
          key={complaint.referenceNumber}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <Card className="glass-effect border border-gray-200 dark:border-gray-700 shadow-sm dark:bg-gray-800/30">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-sm font-medium text-purple-600 dark:text-purple-400 truncate">
                    {complaint.referenceNumber}
                  </p>
                  <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                    {complaint.student}
                  </p>
                </div>
                <div className="ml-2 flex-shrink-0">{getStatusBadge(complaint.status)}</div>
              </div>
              <div className="space-y-2 mb-3">
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                  <span className="font-medium">Exam:</span> {complaint.examName}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Course:</span> {complaint.course || "N/A"}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Date:</span>{" "}
                  {complaint.createdAt
                    ? new Date(complaint.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "N/A"}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Type:</span> {complaint.type}
                </p>
              </div>
              <Link href={`/admin/complaints/${complaint.id}`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300 dark:border-purple-700 dark:text-purple-400 dark:hover:bg-purple-900/20 text-sm"
                >
                  View Details
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
