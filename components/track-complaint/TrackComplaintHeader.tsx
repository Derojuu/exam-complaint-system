import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function TrackComplaintHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
    >
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-gradient">My Complaints</h1>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
          Track and manage your exam complaints with ease
        </p>
      </div>
      <Link href="/submit-complaint" className="w-full lg:w-auto">
        <Button
          asChild
          size="lg"
          className="btn-gradient shadow-lg hover:shadow-xl transition-all duration-300 w-full lg:w-auto"
        >
          <span>
            <PlusCircle className="mr-2 h-5 w-5" />
            Submit New Complaint
          </span>
        </Button>
      </Link>
    </motion.div>
  );
}
