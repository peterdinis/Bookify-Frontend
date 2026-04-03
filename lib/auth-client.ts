import { getApiBaseUrl } from "@/lib/api";

/** Odpoveď z GET /api/auth/me (Bookify API). */
export type SessionUser = {
  id: string;
  entraId: string;
  role: string;
  isActive: boolean;
  name: string;
  email: string;
};

/**
 * Načíta profil z API — potrebuje access token z MSAL (Bearer).
 */
export async function fetchSessionUser(
  accessToken: string,
): Promise<SessionUser | null> {
  const base = getApiBaseUrl();
  if (!base || typeof window === "undefined") return null;

  const res = await fetch(`${base}/api/auth/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });

  if (res.status === 401 || res.status === 403) return null;
  if (!res.ok) return null;

  return res.json() as Promise<SessionUser>;
}
