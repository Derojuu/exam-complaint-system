import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

interface SubmitComplaintHeaderProps {
  steps: Array<{
    number: number;
    title: string;
    icon: React.ComponentType<{ className?: string }>;
  }>;
  currentStep: number;
}

export default function SubmitComplaintHeader({ steps, currentStep }: SubmitComplaintHeaderProps) {
  return (
    <>
      {/* Back Link */}
      <div className="flex justify-between items-center mb-6 sm:mb-8 pt-4 px-1 sm:px-0">
        <Link
          href="/track-complaint"
          className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
        <ThemeToggle />
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-6 sm:mb-8 px-1 sm:px-0"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-gradient mb-4">Submit Exam Complaint</h1>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Please provide detailed information about your exam complaint. All fields marked with * are required.
        </p>
      </motion.div>

      {/* Progress Steps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mb-6 sm:mb-8 px-0"
      >
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 lg:gap-8">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div
                className={`
                w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold transition-all
                ${
                  currentStep >= step.number
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                }
              `}
              >
                <step.icon className="w-5 h-5" />
              </div>
              <div className="ml-2 hidden sm:block">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{step.title}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="w-8 lg:w-16 h-0.5 bg-gray-200 dark:bg-gray-700 mx-4 lg:mx-8"></div>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </>
  );
}
