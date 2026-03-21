"use client";

import { motion } from "framer-motion";
import { BookOpen, Clock, Library, Sparkles } from "lucide-react";
import { useEffect, useOptimistic, useState, useTransition } from "react";
import { DashboardWorkspace } from "@/components/dashboard-workspace";
import { SiteHeader } from "@/components/site-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Audiobook } from "@/lib/types";

function formatTotalHours(minutes: number) {
  if (minutes < 60) return `${Math.round(minutes)} min`;
  const h = minutes / 60;
  return h >= 10 ? `${Math.round(h)} hrs` : `${h.toFixed(1)} hrs`;
}

export function AudiobookDashboard({
  initialBooks,
}: {
  initialBooks: Audiobook[];
}) {
  const [serverBooks, setServerBooks] = useState(initialBooks);

  useEffect(() => {
    setServerBooks(initialBooks);
  }, [initialBooks]);

  const [optimisticBooks, addOptimistic] = useOptimistic(
    serverBooks,
    (state, newBook: Audiobook) => [newBook, ...state],
  );

  const [, startTransition] = useTransition();

  const totalMinutes = optimisticBooks.reduce(
    (acc, b) => acc + b.durationMinutes,
    0,
  );
  const uploads = optimisticBooks.filter((b) => b.originalFileName).length;

  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <div className="dashboard-bg flex-1">
        <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-4 py-6 sm:gap-10 sm:px-6 sm:py-10">
          <motion.section
            className="space-y-2"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <p className="text-sm font-medium text-primary">Your shelf</p>
            <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              Pick up where you left off
            </h1>
            <p className="max-w-2xl text-pretty text-muted-foreground sm:text-lg">
              Browse mock titles, upload new audio, and use the player with skip,
              speed, and volume controls—ready to wire to your backend.
            </p>
          </motion.section>

          <section className="grid gap-3 sm:grid-cols-3">
            {[
              {
                title: "Library",
                icon: Library,
                value: optimisticBooks.length,
                hint: "titles available",
              },
              {
                title: "Listening time",
                icon: Clock,
                value: formatTotalHours(totalMinutes),
                hint: "combined duration (mock)",
              },
              {
                title: "Your uploads",
                icon: Sparkles,
                value: uploads,
                hint: "files added this session",
              },
            ].map((stat, i) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.05 * i }}
              >
                <Card className="border-primary/10 bg-card/80 shadow-sm backdrop-blur-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                    <stat.icon className="size-4 text-muted-foreground" aria-hidden />
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-semibold tabular-nums">{stat.value}</p>
                    <CardDescription>{stat.hint}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </section>

          <motion.section
            className="rounded-2xl border border-border/80 bg-card/60 p-4 shadow-sm backdrop-blur-md sm:p-6"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="flex items-center gap-2 text-lg font-semibold">
                  <BookOpen className="size-5 text-primary" aria-hidden />
                  Library & player
                </h2>
                <p className="text-sm text-muted-foreground">
                  Search the list, then play with full transport controls.
                </p>
              </div>
            </div>
            <DashboardWorkspace
              books={optimisticBooks}
              startUploadTransition={startTransition}
              addOptimisticBook={addOptimistic}
            />
          </motion.section>
        </main>
      </div>
    </div>
  );
}
