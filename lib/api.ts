/**
 * Backend API — auth and data live on the server. Set the base URL in `.env.local`.
 */

/** Public base URL for browser redirects (OAuth login). */
export function getApiBaseUrl(): string {
  const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";
  return base;
}

/**
 * Path on the backend that starts Microsoft OAuth (GET → redirect to Microsoft).
 * Example: `/auth/microsoft` or `/v1/oauth/microsoft`
 */
export function getMicrosoftLoginPath(): string {
  return (
    process.env.NEXT_PUBLIC_AUTH_MICROSOFT_PATH?.trim() || "/auth/microsoft"
  );
}

/** Absolute URL to send the user to the backend for Microsoft login. */
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
