import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { User, Mail, Phone, AlertCircle } from "lucide-react";
import type { ComplaintFormState } from "@/app/actions/complaint-actions";

interface PersonalInformationSectionProps {
  state: ComplaintFormState;
}

export default function PersonalInformationSection({ state }: PersonalInformationSectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/50 dark:to-blue-900/50 rounded-lg flex items-center justify-center">
          <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        </div>
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
          Personal Information
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Full Name *
          </Label>
          <Input
            id="fullName"
            name="fullName"
            placeholder="Enter your full name"
            required
            className="h-10 sm:h-12 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-purple-500/20 text-gray-900 dark:text-gray-100"
          />
          {state.errors?.fullName && (
            <p className="text-sm text-red-500 dark:text-red-400 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {state.errors.fullName[0]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="studentId" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Student ID *
          </Label>
          <Input
            id="studentId"
            name="studentId"
            placeholder="Enter your student ID"
            required
            className="h-10 sm:h-12 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-purple-500/20 text-gray-900 dark:text-gray-100"
          />
          {state.errors?.studentId && (
            <p className="text-sm text-red-500 dark:text-red-400 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {state.errors.studentId[0]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Email Address *
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              required
              className="h-10 sm:h-12 pl-10 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-purple-500/20 text-gray-900 dark:text-gray-100"
            />
          </div>
          {state.errors?.email && (
            <p className="text-sm text-red-500 dark:text-red-400 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {state.errors.email[0]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Phone Number
          </Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="Enter your phone number (optional)"
              className="h-10 sm:h-12 pl-10 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-purple-500/20 text-gray-900 dark:text-gray-100"
            />
          </div>
          {state.errors?.phone && (
            <p className="text-sm text-red-500 dark:text-red-400 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {state.errors.phone[0]}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
