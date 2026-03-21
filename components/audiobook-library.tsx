"use client";

import { Clock, Loader2, Play, Search, User } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { AudiobookPlayer } from "@/components/audiobook-player";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { Audiobook } from "@/lib/types";

function formatDuration(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h <= 0) return `${m}m`;
  return `${h}h ${m}m`;
}

export function AudiobookLibrary({
  books,
  className,
}: {
  books: Audiobook[];
  className?: string;
}) {
  const [activeId, setActiveId] = useState<string | null>(
    books[0]?.id ?? null,
  );
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return books;
    return books.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        (b.narrator && b.narrator.toLowerCase().includes(q)),
    );
  }, [books, query]);

  const resolvedActiveId = useMemo(() => {
    if (activeId && filtered.some((b) => b.id === activeId)) return activeId;
    if (filtered.length > 0) return filtered[0].id;
    if (activeId && books.some((b) => b.id === activeId)) return activeId;
    return books[0]?.id ?? null;
  }, [activeId, filtered, books]);

  const active = useMemo(
    () => books.find((b) => b.id === resolvedActiveId) ?? null,
    [books, resolvedActiveId],
  );

  return (
    <div
      className={cn(
        "grid gap-6 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:items-start lg:gap-8 xl:grid-cols-[minmax(0,380px)_minmax(0,1fr)]",
        className,
      )}
    >
      <Card className="flex min-h-[280px] flex-col overflow-hidden border-border/80 bg-card/90 shadow-sm lg:sticky lg:top-24 lg:max-h-[calc(100vh-8rem)]">
        <CardHeader className="space-y-3 pb-3">
          <div>
            <CardTitle className="text-lg">Library</CardTitle>
            <CardDescription>
              {filtered.length} of {books.length} shown
            </CardDescription>
          </div>
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              type="search"
              placeholder="Search title, author…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-10 bg-background/80 pl-9"
              aria-label="Search library"
            />
          </div>
        </CardHeader>
        <CardContent className="flex min-h-0 flex-1 flex-col px-2 pb-4 sm:px-4">
          {filtered.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-8 text-center">
              <p className="text-sm text-muted-foreground">No matches.</p>
              <button
                type="button"
                className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                onClick={() => setQuery("")}
              >
                Clear search
              </button>
            </div>
          ) : (
            <ScrollArea className="h-[min(52vh,440px)] pr-3 lg:h-[min(calc(100vh-14rem),560px)]">
              <ul className="space-y-1.5">
                {filtered.map((book) => {
                  const selected = book.id === resolvedActiveId;
                  return (
                    <li key={book.id}>
                      <button
                        type="button"
                        onClick={() => setActiveId(book.id)}
                        className={cn(
                          "group flex w-full gap-3 rounded-xl border p-2.5 text-left transition-all",
                          selected
                            ? "border-primary/35 bg-primary/[0.07] shadow-sm ring-1 ring-primary/15"
                            : "border-transparent bg-muted/30 hover:border-border hover:bg-muted/55",
                        )}
                      >
                        <div className="relative size-[4.5rem] shrink-0 overflow-hidden rounded-lg bg-muted shadow-inner sm:size-20">
                          <Image
                            src={book.coverImageUrl}
                            alt=""
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                            sizes="(max-width: 1024px) 72px, 80px"
                            unoptimized
                          />
                          <span
                            className={cn(
                              "absolute inset-0 flex items-center justify-center bg-background/55 opacity-0 transition-opacity group-hover:opacity-100",
                              selected && "opacity-100 bg-background/40",
                            )}
                          >
                            <span className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md">
                              <Play className="ml-0.5 size-4" aria-hidden />
                            </span>
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 py-0.5">
                          <p className="line-clamp-2 font-medium leading-snug">
                            {book.title}
                          </p>
                          <p className="mt-1 flex items-center gap-1 truncate text-xs text-muted-foreground">
                            <User className="size-3 shrink-0 opacity-70" aria-hidden />
                            {book.author}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {book.isPending ? (
                              <Badge className="gap-1 font-normal">
                                <Loader2
                                  className="size-3 shrink-0 animate-spin"
                                  aria-hidden
                                />
                                Uploading…
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="font-normal">
                                <Clock className="mr-1 size-3 opacity-70" aria-hidden />
                                {formatDuration(book.durationMinutes)}
                              </Badge>
                            )}
                            {book.originalFileName && !book.isPending ? (
                              <Badge variant="outline" className="font-normal">
                                Yours
                              </Badge>
                            ) : null}
                          </div>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      <div className="flex min-h-0 flex-col gap-6">
        {active ? (
          <>
            <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-muted shadow-md ring-1 ring-black/5 dark:ring-white/10">
              <div className="relative aspect-[16/10] w-full sm:aspect-[21/9]">
                <Image
                  src={active.coverImageUrl}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 65vw"
                  priority
                  unoptimized
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent sm:bg-gradient-to-r sm:from-background/95 sm:via-background/40 sm:to-transparent"
                  aria-hidden
                />
                <div className="absolute inset-x-0 bottom-0 flex flex-col justify-end p-4 sm:left-0 sm:top-0 sm:w-[min(100%,420px)] sm:justify-center sm:p-8">
                  <p className="mb-1 text-xs font-medium uppercase tracking-wider text-primary">
                    Now playing
                  </p>
                  <h2 className="text-balance text-xl font-semibold tracking-tight sm:text-2xl lg:text-3xl">
                    {active.title}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground sm:text-base">
                    {active.author}
                  </p>
                  {active.narrator ? (
                    <p className="mt-2 text-xs text-muted-foreground sm:text-sm">
                      Narrated by {active.narrator}
                    </p>
                  ) : null}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {active.isPending ? (
                      <Badge className="gap-1">
                        <Loader2 className="size-3 animate-spin" aria-hidden />
                        Finishing upload…
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        {formatDuration(active.durationMinutes)}
                      </Badge>
                    )}
                    {active.originalFileName && !active.isPending ? (
                      <Badge variant="outline">Your upload</Badge>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>

            <Card className="border-border/80 bg-card/90 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">About this title</CardTitle>
                <CardDescription>
                  Added {new Date(active.uploadedAt).toLocaleDateString(undefined, {
                    dateStyle: "medium",
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {active.description}
                </p>
                <Separator />
                <AudiobookPlayer
                  key={active.id}
                  title={active.title}
                  src={active.audioUrl}
                />
              </CardContent>
            </Card>
          </>
        ) : (
          <Card className="flex min-h-[320px] flex-col items-center justify-center border-dashed bg-muted/20 p-8 text-center">
            <CardTitle className="text-base font-medium">No audiobooks yet</CardTitle>
            <CardDescription className="mt-2 max-w-sm">
              Open the Upload tab to add a file, or refresh if you expected seeded
              mock data.
            </CardDescription>
          </Card>
        )}
      </div>
    </div>
  );
}
