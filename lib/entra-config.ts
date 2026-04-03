/** Odpoveď GET /api/auth/config (Bookify API, camelCase JSON). */
export type EntraMsalConfig = {
  tenantId: string;
  clientId: string;
  apiClientId: string;
  authority: string | null;
  instance: string;
  scopes: string[];
  msalRedirectUri: string;
  postLogoutRedirectUri: string;
  description?: string;
};

export async function fetchEntraMsalConfig(): Promise<EntraMsalConfig> {
  const res = await fetch("/api/auth/config", { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Nepodarilo sa načítať /api/auth/config (${res.status})`);
  }
  return res.json() as Promise<EntraMsalConfig>;
}
