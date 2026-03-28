import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * Middleware handles auth protection by checking the 'bookify-user' cookie
 * or calling the proxied /api/auth/me endpoint.
 */
export async function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    /\.(?:svg|png|jpg|jpeg|gif|webp|ico)$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  let authenticated = false;
  const cookieStore = request.cookies;
  const cachedUser = cookieStore.get("bookify-user")?.value;

  if (cachedUser) {
    authenticated = true;
  } else {
    try {
      // Use the local proxied endpoint
      const meUrl = new URL("/api/auth/me", origin);
      const res = await fetch(meUrl.toString(), {
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
