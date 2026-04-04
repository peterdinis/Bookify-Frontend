"use client";

import { ThemeProvider } from "next-themes";
import { MsalProvider } from "./auth/msal-provider";
import { AuthProvider } from "./auth-context";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <MsalProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
      </MsalProvider>
    </ThemeProvider>
  );
}
