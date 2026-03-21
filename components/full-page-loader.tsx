"use client";

import { motion } from "framer-motion";
import { Loader2, Podcast } from "lucide-react";

export function FullPageLoader({ label }: { label: string }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4">
      <motion.div
        className="flex size-14 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 320, damping: 22 }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Podcast className="size-7" aria-hidden />
        </motion.div>
      </motion.div>
      <motion.p
        className="flex items-center gap-2 text-sm text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Loader2 className="size-4 animate-spin" aria-hidden />
        {label}
      </motion.p>
    </div>
  );
}
