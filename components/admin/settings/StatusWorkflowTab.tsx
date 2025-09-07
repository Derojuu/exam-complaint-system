"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { GripVertical, Edit3, Trash2 } from "lucide-react"

interface StatusWorkflow {
  id: string
  name: string
  order: number
  color: string
  isActive: boolean
}

interface StatusWorkflowTabProps {
  statuses: StatusWorkflow[]
  onEditStatus?: (status: StatusWorkflow) => void
  onDeleteStatus?: (id: string) => void
}

export function StatusWorkflowTab({ statuses, onEditStatus, onDeleteStatus }: StatusWorkflowTabProps) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="space-y-1">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
          Status Workflow
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Configure the complaint status progression
        </p>
      </div>

      <Separator className="bg-gray-200 dark:bg-gray-700" />

      <div className="space-y-3 sm:space-y-4">
        {statuses
          .sort((a, b) => a.order - b.order)
          .map((status) => (
            <Card key={status.id} className="bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
              <CardContent className="p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                  <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <GripVertical className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">#{status.order}</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                      <div
                        className={`w-3 h-3 rounded-full bg-${status.color}-500 flex-shrink-0`}
                        style={{ backgroundColor: `var(--${status.color}-500)` }}
                      ></div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 truncate">{status.name}</h4>
                      <Badge
                        className={
                          status.isActive
                            ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-700 text-xs"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-600 text-xs"
                        }
                      >
                        {status.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      onClick={() => onEditStatus?.(status)}
                      variant="outline"
                      size="sm"
                      className="border-purple-200 dark:border-purple-700 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 h-8 w-8 p-0"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => onDeleteStatus?.(status.id)}
                      variant="outline"
                      size="sm"
                      className="border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 h-8 w-8 p-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  )
}
