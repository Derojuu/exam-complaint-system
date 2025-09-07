import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Activity } from "lucide-react";
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from "recharts";

const STATUS_COLORS = {
  pending: '#f59e0b',
  'under-review': '#3b82f6',
  resolved: '#10b981'
};

interface AnalyticsDetailedTrendsProps {
  trendsData: any[];
}

export default function AnalyticsDetailedTrends({ trendsData }: AnalyticsDetailedTrendsProps) {
  return (
    <div className="mb-8">
      <Card className="glass-effect border-0 shadow-xl dark:bg-gray-800/50">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center text-gray-900 dark:text-gray-100">
            <Activity className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
            Detailed Status Trends
          </CardTitle>
          <CardDescription>Track how complaint statuses change over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={trendsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="pending" 
                stroke={STATUS_COLORS.pending} 
                strokeWidth={2}
                name="Pending"
                key="line-pending"
              />
              <Line 
                type="monotone" 
                dataKey="under_review" 
                stroke={STATUS_COLORS['under-review']} 
                strokeWidth={2}
                name="Under Review"
                key="line-under-review"
              />
              <Line 
                type="monotone" 
                dataKey="resolved" 
                stroke={STATUS_COLORS.resolved} 
                strokeWidth={2}
                name="Resolved"
                key="line-resolved"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
