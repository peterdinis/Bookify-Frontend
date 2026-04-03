"use client";

import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/components/auth-context";
import { MsalProvider } from "./auth/msal-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <MsalProvider>{children}</MsalProvider>
    </ThemeProvider>
  );
}
