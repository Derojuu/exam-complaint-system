import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Mail, Clock } from "lucide-react";
import React from "react";

export function QuickActionsCard() {
  return (
    <Card className="glass-effect border-0 shadow-xl">
      <CardHeader className="border-b border-white/20 dark:border-gray-700/20 bg-gradient-to-r from-white/50 to-white/30 dark:from-gray-800/50 dark:to-gray-800/30">
        <CardTitle className="text-lg text-gray-900 dark:text-gray-100">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        <Button
          variant="outline"
          className="w-full justify-start border-blue-200 dark:border-blue-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
        >
          <FileText className="w-4 h-4 mr-2" />
          Export Details
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start border-green-200 dark:border-green-700 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20"
        >
          <Mail className="w-4 h-4 mr-2" />
          Email Student
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start border-purple-200 dark:border-purple-700 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20"
        >
          <Clock className="w-4 h-4 mr-2" />
          Set Reminder
        </Button>
      </CardContent>
    </Card>
  );
}
