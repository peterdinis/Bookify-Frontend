"use client";

import type { AccountInfo, PublicClientApplication } from "@azure/msal-browser";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { fetchSessionUser, type SessionUser } from "@/lib/auth-client";
import type { EntraMsalConfig } from "@/lib/entra-config";
import { getMsalBootstrap } from "@/lib/msal-bootstrap";
import { getApiBaseUrl } from "@/lib/api";

type AuthContextValue = {
  user: SessionUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  msalReady: boolean;
  configError: string | null;
  refresh: () => Promise<void>;
  loginWithMicrosoft: () => Promise<void>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [entra, setEntra] = useState<EntraMsalConfig | null>(null);
  const [msal, setMsal] = useState<PublicClientApplication | null>(null);
  const [user, setUser] = useState<SessionUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [configError, setConfigError] = useState<string | null>(null);

  const loadUserFromMsal = useCallback(
    async (instance: PublicClientApplication, cfg: EntraMsalConfig) => {
      const account =
        instance.getActiveAccount() ?? instance.getAllAccounts()[0] ?? null;
      if (!account) {
        setUser(null);
        return;
      }
      instance.setActiveAccount(account);
      if (!getApiBaseUrl()) {
        setUser(null);
        return;
      }
      try {
        const result = await instance.acquireTokenSilent({
          scopes: cfg.scopes,
          account,
        });
        const u = await fetchSessionUser(result.accessToken);
        setUser(u);
      } catch {
        setUser(null);
      }
    },
    [],
  );

  const refresh = useCallback(async () => {
    if (!msal || !entra) {
      setUser(null);
      return;
    }
    await loadUserFromMsal(msal, entra);
  }, [msal, entra, loadUserFromMsal]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setIsLoading(true);
      setConfigError(null);
      try {
        if (!getApiBaseUrl()) {
          if (!cancelled) setIsLoading(false);
          return;
        }
        const { instance, entra: cfg } = await getMsalBootstrap();
        if (cancelled) return;
        setEntra(cfg);
        setMsal(instance);

        const redirectResult = await instance.handleRedirectPromise();
        if (cancelled) return;

        if (redirectResult?.account) {
          instance.setActiveAccount(redirectResult.account);
          if (
            typeof window !== "undefined" &&
            window.location.pathname === "/auth/callback"
          ) {
            router.replace("/");
          }
          await loadUserFromMsal(instance, cfg);
        } else {
          await loadUserFromMsal(instance, cfg);
        }
      } catch (e) {
        if (!cancelled) {
          setConfigError(
            e instanceof Error ? e.message : "Chyba MSAL konfigurácie",
          );
          setUser(null);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [loadUserFromMsal, router]);

  const loginWithMicrosoft = useCallback(async () => {
    if (!msal || !entra) return;
    await msal.loginRedirect({
      scopes: entra.scopes,
    });
  }, [msal, entra]);

  const signOut = useCallback(() => {
    if (!msal) {
      window.location.href = "/login";
      return;
    }
    const account: AccountInfo | null =
      msal.getActiveAccount() ?? msal.getAllAccounts()[0] ?? null;
    void msal.logoutRedirect({
      account: account ?? undefined,
      postLogoutRedirectUri:
        typeof window !== "undefined"
          ? `${window.location.origin}/login`
          : undefined,
    });
  }, [msal]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isAuthenticated: user !== null,
      msalReady: msal !== null && entra !== null,
      configError,
      refresh,
      loginWithMicrosoft,
      signOut,
    }),
    [
      user,
      isLoading,
      msal,
      entra,
      configError,
      refresh,
      loginWithMicrosoft,
      signOut,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
