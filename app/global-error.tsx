"use client";

import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import "./globals.css";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center bg-background px-4 font-sans text-foreground antialiased">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex max-w-md flex-col items-center text-center"
        >
          <motion.div
            className="mb-4 flex size-14 items-center justify-center rounded-full bg-destructive/15 text-destructive"
            initial={{ scale: 0.85 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 18 }}
          >
            <AlertTriangle className="size-7" aria-hidden />
          </motion.div>
          <h1 className="text-xl font-semibold tracking-tight">Critical error</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            The app could not load. Refresh the page or try again later.
          </p>
          <Button type="button" className="mt-6" onClick={() => reset()}>
            Try again
          </Button>
        </motion.div>
      </body>
    </html>
  );
}
