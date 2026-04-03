"use client";

import { Podcast, LogOut, User } from "lucide-react";
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
import { useAuth } from "@/components/auth-context";
import { getApiBaseUrl } from "@/lib/api";
import { logoutAction } from "@/app/actions/authActions";

export function SiteHeader() {
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    if (getApiBaseUrl()) {
      signOut();
      return;
    }
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="max-w-[200px] gap-2 border-border/80"
                >
                  <User className="size-4 shrink-0 opacity-70" aria-hidden />
                  <span className="truncate font-medium">{user.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.name}
                    </p>
                    <p className="text-muted-foreground text-xs leading-none">
                      {user.email || "—"}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => void handleLogout()}
                >
                  <LogOut className="mr-2 size-4" aria-hidden />
                  Odhlásiť sa
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
