"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Plus, Edit3, Trash2, X, Save } from "lucide-react"

interface ComplaintCategory {
  id: string
  name: string
  description: string
  isActive: boolean
}

interface ComplaintCategoriesTabProps {
  categories: ComplaintCategory[]
  newCategory: { name: string; description: string }
  setNewCategory: (category: { name: string; description: string }) => void
  editingCategory: string | null
  setEditingCategory: (id: string | null) => void
  saving: boolean
  onCreateCategory: () => void
  onUpdateCategory: (id: string, data: { name: string; description: string }) => void
  onDeleteCategory: (id: string) => void
}

export function ComplaintCategoriesTab({
  categories,
  newCategory,
  setNewCategory,
  editingCategory,
  setEditingCategory,
  saving,
  onCreateCategory,
  onUpdateCategory,
  onDeleteCategory
}: ComplaintCategoriesTabProps) {
  const [editData, setEditData] = useState<{ name: string; description: string }>({ name: "", description: "" })

  const handleEdit = (category: ComplaintCategory) => {
    setEditingCategory(category.id)
    setEditData({ name: category.name, description: category.description })
  }

  const handleSaveEdit = () => {
    if (editingCategory) {
      onUpdateCategory(editingCategory, editData)
      setEditingCategory(null)
    }
  }

  const handleCancelEdit = () => {
    setEditingCategory(null)
    setEditData({ name: "", description: "" })
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="space-y-1">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
          Complaint Categories
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Manage the types of complaints students can submit
        </p>
      </div>

      <Separator className="bg-gray-200 dark:bg-gray-700" />

      {/* Add New Category */}
      <Card className="bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold flex items-center text-gray-900 dark:text-gray-100">
            <Plus className="w-4 h-4 mr-2 text-purple-600 dark:text-purple-400" />
            Add New Category
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="categoryName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Category Name
              </Label>
              <Input
                id="categoryName"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                placeholder="e.g., Academic Issues"
                className="h-10 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:border-purple-500 focus:ring-purple-500/20 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="categoryDescription" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </Label>
              <Input
                id="categoryDescription"
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                placeholder="Brief description of this category"
                className="h-10 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:border-purple-500 focus:ring-purple-500/20 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
          </div>
          <Button
            onClick={onCreateCategory}
            disabled={saving || !newCategory.name.trim()}
            className="btn-gradient w-full sm:w-auto"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Creating...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Add Category
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Existing Categories */}
      <div className="space-y-4">
        {categories.map((category) => (
          <Card key={category.id} className="bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
            <CardContent className="p-3 sm:p-4">
              {editingCategory === category.id ? (
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Name</Label>
                      <Input
                        value={editData.name}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        className="h-9 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</Label>
                      <Input
                        value={editData.description}
                        onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                        className="h-9 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSaveEdit} size="sm" className="btn-gradient">
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button onClick={handleCancelEdit} variant="outline" size="sm">
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 truncate">{category.name}</h4>
                      <Badge
                        className={
                          category.isActive
                            ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-700 text-xs"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-600 text-xs"
                        }
                      >
                        {category.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{category.description}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      onClick={() => handleEdit(category)}
                      variant="outline"
                      size="sm"
                      className="border-purple-200 dark:border-purple-700 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 h-8 w-8 p-0"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => onDeleteCategory(category.id)}
                      variant="outline"
                      size="sm"
                      disabled={saving}
                      className="border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 h-8 w-8 p-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
