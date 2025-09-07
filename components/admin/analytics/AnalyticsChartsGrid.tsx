import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { TrendingUp, PieChart, Clock, BarChart3 } from "lucide-react";
import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Area, PieChart as RechartsPieChart, Pie, Cell, BarChart, Bar, LineChart, Line, Legend } from "recharts";

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00', '#ff0000'];
const STATUS_COLORS = {
  pending: '#f59e0b',
  'under-review': '#3b82f6',
  resolved: '#10b981'
};

interface AnalyticsChartsGridProps {
  trendsData: any[];
  statusChartData: any[];
  typeChartData: any[];
  hourlyData: any[];
}

export default function AnalyticsChartsGrid({ trendsData, statusChartData, typeChartData, hourlyData }: AnalyticsChartsGridProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Complaint Trends */}
      <Card className="glass-effect border-0 shadow-xl dark:bg-gray-800/50">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center text-gray-900 dark:text-gray-100">
            <TrendingUp className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
            Complaint Trends
          </CardTitle>
          <CardDescription>Daily complaint submissions over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={trendsData}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="count" 
                stroke="#8884d8" 
                fillOpacity={1} 
                fill="url(#colorTotal)" 
                name="Total Complaints"
                key="area-total-complaints"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      {/* Status Distribution */}
      <Card className="glass-effect border-0 shadow-xl dark:bg-gray-800/50">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center text-gray-900 dark:text-gray-100">
            <PieChart className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
            Status Distribution
          </CardTitle>
          <CardDescription>Current complaint status breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={statusChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name} (${percentage}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                key="status-pie-chart"
              >
                {statusChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </RechartsPieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      {/* Hourly Distribution */}
      <Card className="glass-effect border-0 shadow-xl dark:bg-gray-800/50">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center text-gray-900 dark:text-gray-100">
            <Clock className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
            Activity by Hour
          </CardTitle>
          <CardDescription>When complaints are submitted most frequently</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#10b981" key="hourly-count-bar" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      {/* Type Distribution */}
      <Card className="glass-effect border-0 shadow-xl dark:bg-gray-800/50">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center text-gray-900 dark:text-gray-100">
            <BarChart3 className="w-5 h-5 mr-2 text-amber-600 dark:text-amber-400" />
            Complaint Types
          </CardTitle>
          <CardDescription>Distribution of complaint categories</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={typeChartData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={80} />
              <Tooltip />
              <Bar dataKey="value" fill="#f59e0b" key="type-value-bar" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
