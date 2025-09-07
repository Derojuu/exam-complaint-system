import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, CheckCircle } from "lucide-react";
import type { ComplaintFormState } from "@/app/actions/complaint-actions";

type FilePreview = {
  url: string;
  type: string;
  name: string;
};

interface ComplaintDetailsSectionProps {
  state: ComplaintFormState;
  filePreview: FilePreview | null;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ComplaintDetailsSection({ state, filePreview, handleFileChange }: ComplaintDetailsSectionProps) {
  return (
    <div className="space-y-6 border-t border-gray-200 dark:border-gray-700 pt-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900/50 dark:to-pink-900/50 rounded-lg flex items-center justify-center">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
        </div>
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
          Complaint Details
        </h3>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Detailed Description *
          </Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Provide a detailed description of your complaint. Include specific details about what happened, when it occurred, and any relevant circumstances."
            required
            rows={5}
            className="bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-purple-500/20 resize-none text-gray-900 dark:text-gray-100"
          />
          {state.errors?.description && (
            <p className="text-sm text-red-500 dark:text-red-400 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {state.errors.description[0]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="desiredResolution"
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Desired Resolution *
          </Label>
          <Textarea
            id="desiredResolution"
            name="desiredResolution"
            placeholder="Describe what outcome you would like to see from this complaint. Be specific about your expectations."
            required
            rows={4}
            className="bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-purple-500/20 resize-none text-gray-900 dark:text-gray-100"
          />
          {state.errors?.desiredResolution && (
            <p className="text-sm text-red-500 dark:text-red-400 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {state.errors.desiredResolution[0]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="evidence" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Supporting Evidence
          </Label>
          <div className="relative">
            <input
              id="evidence"
              name="evidence"
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 dark:file:bg-purple-900/20 dark:file:text-purple-400 dark:hover:file:bg-purple-900/30 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg focus:border-purple-500 focus:ring-purple-500/20"
            />
            {filePreview && (
              <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
                  <span className="text-sm font-medium text-green-800 dark:text-green-300">
                    {filePreview.name}
                  </span>
                </div>
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Upload documents, images, or other files that support your complaint (PDF, DOC, DOCX, JPG, PNG, GIF - Max 10MB)
          </p>
          {state.errors?.evidenceFile && (
            <p className="text-sm text-red-500 dark:text-red-400 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {state.errors.evidenceFile[0]}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
