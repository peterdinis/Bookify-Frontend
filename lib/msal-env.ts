import type { AccountInfo } from "@azure/msal-browser";

/**
 * MSAL / Entra konfigurácia výhradne z env (bez volania backendu).
 */
export type EntraMsalConfig = {
  clientId: string;
  authority: string;
  scopes: string[];
};

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v?.trim()) {
    throw new Error(`Chýba premenná prostredia ${name}.`);
  }
  return v.trim();
}

export function getMsalEnvConfig(): EntraMsalConfig {
  const clientId = requireEnv("NEXT_PUBLIC_AZURE_CLIENT_ID");
  const tenantId = requireEnv("NEXT_PUBLIC_AZURE_TENANT_ID");
  const scopesRaw =
    process.env.NEXT_PUBLIC_MSAL_SCOPES ?? "openid,profile,email";
  const scopes = scopesRaw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (scopes.length === 0) {
    throw new Error("NEXT_PUBLIC_MSAL_SCOPES musí obsahovať aspoň jeden scope.");
  }
  return {
    clientId,
    authority: `https://login.microsoftonline.com/${tenantId}`,
    scopes,
  };
}

/** Object ID z Entra (id token) alebo fallback z MSAL účtu. */
export function getEntraOidFromAccount(account: AccountInfo): string | null {
  const claims = account.idTokenClaims as Record<string, unknown> | undefined;
  if (claims) {
    const oid = claims.oid ?? claims.sub;
    if (typeof oid === "string" && oid.length > 0) return oid;
  }
  const local = account.localAccountId?.trim();
  return local && local.length > 0 ? local : null;
}
