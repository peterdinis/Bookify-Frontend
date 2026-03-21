"use client";

import { motion } from "framer-motion";
import { Library, Loader2 } from "lucide-react";

export function DashboardSuspenseFallback() {
  return (
    <div className="dashboard-bg flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4">
      <motion.div
        className="flex flex-col items-center gap-4"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35 }}
      >
        <motion.div
          className="flex size-16 items-center justify-center rounded-2xl bg-primary/15 text-primary"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Library className="size-8" aria-hidden />
        </motion.div>
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Loader2 className="size-4 animate-spin" aria-hidden />
          Loading your library…
        </div>
      </motion.div>
    </div>
  );
}
