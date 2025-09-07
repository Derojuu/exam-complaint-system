import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Calendar, AlertCircle } from "lucide-react";
import type { ComplaintFormState } from "@/app/actions/complaint-actions";

interface ExamInformationSectionProps {
  state: ComplaintFormState;
  complaintType: string;
  setComplaintType: (value: string) => void;
}

export default function ExamInformationSection({ state, complaintType, setComplaintType }: ExamInformationSectionProps) {
  return (
    <div className="space-y-6 border-t border-gray-200 dark:border-gray-700 pt-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 rounded-lg flex items-center justify-center">
          <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
          Exam Information
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="examName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Exam Name *
          </Label>
          <Input
            id="examName"
            name="examName"
            placeholder="Enter the exam name"
            required
            className="h-10 sm:h-12 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-purple-500/20 text-gray-900 dark:text-gray-100"
          />
          {state.errors?.examName && (
            <p className="text-sm text-red-500 dark:text-red-400 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {state.errors.examName[0]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="examDate" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Exam Date *
          </Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
            <Input
              id="examDate"
              name="examDate"
              type="date"
              required
              className="h-10 sm:h-12 pl-10 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-purple-500/20 text-gray-900 dark:text-gray-100"
            />
          </div>
          {state.errors?.examDate && (
            <p className="text-sm text-red-500 dark:text-red-400 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {state.errors.examDate[0]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="course" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Course Code
          </Label>
          <Input
            id="course"
            name="course"
            placeholder="e.g., CS101, MATH201"
            className="h-10 sm:h-12 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-purple-500/20 text-gray-900 dark:text-gray-100"
          />
          {state.errors?.course && (
            <p className="text-sm text-red-500 dark:text-red-400 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {state.errors.course[0]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="department" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Department
          </Label>
          <Input
            id="department"
            name="department"
            placeholder="e.g., Computer Science"
            className="h-10 sm:h-12 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-purple-500/20 text-gray-900 dark:text-gray-100"
          />
          {state.errors?.department && (
            <p className="text-sm text-red-500 dark:text-red-400 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {state.errors.department[0]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="faculty" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Faculty
          </Label>
          <Input
            id="faculty"
            name="faculty"
            placeholder="e.g., Engineering"
            className="h-10 sm:h-12 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-purple-500/20 text-gray-900 dark:text-gray-100"
          />
          {state.errors?.faculty && (
            <p className="text-sm text-red-500 dark:text-red-400 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {state.errors.faculty[0]}
            </p>
          )}
        </div>

        <div className="space-y-2 sm:col-span-1">
          <Label htmlFor="complaintType" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Complaint Type *
          </Label>
          <Select onValueChange={setComplaintType}>
            <SelectTrigger className="h-10 sm:h-12 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-purple-500/20 text-gray-900 dark:text-gray-100">
              <SelectValue placeholder="Select the type of complaint" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="grading">Grading Issue</SelectItem>
              <SelectItem value="technical">Technical Issue</SelectItem>
              <SelectItem value="content">Exam Content Issue</SelectItem>
              <SelectItem value="administration">Administration Issue</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          {state.errors?.complaintType && (
            <p className="text-sm text-red-500 dark:text-red-400 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {state.errors.complaintType[0]}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
