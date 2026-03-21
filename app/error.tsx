"use client";

import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-6 px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="flex max-w-md flex-col items-center text-center"
      >
        <motion.div
          className="mb-4 flex size-14 items-center justify-center rounded-full bg-destructive/15 text-destructive"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 18 }}
        >
          <AlertTriangle className="size-7" aria-hidden />
        </motion.div>
        <h1 className="text-xl font-semibold tracking-tight">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {error.message || "An unexpected error occurred. You can try again."}
        </p>
        {error.digest ? (
          <p className="mt-2 font-mono text-xs text-muted-foreground">
            {error.digest}
          </p>
        ) : null}
        <Button className="mt-6" onClick={() => reset()}>
          Try again
        </Button>
      </motion.div>
    </div>
  );
}
