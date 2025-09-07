import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ComplaintTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  totalCount: number;
  pendingCount: number;
  reviewCount: number;
  resolvedCount: number;
  children: React.ReactNode;
}

export default function ComplaintTabs({ 
  activeTab, 
  setActiveTab, 
  totalCount, 
  pendingCount, 
  reviewCount, 
  resolvedCount,
  children 
}: ComplaintTabsProps) {
  return (
    <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
      {/* Mobile: Dropdown Style */}
      <div className="block sm:hidden mb-6">
        <Select value={activeTab} onValueChange={setActiveTab}>
          <SelectTrigger className="w-full h-12 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Complaints ({totalCount})</SelectItem>
            <SelectItem value="pending">Pending ({pendingCount})</SelectItem>
            <SelectItem value="under-review">Under Review ({reviewCount})</SelectItem>
            <SelectItem value="resolved">Resolved ({resolvedCount})</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Desktop: Tab Style */}
      <TabsList className="hidden sm:grid grid-cols-4 mb-6 bg-gray-100/50 dark:bg-gray-800/50 p-1 rounded-xl h-12 w-full">
        <TabsTrigger
          value="all"
          className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm rounded-lg transition-all font-medium text-sm text-gray-700 dark:text-gray-300"
        >
          All ({totalCount})
        </TabsTrigger>
        <TabsTrigger
          value="pending"
          className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm rounded-lg transition-all font-medium text-sm text-gray-700 dark:text-gray-300"
        >
          Pending ({pendingCount})
        </TabsTrigger>
        <TabsTrigger
          value="under-review"
          className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm rounded-lg transition-all font-medium text-sm text-gray-700 dark:text-gray-300"
        >
          Review ({reviewCount})
        </TabsTrigger>
        <TabsTrigger
          value="resolved"
          className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm rounded-lg transition-all font-medium text-sm text-gray-700 dark:text-gray-300"
        >
          Resolved ({resolvedCount})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="all" className="space-y-4">
        {children}
      </TabsContent>
      <TabsContent value="pending" className="space-y-4">
        {children}
      </TabsContent>
      <TabsContent value="under-review" className="space-y-4">
        {children}
      </TabsContent>
      <TabsContent value="resolved" className="space-y-4">
        {children}
      </TabsContent>
    </Tabs>
  );
}
