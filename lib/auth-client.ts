import { getApiBaseUrl } from "@/lib/api";

const SESSION_TOKEN_KEY = "bookify_session_token";

const DEFAULT_FETCH_TIMEOUT_MS = 12_000;

async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs = DEFAULT_FETCH_TIMEOUT_MS,
): Promise<Response> {
  const controller = new AbortController();
  const id = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    window.clearTimeout(id);
  }
}

/** Odpoveď z GET /api/auth/me (Bookify API). */
export type SessionUser = {
  id: string;
  entraId: string;
  role: string;
  isActive: boolean;
  name: string;
  email: string;
};

export function getBookifyAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(SESSION_TOKEN_KEY);
}

export function clearBookifyAccessToken(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(SESSION_TOKEN_KEY);
}

function mapSessionUser(raw: Record<string, unknown>): SessionUser | null {
  const id = raw.id;
  const entraId = raw.entraId;
  if (typeof id !== "string" || typeof entraId !== "string") return null;
  return {
    id,
    entraId,
    role: typeof raw.role === "string" ? raw.role : "User",
    isActive: typeof raw.isActive === "boolean" ? raw.isActive : true,
    name: typeof raw.name === "string" ? raw.name : "User",
    email: typeof raw.email === "string" ? raw.email : "",
  };
}

/**
 * Pošle Entra object ID na backend a uloží vlastný Bookify JWT.
 */
export async function exchangeEntraOidForSession(
  entraOid: string,
  name?: string,
  email?: string,
): Promise<SessionUser | null> {
  const base = getApiBaseUrl();
  if (!base || typeof window === "undefined") return null;

  let res: Response;
  try {
    res = await fetchWithTimeout(`${base}/api/auth/session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        entraOid,
        name: name ?? null,
        email: email ?? null,
      }),
      cache: "no-store",
    });
  } catch {
    return null;
  }

  if (!res.ok) return null;

  const data = (await res.json()) as Record<string, unknown>;
  const token = data.accessToken;
  if (typeof token !== "string" || !token) return null;
  sessionStorage.setItem(SESSION_TOKEN_KEY, token);
  const user = data.user;
  if (user && typeof user === "object" && !Array.isArray(user)) {
    return mapSessionUser(user as Record<string, unknown>);
  }
  return null;
}

/**
 * Načíta profil z API — Bookify Bearer (nie Entra token).
 */
export async function fetchSessionUser(
  accessToken?: string,
): Promise<SessionUser | null> {
  const base = getApiBaseUrl();
  if (!base || typeof window === "undefined") return null;

  const token = accessToken ?? getBookifyAccessToken();
  if (!token) return null;

  let res: Response;
  try {
    res = await fetchWithTimeout(`${base}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
  } catch {
    return null;
  }

  if (res.status === 401 || res.status === 403) return null;
  if (!res.ok) return null;

  const raw = (await res.json()) as Record<string, unknown>;
  return mapSessionUser(raw);
}
