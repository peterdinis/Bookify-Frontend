"use client";

import { FullPageLoader } from "@/components/full-page-loader";

/** MSAL redirect — dokončenie prebieha v AuthProvider. */
export default function AuthCallbackPage() {
  return <FullPageLoader label="Dokončujeme prihlásenie…" />;
}
