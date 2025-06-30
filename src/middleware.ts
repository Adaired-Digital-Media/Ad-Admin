import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { routes } from "@/config/routes";
import { routePermissions, publicRoutes } from "@/config/permissions.config";
import { checkPermission } from "@/core/utils/permissions.utils";
import { auth } from "./auth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = await auth();

  const isPublicRoute =
    publicRoutes.includes(pathname) ||
    pathname.match(/(_next\/static|_next\/image|\.png$)/);

  if (isPublicRoute) {
    return NextResponse.next();
  }

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV === "production",
  });

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
    console.error("Middleware: Invalid expiresAt format:", err);
    const signInUrl = new URL(routes.auth.signIn, req.url);
    signInUrl.searchParams.set("callbackUrl", req.url);
    return NextResponse.redirect(signInUrl);
  }

  const isCustomer = token.role?.name === "customer";
  if (isCustomer) {
    return NextResponse.redirect(new URL(routes.auth["access-denied"], req.url));
  }

  const permission = routePermissions[pathname];
  if (!permission) {
    return NextResponse.next();
  }

  const hasAccess = await checkPermission({
    session,
    entity: permission.entity,
    action: permission.action,
    cachedModules: [],
  });

  return hasAccess
    ? NextResponse.next()
    : NextResponse.redirect(new URL(routes.root.unauthorized, req.url));
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};