"use client";

import { motion } from "framer-motion";
import { Loader2, Podcast } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMsal, useIsAuthenticated, useAccount } from "@azure/msal-react";
import { InteractionStatus, InteractionRequiredAuthError } from "@azure/msal-browser";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";

// Definícia scope pre Microsoft Graph API
const loginRequest = {
  scopes: ["User.Read", "openid", "profile", "email"],
};

export function MicrosoftLoginCta() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [configError, setConfigError] = useState<string | null>(null);
  const { instance, inProgress } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const account = useAccount();

  useEffect(() => {
    // Po prihlásení presmerovať na hlavnú stránku
    if (isAuthenticated && account) {
      router.replace("/");
    }
  }, [isAuthenticated, account, router]);

  const startLogin = async () => {
    if (inProgress !== InteractionStatus.None) {
      console.log("Login already in progress");
      return;
    }

    setLoading(true);
    setConfigError(null);

    try {
      // Pokus o silent login (pop-up)
      await instance.loginPopup(loginRequest);
    } catch (error) {
      console.error("Login failed:", error);
      
      if (error instanceof InteractionRequiredAuthError) {
        // Vyžaduje sa interaktívne prihlásenie
        try {
          await instance.loginPopup(loginRequest);
        } catch (popupError) {
          console.error("Popup login failed:", popupError);
          setConfigError("Prihlásenie zlyhalo. Skúste to prosím znova.");
        }
      } else if (error instanceof Error) {
        if (error.message.includes("popup")) {
          setConfigError("Pop-up bol zablokovaný. Povoľte prosím pop-up okná pre túto stránku.");
        } else {
          setConfigError(`Chyba pri prihlásení: ${error.message}`);
        }
      } else {
        setConfigError("Nastala neočakávaná chyba. Skúste to prosím znova.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Alternatívna metóda s redirect (lepšie pre niektoré prehliadače)
  const startLoginWithRedirect = async () => {
    if (inProgress !== InteractionStatus.None) return;
    
    setLoading(true);
    try {
      await instance.loginRedirect(loginRequest);
    } catch (error) {
      console.error("Redirect login failed:", error);
      setConfigError("Prihlásenie zlyhalo. Skúste to prosím znova.");
      setLoading(false);
    }
  };

  // Kontrola, či je MSAL inicializovaný
  const isMsalReady = instance && instance.getActiveAccount() !== undefined || true;

  return (
    <div className="relative flex min-h-full flex-col bg-background">
      <div className="absolute right-4 top-4 z-10 sm:right-6 sm:top-6">
        <ThemeToggle />
      </div>
      <div className="dashboard-bg flex flex-1 flex-col items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md"
        >
          <div className="mb-8 flex flex-col items-center text-center">
            <motion.div
              className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg"
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <Podcast className="size-8" aria-hidden />
            </motion.div>
            <h1 className="text-2xl font-semibold tracking-tight">Bookify</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Prihlásenie cez Microsoft (MSAL React) - používa @azure/msal-react
              s pop-up alebo redirect prihlásením.
            </p>
          </div>
          <Card className="border-border/80 shadow-lg">
            <CardHeader>
              <CardTitle>Prihlásenie</CardTitle>
              <CardDescription>
                Prihláste sa so svojím Microsoft účtom pre prístup k vašej audio knižnici.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {configError && (
                <p className="text-destructive text-sm">{configError}</p>
              )}
              
              {isAuthenticated && account ? (
                <p className="text-muted-foreground text-center text-sm">
                  Presmerúvam na hlavnú stránku...
                </p>
              ) : (
                <div className="space-y-3">
                  <Button
                    type="button"
                    className="h-11 w-full gap-2"
                    disabled={loading || inProgress !== InteractionStatus.None}
                    onClick={() => void startLogin()}
                  >
                    {loading || inProgress !== InteractionStatus.None ? (
                      <Loader2 className="size-4 animate-spin" aria-hidden />
                    ) : (
                      <svg
                        className="size-5"
                        viewBox="0 0 21 21"
                        aria-hidden
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <title>Microsoft</title>
                        <rect x="1" y="1" width="9" height="9" fill="#f25022" />
                        <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
                        <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
                        <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
                      </svg>
                    )}
                    Pokračovať s Microsoftom (Popup)
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    className="h-11 w-full gap-2"
                    disabled={loading || inProgress !== InteractionStatus.None}
                    onClick={() => void startLoginWithRedirect()}
                  >
                    {loading || inProgress !== InteractionStatus.None ? (
                      <Loader2 className="size-4 animate-spin" aria-hidden />
                    ) : (
                      <svg
                        className="size-5"
                        viewBox="0 0 21 21"
                        aria-hidden
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <title>Microsoft</title>
                        <rect x="1" y="1" width="9" height="9" fill="#f25022" />
                        <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
                        <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
                        <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
                      </svg>
                    )}
                    Pokračovať s Microsoftom (Redirect)
                  </Button>
                </div>
              )}
              
              <div className="mt-4 text-center text-xs text-muted-foreground">
                <p>Po prihlásení budete presmerovaní na hlavnú stránku.</p>
                <p className="mt-1">
                  Používa sa @azure/msal-react s automatickým token managementom.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}