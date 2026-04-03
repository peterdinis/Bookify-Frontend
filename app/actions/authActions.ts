"use server";

import { cookies } from "next/headers";
import { actionClient } from "@/lib/safe-action";
import { z } from "zod";

/**
 * In a real Entra flow, the user is redirected to Microsoft.
 * This server action can be used to check if the session is alive
 * or to handle "logout" by clearing cookies.
 */

/** Server action — nevidí Entra cookie na API hoste. Pre Microsoft login použite `AuthProvider` / `fetchSessionUser`. */
export const getCurrentUserAction = actionClient
  .inputSchema(z.object({}))
  .action(async () => {
    const apiBase = process.env.API_URL || "http://localhost:5041";
    const url = `${apiBase}/api/auth/me`;

    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    // Try to get from cookie first (cache)
    const cachedUser = cookieStore.get("bookify-user")?.value;
    if (cachedUser) {
      try {
        return { success: true, user: JSON.parse(cachedUser) };
      } catch {
        // Fallback to fetch if parse fails
      }
    }

    try {
      const res = await fetch(url, {
        method: "GET",
        headers: {
          cookie: cookieHeader,
        },
        cache: "no-store",
      });

      if (!res.ok) {
        return { success: false, error: "Not authenticated" };
      }

      const user = await res.json();

      // Store in cookie for persistence/caching (expire in 1 day)
      cookieStore.set("bookify-user", JSON.stringify(user), {
        httpOnly: false, // Allow client access if needed
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24,
      });

      return { success: true, user };
    } catch (error) {
      console.error("Auth check failed:", error);
      return { success: false, error: "Failed to connect to backend" };
    }
  });

export const loginAction = actionClient
  .inputSchema(
    z.object({
      email: z.string().email(),
      password: z.string().min(1),
    }),
  )
  .action(async ({ parsedInput }) => {
    // This is a MOCK login for development to demonstrate the cookie logic.
    // In a real app, you'd call a backend login endpoint or Entra ID.
    const mockUser = {
      id: "00000000-0000-0000-0000-000000000001",
      name: parsedInput.email.split("@")[0],
      email: parsedInput.email,
      role: "User",
      isActive: true,
    };

    const cookieStore = await cookies();
    cookieStore.set("bookify-user", JSON.stringify(mockUser), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
    });

    // Also set a mock session cookie if backend needs it (not used here yet)
    // cookieStore.set("session", "mock-session-token");

    return { success: true, user: mockUser };
  });

export const logoutAction = actionClient
  .inputSchema(z.object({}))
  .action(async () => {
    const cookieStore = await cookies();
    cookieStore.delete("bookify-user");
    // cookieStore.delete("session");
    return { success: true };
  });
