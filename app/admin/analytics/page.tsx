"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import { toast } from "@/hooks/use-toast"
import { format, subDays } from 'date-fns'
import { AdminSidebar, AdminSidebarRef } from "@/components/admin-sidebar"
import { LoadingOverlay } from "@/components/loading-overlay"
import AnalyticsHeader from "@/components/admin/analytics/AnalyticsHeader"
import AnalyticsFilters from "@/components/admin/analytics/AnalyticsFilters"
import AnalyticsSummaryCards from "@/components/admin/analytics/AnalyticsSummaryCards"
import AnalyticsChartsGrid from "@/components/admin/analytics/AnalyticsChartsGrid"
import AnalyticsDetailedTrends from "@/components/admin/analytics/AnalyticsDetailedTrends"
import AnalyticsTables from "@/components/admin/analytics/AnalyticsTables"
import type { User as UserType } from "@/app/types/index"

interface AnalyticsData {
  trends: Array<{
    date: string;
    count: number;
    pending: number;
    under_review: number;
    resolved: number;
  }>;
  statusDistribution: Array<{
    status: string;
    count: number;
    percentage: number;
  }>;
  typeDistribution: Array<{
    type: string;
    count: number;
    percentage: number;
  }>;
  resolutionTimes: {
    avg_resolution_days: number;
    min_resolution_days: number;
    max_resolution_days: number;
  };
  monthlyComparison: Array<{
    month: number;
    year: number;
    count: number;
  }>;
  hourlyDistribution: Array<{
    hour: number;
    count: number;
  }>;
  topExamTypes: Array<{
    exam_name: string;
    complaint_count: number;
    avg_resolution_time: number;
  }>;
  responseStats: {
    complaints_with_responses: number;
    total_responses: number;
    avg_first_response_time: number;
  };
  summary: {
    totalComplaints: number;
    avgDailyComplaints: string;
    resolutionRate: number;
    pendingRate: number;
  };
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00', '#ff0000']
const STATUS_COLORS = {
  pending: '#f59e0b',
  'under-review': '#3b82f6',
  resolved: '#10b981'
}

export default function AdminAnalytics() {
  const router = useRouter();
  const adminSidebarRef = useRef<AdminSidebarRef>(null);
  const [user, setUser] = useState<UserType | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("30");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/check-auth", {
          credentials: "include",
        });
        if (!response.ok) throw new Error("Auth check failed");
        const data = await response.json();
        if (data.role !== "admin") {
          router.push("/profile");
          return;
        }
        setUser(data);
        fetchAnalytics();
      } catch (error) {
        console.error("Auth error:", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
    // eslint-disable-next-line
  }, [router, dateRange, statusFilter]);

  const fetchAnalytics = async () => {
    try {
      const params = new URLSearchParams();
      if (dateRange !== "all") {
        const endDate = new Date();
        const startDate = subDays(endDate, parseInt(dateRange));
        params.append('startDate', format(startDate, 'yyyy-MM-dd'));
        params.append('endDate', format(endDate, 'yyyy-MM-dd'));
      }
      if (statusFilter !== "all") {
        params.append('status', statusFilter);
      }
      const response = await fetch(`/api/admin/analytics?${params.toString()}`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch analytics");
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      toast({
        title: "Error",
        description: "Failed to load analytics data",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        window.location.href = "/login";
      } else {
        toast({
          title: "Logout failed",
          description: "An error occurred while logging out",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Logout failed",
        description: "An error occurred while logging out",
        variant: "destructive",
      });
    }
  };

  const handleExportData = () => {
    if (!analytics) return;
    const csvData = [
      ['Date', 'Total', 'Pending', 'Under Review', 'Resolved'],
      ...analytics.trends.map(day => [
        day.date,
        day.count,
        day.pending,
        day.under_review,
        day.resolved
      ])
    ];
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `complaint-analytics-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return <LoadingOverlay isLoading={true} message="Loading analytics dashboard..." />;
  }
  if (!user || user.role !== "admin") {
    return null;
  }
  if (!analytics) {
    return <LoadingOverlay isLoading={true} message="Loading analytics data..." />;
  }

  // Prepare chart data
  const trendsData = analytics.trends
    .filter((day: any) => day.date)
    .map((day: any, index: number) => ({
      ...day,
      date: format(new Date(day.date), 'MMM dd'),
      id: `trend-${day.date}-${index}`
    }));
  const statusChartData = analytics.statusDistribution
    .filter((item: any) => item.status && item.status.trim() !== '')
    .map((item: any, index: number) => ({
      name: item.status ? item.status.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) : `Unknown ${index + 1}`,
      value: item.count || 0,
      percentage: item.percentage || 0,
      id: `status-${item.status || 'unknown'}-${index}`
    }));
  const typeChartData = analytics.typeDistribution
    .filter((item: any) => item.type && item.type.trim() !== '')
    .map((item: any, index: number) => ({
      name: item.type ? item.type.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) : `Unknown ${index + 1}`,
      value: item.count || 0,
      percentage: item.percentage || 0,
      id: `type-${item.type || 'unknown'}-${index}`
    }));
  const hourlyData = analytics.hourlyDistribution
    .filter((item: any) => item.hour !== null && item.hour !== undefined)
    .map((item: any, index: number) => ({
      hour: `${item.hour}:00`,
      count: item.count || 0,
      id: `hour-${item.hour}-${index}`
    }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20 relative">
      <AdminSidebar ref={adminSidebarRef}>
        <div />
      </AdminSidebar>
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200/20 dark:bg-purple-800/10 rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200/20 dark:bg-blue-800/10 rounded-full opacity-40 animate-pulse delay-1000"></div>
      </div>
      <AnalyticsHeader adminSidebarRef={adminSidebarRef} handleLogout={handleLogout} />
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4 lg:py-8 relative z-10">
        <div className="mb-6">
          <AnalyticsFilters
            dateRange={dateRange}
            setDateRange={setDateRange}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            handleExportData={handleExportData}
          />
        </div>
        <AnalyticsSummaryCards summary={analytics.summary} resolutionTimes={analytics.resolutionTimes} />
        <AnalyticsChartsGrid
          trendsData={trendsData}
          statusChartData={statusChartData}
          typeChartData={typeChartData}
          hourlyData={hourlyData}
        />
        <AnalyticsDetailedTrends trendsData={trendsData} />
        <AnalyticsTables topExamTypes={analytics.topExamTypes} responseStats={analytics.responseStats} />
      </main>
    </div>
  );
}
