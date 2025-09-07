import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { motion } from "framer-motion";
import type { Complaint } from "@/app/types";
import React from "react";

interface StatusTimelineCardProps {
  statusHistory: Complaint["statusHistory"];
}

export function StatusTimelineCard({ statusHistory }: StatusTimelineCardProps) {
  return (
    <Card className="glass-effect border-0 shadow-xl">
      <CardHeader className="border-b border-white/20 dark:border-gray-700/20 bg-gradient-to-r from-white/50 to-white/30 dark:from-gray-800/50 dark:to-gray-800/30">
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          Status History
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">Track status changes throughout the complaint lifecycle</CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        {statusHistory && statusHistory.length > 0 ? (
          <div className="relative">
            <div className="absolute top-0 bottom-0 left-4 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
            <div className="space-y-8">
              {statusHistory.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="relative pl-8"
                >
                  <div className="absolute left-0 w-8 flex items-center justify-center">
                    <div className={`w-2.5 h-2.5 rounded-full ${
                      event.new_status === 'pending' ? 'bg-amber-500' :
                      event.new_status === 'under-review' ? 'bg-blue-500' :
                      'bg-green-500'
                    }`}></div>
                  </div>
                  <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400">{event.formatted_date}</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100 mt-1">
                      Status changed to <span className="font-semibold capitalize">{event.new_status}</span>
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Changed by {event.changed_by_name}
                    </p>
                    {event.notes && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 italic">
                        "{event.notes}"
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No status changes yet</h3>
            <p className="text-gray-600 dark:text-gray-400">Status history will appear here when changes are made.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
