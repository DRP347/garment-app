import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  // On hitting /after-login we route based on role
  if (req.nextUrl.pathname === "/after-login") {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const role = (token as any)?.role || "buyer";
    const dest = role === "seller" ? "/dashboard/seller" : "/";
    return NextResponse.redirect(new URL(dest, req.url));
  }
  return NextResponse.next();
}

// only run for /after-login
export const config = {
  matcher: ["/after-login"],
};
