import type { PublicClientApplication } from "@azure/msal-browser";
import { fetchEntraMsalConfig, type EntraMsalConfig } from "@/lib/entra-config";
import { createMsalInstance } from "@/lib/msal-app";

type BootResult = { instance: PublicClientApplication; entra: EntraMsalConfig };

let bootPromise: Promise<BootResult> | null = null;

export function getMsalBootstrap(): Promise<BootResult> {
  if (!bootPromise) {
    bootPromise = (async () => {
      const entra = await fetchEntraMsalConfig();
      const instance = await createMsalInstance(entra);
      return { instance, entra };
    })();
  }
  return bootPromise;
}
