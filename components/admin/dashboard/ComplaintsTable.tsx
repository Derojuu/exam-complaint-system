import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FileText } from "lucide-react";
import { motion } from "framer-motion";
import React from "react";
import { ComplaintComponentProps } from "@/app/types/admin";

export function ComplaintsTable({ complaints, getStatusBadge }: ComplaintComponentProps) {
  if (!complaints.length) {
    return (
      <TableRow>
        <TableCell colSpan={8} className="text-center py-8 sm:py-12">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <FileText className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
                No complaints found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                No complaints match your search criteria. Try adjusting your filters.
              </p>
            </div>
          </div>
        </TableCell>
      </TableRow>
    );
  }
  return (
    <>
      {complaints.map((complaint, index: number) => (
        <motion.tr
          key={complaint.referenceNumber}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          className="border-b border-gray-100 dark:border-gray-700 hover:bg-white/70 dark:hover:bg-gray-800/50 transition-colors"
        >
          <TableCell className="font-medium font-mono text-sm text-gray-900 dark:text-gray-100">
            {complaint.referenceNumber}
          </TableCell>
          <TableCell className="font-medium text-sm text-gray-900 dark:text-gray-100">
            {complaint.student}
          </TableCell>
          <TableCell className="hidden lg:table-cell text-sm text-gray-700 dark:text-gray-300">
            {complaint.examName}
          </TableCell>
          <TableCell className="hidden lg:table-cell text-sm text-gray-700 dark:text-gray-300">
            {complaint.course || "N/A"}
          </TableCell>
          <TableCell className="hidden lg:table-cell text-sm text-gray-700 dark:text-gray-300">
            {complaint.createdAt
              ? new Date(complaint.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "N/A"}
          </TableCell>
          <TableCell className="hidden md:table-cell text-sm">
            <span className="text-sm text-gray-600 dark:text-gray-400">{complaint.type}</span>
          </TableCell>
          <TableCell className="text-sm">{getStatusBadge(complaint.status)}</TableCell>
          <TableCell className="text-right text-sm">
            <Link href={`/admin/complaints/${complaint.id}`}>
              <Button
                variant="outline"
                size="sm"
                className="border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300 dark:border-purple-700 dark:text-purple-400 dark:hover:bg-purple-900/20 text-xs sm:text-sm"
              >
                View
              </Button>
            </Link>
          </TableCell>
        </motion.tr>
      ))}
    </>
  );
}
