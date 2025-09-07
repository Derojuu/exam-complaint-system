import { Card, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";
import React from "react";

interface AdminRoleInfoCardProps {
  user: {
    position?: string;
    department?: string;
    faculty?: string;
    courses?: string;
  } | null;
}

export function AdminRoleInfoCard({ user }: AdminRoleInfoCardProps) {
  if (!user || (!user.position && !user.department && !user.faculty && !user.courses)) return null;
  return (
    <Card className="glass-effect border-0 shadow-lg dark:bg-gray-800/50 mb-6">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 rounded-lg flex items-center justify-center">
            <User className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Your Access Level</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {user.position === 'lecturer' && 'You can view complaints for your assigned courses'}
              {user.position === 'hod' && 'You can view complaints for your department'}
              {user.position === 'dean' && 'You can view complaints for your faculty'}
              {(user.position === 'admin' || user.position === 'system-administrator') && 'You can view all complaints'}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div className="bg-white/50 dark:bg-gray-700/50 rounded-lg p-3">
            <p className="font-medium text-gray-700 dark:text-gray-300">Position</p>
            <p className="text-gray-900 dark:text-gray-100 capitalize">{user.position || 'Not specified'}</p>
          </div>
          {user.department && (
            <div className="bg-white/50 dark:bg-gray-700/50 rounded-lg p-3">
              <p className="font-medium text-gray-700 dark:text-gray-300">Department</p>
              <p className="text-gray-900 dark:text-gray-100">{user.department}</p>
            </div>
          )}
          {user.faculty && (
            <div className="bg-white/50 dark:bg-gray-700/50 rounded-lg p-3">
              <p className="font-medium text-gray-700 dark:text-gray-300">Faculty</p>
              <p className="text-gray-900 dark:text-gray-100">{user.faculty}</p>
            </div>
          )}
          {user.courses && (
            <div className="bg-white/50 dark:bg-gray-700/50 rounded-lg p-3">
              <p className="font-medium text-gray-700 dark:text-gray-300">Courses</p>
              <p className="text-gray-900 dark:text-gray-100">{user.courses}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
