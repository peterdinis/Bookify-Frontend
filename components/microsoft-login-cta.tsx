"use client";

import { motion } from "framer-motion";
import { Loader2, Podcast } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getApiBaseUrl, getMicrosoftLoginUrl } from "@/lib/api";
import { ThemeToggle } from "@/components/theme-toggle";

export function MicrosoftLoginCta() {
  const [loading, setLoading] = useState(false);
  const backend = getApiBaseUrl();
  const loginUrl = getMicrosoftLoginUrl();

  const startLogin = () => {
    if (!backend) return;
    setLoading(true);
    window.location.assign(loginUrl);
  };

  return (
    <div className="relative flex min-h-full flex-col bg-background">
      <div className="absolute right-4 top-4 z-10 sm:right-6 sm:top-6">
        <ThemeToggle />
      </div>
      <div className="dashboard-bg flex flex-1 flex-col items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md"
        >
          <div className="mb-8 flex flex-col items-center text-center">
            <motion.div
              className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg"
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <Podcast className="size-8" aria-hidden />
            </motion.div>
            <h1 className="text-2xl font-semibold tracking-tight">Bookify</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Prihlásenie cez Microsoft spracuje backend — presmerujeme ťa na jeho
              OAuth endpoint.
            </p>
          </div>
          <Card className="border-border/80 shadow-lg">
            <CardHeader>
              <CardTitle>Prihlásiť sa</CardTitle>
              <CardDescription>
                Pokračovaním otvoríš prihlásenie u Microsoftu na tvojom API.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!backend ? (
                <p className="text-sm text-destructive">
                  Nastav <code className="rounded bg-muted px-1">NEXT_PUBLIC_API_URL</code>{" "}
                  na URL backendu (napr. http://localhost:4000).
                </p>
              ) : null}
              <Button
                type="button"
                className="h-11 w-full gap-2"
                disabled={loading || !backend}
                onClick={startLogin}
              >
                {loading ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                ) : (
                  <svg
                    className="size-5"
                    viewBox="0 0 21 21"
                    aria-hidden
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <title>Microsoft</title>
                    <rect x="1" y="1" width="9" height="9" fill="#f25022" />
                    <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
                    <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
                    <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
                  </svg>
                )}
                Pokračovať s Microsoft
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Endpoint:{" "}
                <code className="break-all rounded bg-muted px-1 text-[0.7rem]">
                  {loginUrl}
                </code>
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
