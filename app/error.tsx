"use client";

import { motion } from "framer-motion";
import { AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-100 flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center"
      >
        <div className="mb-6 flex size-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertCircle className="size-8" />
        </div>
        <h2 className="mb-2 text-2xl font-bold tracking-tight">
          Something went wrong!
        </h2>
        <p className="mb-8 max-w-md text-muted-foreground">
          {error.message ||
            "An unexpected error occurred while processing your request. Please try refreshing the page or contact support if the problem persists."}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button onClick={() => reset()} className="gap-2">
            <RefreshCcw className="size-4" />
            Try again
          </Button>
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/")}
          >
            Go home
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
