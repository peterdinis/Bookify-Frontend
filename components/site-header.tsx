"use client";

import { Podcast, LogOut, User as UserIcon } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/app/actions/authActions";

export function SiteHeader({
  user,
}: {
  user?: { name: string; email: string } | null;
}) {
  const handleLogout = async () => {
    await logoutAction({});
    window.location.href = "/login";
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-card/85 shadow-sm backdrop-blur-md supports-backdrop-filter:bg-card/70">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-4 sm:h-16 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <Podcast className="size-5" aria-hidden />
          </div>
          <div className="min-w-0">
            <p className="truncate text-lg font-semibold tracking-tight">
              Bookify
            </p>
            <p className="hidden text-xs text-muted-foreground sm:block">
              Upload, organize, and listen to audiobooks
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {user ? (
            <div className="hidden items-center gap-3 pr-2 sm:flex">
              <div className="flex flex-col items-end">
                <p className="text-xs font-medium leading-none">{user.name}</p>
                <p className="text-[10px] text-muted-foreground">
                  {user.email}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={handleLogout}
                title="Log out"
              >
                <LogOut className="size-4" />
              </Button>
            </div>
          ) : null}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
