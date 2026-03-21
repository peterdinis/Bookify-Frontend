"use client";

import { motion } from "framer-motion";
import { Loader2, Podcast } from "lucide-react";

export function LayoutSuspenseFallback() {
  return (
    <div
      className="flex min-h-[50vh] flex-1 flex-col items-center justify-center gap-8 px-4 py-12"
      aria-busy="true"
      aria-label="Loading"
    >
      <motion.div
        className="flex flex-col items-center gap-4"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className="flex size-16 items-center justify-center rounded-2xl bg-primary/15 text-primary shadow-inner"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Podcast className="size-8" aria-hidden />
        </motion.div>
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Loader2 className="size-4 animate-spin" aria-hidden />
          Loading…
        </div>
      </motion.div>

      <motion.div
        className="flex w-full max-w-sm flex-col gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.35 }}
      >
        {[0.92, 0.78, 0.65].map((width, i) => (
          <motion.div
            key={i}
            className="h-3 rounded-full bg-muted"
            style={{ width: `${width * 100}%` }}
            initial={{ opacity: 0.35 }}
            animate={{ opacity: [0.35, 0.65, 0.35] }}
            transition={{
              duration: 1.4,
              repeat: Infinity,
              delay: i * 0.12,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}
