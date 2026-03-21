"use client";

import { motion } from "framer-motion";
import { FileQuestion, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="dashboard-bg flex min-h-[60vh] flex-col items-center justify-center px-4 py-16">
      <motion.div
        className="flex max-w-md flex-col items-center text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className="mb-6 flex size-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground"
          initial={{ scale: 0.85, rotate: -8 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 380, damping: 22 }}
        >
          <FileQuestion className="size-8" aria-hidden />
        </motion.div>
        <h1 className="text-2xl font-semibold tracking-tight">Page not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This URL does not exist or has been moved. Check the address or go back home.
        </p>
        <Button asChild className="mt-8 gap-2">
          <Link href="/">
            <Home className="size-4" aria-hidden />
            Back to home
          </Link>
        </Button>
      </motion.div>
    </div>
  );
}
