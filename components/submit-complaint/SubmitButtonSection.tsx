import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface SubmitButtonSectionProps {
  isSubmitting: boolean;
}

export default function SubmitButtonSection({ isSubmitting }: SubmitButtonSectionProps) {
  return (
    <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
      <Button
        type="submit"
        className="w-full h-12 sm:h-14 btn-gradient text-white font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
            Submitting Complaint...
          </>
        ) : (
          <>
            <CheckCircle className="w-5 h-5 mr-3" />
            Submit Complaint
          </>
        )}
      </Button>
    </div>
  );
}
