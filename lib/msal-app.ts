import {
  type Configuration,
  PublicClientApplication,
} from "@azure/msal-browser";
import type { EntraMsalConfig } from "@/lib/entra-config";

export function buildMsalConfiguration(entra: EntraMsalConfig): Configuration {
  const redirectUri =
    typeof window !== "undefined"
      ? `${window.location.origin}/auth/callback`
      : "http://localhost:3000/auth/callback";

  if (!entra.authority || !entra.clientId) {
    throw new Error("Neplatná Entra konfigurácia: chýba authority alebo clientId.");
  }

  return {
    auth: {
      clientId: entra.clientId,
      authority: entra.authority,
      redirectUri,
      postLogoutRedirectUri:
        typeof window !== "undefined"
          ? `${window.location.origin}/login`
          : entra.postLogoutRedirectUri,
    },
    cache: {
      cacheLocation: "sessionStorage",
    },
  };
}

export async function createMsalInstance(
  entra: EntraMsalConfig,
): Promise<PublicClientApplication> {
  const pca = new PublicClientApplication(buildMsalConfiguration(entra));
  await pca.initialize();
  return pca;
}
