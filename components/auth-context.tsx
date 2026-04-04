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
import {
  clearBookifyAccessToken,
  exchangeEntraOidForSession,
  fetchSessionUser,
  getBookifyAccessToken,
  type SessionUser,
} from "@/lib/auth-client";
import { getEntraOidFromAccount, type EntraMsalConfig } from "@/lib/msal-env";
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

function profileFromAccount(account: AccountInfo): {
  name?: string;
  email?: string;
} {
  const claims = account.idTokenClaims as Record<string, unknown> | undefined;
  const name = typeof claims?.name === "string" ? claims.name : undefined;
  const email =
    typeof claims?.email === "string"
      ? claims.email
      : typeof claims?.preferred_username === "string"
        ? claims.preferred_username
        : undefined;
  return { name, email };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [entra, setEntra] = useState<EntraMsalConfig | null>(null);
  const [msal, setMsal] = useState<PublicClientApplication | null>(null);
  const [user, setUser] = useState<SessionUser | null>(null);
  /** Len MSAL init + redirect (bez čakania na backend). */
  const [msalLoading, setMsalLoading] = useState(true);
  /** Backend /me alebo /session — len ak je MSAL účet alebo uložený Bookify token. */
  const [sessionLoading, setSessionLoading] = useState(false);
  const [configError, setConfigError] = useState<string | null>(null);

  const isLoading = msalLoading || sessionLoading;

  const syncBackendWithMsalAccount = useCallback(
    async (instance: PublicClientApplication, _cfg: EntraMsalConfig) => {
      const account =
        instance.getActiveAccount() ?? instance.getAllAccounts()[0] ?? null;
      if (!account) {
        clearBookifyAccessToken();
        setUser(null);
        return;
      }
      instance.setActiveAccount(account);
      if (!getApiBaseUrl()) {
        setUser(null);
        return;
      }

      const oid = getEntraOidFromAccount(account);
      if (!oid) {
        setUser(null);
        return;
      }

      let u = await fetchSessionUser();
      if (!u) {
        const { name, email } = profileFromAccount(account);
        u = await exchangeEntraOidForSession(oid, name, email);
      }
      setUser(u);
    },
    [],
  );

  const refresh = useCallback(async () => {
    if (!msal || !entra) {
      setUser(null);
      return;
    }
    await syncBackendWithMsalAccount(msal, entra);
  }, [msal, entra, syncBackendWithMsalAccount]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setMsalLoading(true);
      setSessionLoading(false);
      setConfigError(null);
      try {
        if (!getApiBaseUrl()) {
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
        }

        const account =
          instance.getActiveAccount() ?? instance.getAllAccounts()[0] ?? null;
        const hasStoredToken = getBookifyAccessToken() !== null;
        if (account !== null || hasStoredToken) {
          setSessionLoading(true);
        }
        setMsalLoading(false);

        await syncBackendWithMsalAccount(instance, cfg);
      } catch (e) {
        if (!cancelled) {
          setConfigError(
            e instanceof Error ? e.message : "Chyba MSAL konfigurácie",
          );
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setSessionLoading(false);
          setMsalLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [syncBackendWithMsalAccount, router]);

  const loginWithMicrosoft = useCallback(async () => {
    if (!msal || !entra) return;
    await msal.loginRedirect({
      scopes: entra.scopes,
    });
  }, [msal, entra]);

  const signOut = useCallback(() => {
    clearBookifyAccessToken();
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
