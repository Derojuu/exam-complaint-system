import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { MessageSquare, User } from "lucide-react";
import { motion } from "framer-motion";
import type { Complaint } from "@/app/types";
import React from "react";

interface ResponseHistoryCardProps {
  responses: Complaint["responses"];
}

export function ResponseHistoryCard({ responses }: ResponseHistoryCardProps) {
  return (
    <Card className="glass-effect border-0 shadow-xl">
      <CardHeader className="border-b border-white/20 dark:border-gray-700/20 bg-gradient-to-r from-white/50 to-white/30 dark:from-gray-800/50 dark:to-gray-800/30">
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          Response History
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">All responses and communications for this complaint</CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        {responses && responses.length > 0 ? (
          <div className="space-y-4">
            {responses.map((resp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-gradient-to-r from-white/70 to-white/50 dark:from-gray-800/70 dark:to-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-800 dark:to-emerald-800 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{resp.author}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{resp.date}</p>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{resp.text}</p>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No responses yet</h3>
            <p className="text-gray-600 dark:text-gray-400">Be the first to respond to this complaint.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
