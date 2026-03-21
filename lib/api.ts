/**
 * Backend API — auth a dáta sú na serveri. Nastav v `.env.local` základnú URL.
 */

/** Verejná báza pre presmerovania z prehliadača (OAuth login). */
export function getApiBaseUrl(): string {
  const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";
  return base;
}

/**
 * Cesta na štart Microsoft OAuth na backende (GET → redirect na Microsoft).
 * Príklad: `/auth/microsoft` alebo `/v1/oauth/microsoft`
 */
export function getMicrosoftLoginPath(): string {
  return (
    process.env.NEXT_PUBLIC_AUTH_MICROSOFT_PATH?.trim() || "/auth/microsoft"
  );
}

/**
 * Absolútna URL pre presmerovanie používateľa na backend (Microsoft login).
 */
export function getMicrosoftLoginUrl(): string {
  const base = getApiBaseUrl();
  const path = getMicrosoftLoginPath();
  const p = path.startsWith("/") ? path : `/${path}`;
  if (!base) return p;
  return `${base}${p}`;
}

export function apiUrl(path: string): string {
  const base = getApiBaseUrl();
  const p = path.startsWith("/") ? path : `/${path}`;
  if (!base) return p;
  return `${base}${p}`;
}
