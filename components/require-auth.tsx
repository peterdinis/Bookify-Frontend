"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-context";
import { FullPageLoader } from "@/components/full-page-loader";
import { getApiBaseUrl } from "@/lib/api";

/**
 * Chráni obsah: bez API URL alebo bez prihlásenia presmeruje na /login.
 */
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isLoading, configError, msalReady } = useAuth();

  useEffect(() => {
    if (!getApiBaseUrl()) {
      router.replace("/login");
      return;
    }
    if (isLoading || !msalReady) return;
    if (configError) return;
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, configError, msalReady, router]);

  if (!getApiBaseUrl()) {
    return null;
  }

  if (isLoading || !msalReady) {
    return <FullPageLoader label="Načítavam…" />;
  }

  if (configError) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 px-4 text-center text-sm">
        <p className="text-destructive max-w-md">{configError}</p>
        <p className="text-muted-foreground">
          Skontroluj .env (NEXT_PUBLIC_AZURE_*), backend SessionJwt a či beží API.
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
