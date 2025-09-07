import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import React from "react";

interface AddResponseCardProps {
  response: string;
  setResponse: (val: string) => void;
  isSubmitting: boolean;
  handleSubmitResponse: () => void;
}

export function AddResponseCard({ response, setResponse, isSubmitting, handleSubmitResponse }: AddResponseCardProps) {
  return (
    <Card className="glass-effect border-0 shadow-xl">
      <CardHeader className="border-b border-white/20 dark:border-gray-700/20 bg-gradient-to-r from-white/50 to-white/30 dark:from-gray-800/50 dark:to-gray-800/30">
        <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
          <Send className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          Add Response
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">Your response will be sent to the student via email</CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <Textarea
          placeholder="Enter your response to this complaint..."
          rows={4}
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          className="bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-purple-500/20 resize-none text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
        />
      </CardContent>
      <CardFooter className="flex justify-between gap-3 p-6 pt-0">
        <Button
          variant="outline"
          onClick={() => setResponse("")}
          className="border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"
        >
          Clear
        </Button>
        <Button
          onClick={handleSubmitResponse}
          disabled={isSubmitting || !response.trim()}
          className="btn-gradient shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Sending...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Send Response
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
