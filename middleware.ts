import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/** Inline env helpers — middleware bundler v Next 16 občas nevyrieši `@/` importy z `lib/`. */
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

  if (!baseConfigured || !meUrl) {
    return NextResponse.next();
  }

  let authenticated = false;
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
