import Link from "next/link";
import { ArrowLeft, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { NotificationDropdown } from "@/components/notification-dropdown";

interface ComplaintHeaderProps {
  referenceNumber: string;
}

export function ComplaintHeader({ referenceNumber }: ComplaintHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-4 sm:hidden">
            <NotificationDropdown apiUrl="/api/notifications" />
            <ThemeToggle />
          </div>
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100">Complaint Details</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Review and manage student complaint</p>
        </div>
      </div>
      <div className="hidden sm:flex items-center gap-3">
        <NotificationDropdown apiUrl="/api/notifications" />
        <ThemeToggle />
        <Link href="/admin/profile">
          <Button
            variant="outline"
            className="border-purple-200 dark:border-purple-700 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20"
          >
            <User className="w-4 h-4 mr-2" />
            View Profile
          </Button>
        </Link>
      </div>
    </div>
  );
}
