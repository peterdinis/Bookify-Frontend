import type { PublicClientApplication } from "@azure/msal-browser";
import { createMsalInstance } from "@/lib/msal-app";
import { getMsalEnvConfig, type EntraMsalConfig } from "@/lib/msal-env";

type BootResult = { instance: PublicClientApplication; entra: EntraMsalConfig };

let bootPromise: Promise<BootResult> | null = null;

export function getMsalBootstrap(): Promise<BootResult> {
  if (!bootPromise) {
    bootPromise = (async () => {
      const entra = getMsalEnvConfig();
      const instance = await createMsalInstance(entra);
      return { instance, entra };
    })();
  }
  return bootPromise;
}
