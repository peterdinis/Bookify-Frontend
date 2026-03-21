"use client";

import { LogOut, Podcast, UserRound } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function SiteHeader() {
  const { data: session, status } = useSession();

  return (
    <header className="sticky top-0 z-40 border-b bg-card/85 shadow-sm backdrop-blur-md supports-[backdrop-filter]:bg-card/70">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-4 sm:h-16 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <Podcast className="size-5" aria-hidden />
          </div>
          <div className="min-w-0">
            <p className="truncate text-lg font-semibold tracking-tight">Bookify</p>
            <p className="hidden text-xs text-muted-foreground sm:block">
              Upload, organize, and listen to audiobooks
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle />
          {status === "authenticated" && session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="size-9 overflow-hidden rounded-full p-0"
                  aria-label="Account menu"
                >
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt=""
                      width={36}
                      height={36}
                      className="size-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <UserRound className="size-4" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {session.user.name ?? "Signed in"}
                    </p>
                    {session.user.email ? (
                      <p className="text-xs leading-none text-muted-foreground">
                        {session.user.email}
                      </p>
                    ) : null}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="cursor-pointer"
                >
                  <LogOut className="mr-2 size-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </div>
      </div>
    </header>
  );
}
