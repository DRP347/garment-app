import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { authDebug, getAuthSecret } from "./lib/auth-secret";

function dashboardPathForRole(role?: unknown) {
  if (role === "admin") return "/dashboard/admin";
  if (role === "seller") return "/dashboard/seller";
  if (role === "buyer") return "/dashboard/buyer";
  return "/dashboard";
}

function hasKnownRole(role?: unknown) {
  return role === "admin" || role === "seller" || role === "buyer";
}

function requiredRoleForDashboardPath(pathname: string) {
  if (pathname.startsWith("/dashboard/admin")) return "admin";
  if (pathname.startsWith("/dashboard/seller")) return "seller";
  if (pathname.startsWith("/dashboard/buyer")) return "buyer";
  return null;
}

function usesSecureAuthCookie(req: NextRequest) {
  return (
    req.nextUrl.protocol === "https:" ||
    req.headers.get("x-forwarded-proto") === "https"
  );
}

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const token = await getToken({
    req,
    secret: getAuthSecret(),
    secureCookie: usesSecureAuthCookie(req),
  });

  authDebug("middleware token", {
    pathname,
    hasToken: Boolean(token),
    role: token?.role,
    secureCookie: usesSecureAuthCookie(req),
  });

  if (pathname === "/after-login") {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.redirect(new URL(dashboardPathForRole(token.role), req.url));
  }

  if (pathname === "/login" && token && hasKnownRole(token.role)) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (pathname.startsWith("/api/admin")) {
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (token.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.next();
  }

  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const requiredRole = requiredRoleForDashboardPath(pathname);

    if (requiredRole && token.role !== requiredRole) {
      return NextResponse.redirect(
        new URL(dashboardPathForRole(token.role), req.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/after-login", "/login", "/dashboard/:path*", "/api/admin/:path*"],
};
