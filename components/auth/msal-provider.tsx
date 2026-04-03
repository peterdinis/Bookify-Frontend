"use client";

import { PublicClientApplication, EventType, AccountInfo } from "@azure/msal-browser";
import { MsalProvider as MsalReactProvider } from "@azure/msal-react";
import { ReactNode } from "react";

const msalConfig = {
  auth: {
    clientId: process.env.NEXT_PUBLIC_AZURE_CLIENT_ID!,
    authority: `https://login.microsoftonline.com/${process.env.NEXT_PUBLIC_AZURE_TENANT_ID}`,
    redirectUri: typeof window !== "undefined" ? window.location.origin : "",
    postLogoutRedirectUri: typeof window !== "undefined" ? window.location.origin : "",
  },
  cache: {
    cacheLocation: "sessionStorage" as const,
    storeAuthStateInCookie: false,
  },
};

const msalInstance = new PublicClientApplication(msalConfig);

// Nastavenie aktívneho účtu po prihlásení
if (typeof window !== "undefined") {
  msalInstance.addEventCallback((event) => {
    if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
      const account = event.payload as AccountInfo;
      msalInstance.setActiveAccount(account);
    }
  });
}

export function MsalProvider({ children }: { children: ReactNode }) {
  return <MsalReactProvider instance={msalInstance}>{children}</MsalReactProvider>;
}