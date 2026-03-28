import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/** Inline env helpers — Next 16 middleware bundler may not resolve `@/` imports from `lib/`. */
function getServerApiBaseUrl(): string {
  const fromServer = process.env.API_URL?.replace(/\/$/, "");
  if (fromServer) return fromServer;
  return process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";
}

function getAuthMePath(): string {
  return process.env.AUTH_ME_PATH?.trim() || "/auth/me";
}

function getAuthMeUrl(): string {
  const base = getServerApiBaseUrl();
  const path = getAuthMePath();
  const p = path.startsWith("/") ? path : `/${path}`;
  if (!base) return "";
  return `${base}${p}`;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    /\.(?:svg|png|jpg|jpeg|gif|webp|ico)$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  const meUrl = getAuthMeUrl();
  const baseConfigured = Boolean(getServerApiBaseUrl());

  // If not configured, we can't check auth, but we should probably still allow access to /login
  if (!baseConfigured || !meUrl) {
    if (pathname === "/login") return NextResponse.next();
    // If not configured and not on /login, we might want to redirect to /login anyway or show an error
    // For now, let's keep it simple: if not configured, just proceed to allow dev work without backend
    return NextResponse.next();
  }

  let authenticated = false;
  const cookieStore = request.cookies;
  const cachedUser = cookieStore.get("bookify-user")?.value;

  if (cachedUser) {
    authenticated = true;
  } else {
    try {
      const res = await fetch(meUrl, {
        method: "GET",
        headers: {
          cookie: request.headers.get("cookie") ?? "",
        },
        cache: "no-store",
      });
      authenticated = res.ok;
    } catch {
      authenticated = false;
    }
  }

  if (pathname === "/login") {
    if (authenticated) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  if (!authenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
