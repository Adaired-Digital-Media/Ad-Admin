import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { routes } from "@/config/routes";

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV === "production",
  });

  const { pathname } = req.nextUrl;

  // Allow public routes
  const isPublicRoute = [
    routes.auth.signIn,
    routes.auth.signUp,
    "/auth/forgot-password",
    "/auth/verify",
    "/auth/reset-password",
  ].some((route) => pathname.startsWith(route)) || pathname.match(/(_next\/static|_next\/image|\.png$)/);

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Check if token exists and is not expired
  if (!token || !token.expiresAt || typeof token.expiresAt !== "string") {
    const signInUrl = new URL(routes.auth.signIn, req.url);
    signInUrl.searchParams.set("callbackUrl", req.url);
    return NextResponse.redirect(signInUrl);
  }

  try {
    const expiresAtDate = new Date(token.expiresAt);
    if (isNaN(expiresAtDate.getTime()) || expiresAtDate < new Date()) {
      const signInUrl = new URL(routes.auth.signIn, req.url);
      signInUrl.searchParams.set("callbackUrl", req.url);
      return NextResponse.redirect(signInUrl);
    }
  } catch (err) {
    console.error("Invalid expiresAt format in middleware:", err);
    const signInUrl = new URL(routes.auth.signIn, req.url);
    signInUrl.searchParams.set("callbackUrl", req.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|.*\\.png$|auth/sign-in|auth/sign-up|auth/forgot-password|auth/verify|auth/reset-password).*)",
  ],
};