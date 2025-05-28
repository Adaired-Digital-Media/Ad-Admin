// import { getToken } from "next-auth/jwt";
// import { NextRequest, NextResponse } from "next/server";
// import { routes } from "@/config/routes";

// export async function middleware(req: NextRequest) {
//   const token = await getToken({
//     req,
//     secret: process.env.NEXTAUTH_SECRET,
//     secureCookie: process.env.NODE_ENV === "production",
//   });

//   const { pathname } = req.nextUrl;

//   // Allow public routes
//   const isPublicRoute = [
//     routes.auth.signIn,
//     routes.auth.signUp,
//     "/auth/forgot-password",
//     "/auth/verify",
//     "/auth/reset-password",
//   ].some((route) => pathname.startsWith(route)) || pathname.match(/(_next\/static|_next\/image|\.png$)/);

//   if (isPublicRoute) {
//     return NextResponse.next();
//   }

//   // Check if token exists and is not expired
//   if (!token || !token.expiresAt || typeof token.expiresAt !== "string") {
//     const signInUrl = new URL(routes.auth.signIn, req.url);
//     signInUrl.searchParams.set("callbackUrl", req.url);
//     return NextResponse.redirect(signInUrl);
//   }

//   try {
//     const expiresAtDate = new Date(token.expiresAt);
//     if (isNaN(expiresAtDate.getTime()) || expiresAtDate < new Date()) {
//       const signInUrl = new URL(routes.auth.signIn, req.url);
//       signInUrl.searchParams.set("callbackUrl", req.url);
//       return NextResponse.redirect(signInUrl);
//     }
//   } catch (err) {
//     console.error("Invalid expiresAt format in middleware:", err);
//     const signInUrl = new URL(routes.auth.signIn, req.url);
//     signInUrl.searchParams.set("callbackUrl", req.url);
//     return NextResponse.redirect(signInUrl);
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     "/((?!api|_next/static|_next/image|.*\\.png$|auth/sign-in|auth/sign-up|auth/forgot-password|auth/verify|auth/reset-password).*)",
//   ],
// };

import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { routes } from "@/config/routes";
import { routePermissions, publicRoutes } from "@/config/route-permissions";
import { checkPermission, PermissionActions } from "@core/utils/permissions";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public routes (auth routes, static assets, etc.)
  const isPublicRoute =
    publicRoutes.includes(pathname) ||
    pathname.match(/(_next\/static|_next\/image|\.png$)/);

  if (isPublicRoute) {
    console.log(`Middleware: Allowing public route: ${pathname}`);
    return NextResponse.next();
  }

  // Get the user's session token
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV === "production",
  });

  // Check if token exists and is not expired
  if (!token || !token.expiresAt || typeof token.expiresAt !== "string") {
    const signInUrl = new URL(routes.auth.signIn, req.url);
    signInUrl.searchParams.set("callbackUrl", req.url);
    return NextResponse.redirect(signInUrl);
  }

  try {
    const expiresAtDate = new Date(token.expiresAt);
    if (isNaN(expiresAtDate.getTime()) || expiresAtDate < new Date()) {
      // console.log(
      //   `Middleware: Token expired for ${pathname}, redirecting to sign-in`
      // );
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

  // Check if user is a customer
  const isCustomer = token.role?.name === "customer";
  if (isCustomer) {
    return NextResponse.redirect(
      new URL(routes.auth["access-denied"], req.url)
    );
  }

  // Check route permissions
  const permission = routePermissions[pathname];
  if (!permission) {
    return NextResponse.next();
  }

  // Perform permission check
  const hasAccess = await checkPermission({
    session: {
      user: {
        accessToken: token.accessToken,
        isAdmin: token.isAdmin,
        role: token.role,
        _id: token._id,
        userStatus: token.userStatus,
      },
      expires: token.expiresAt,
    },
    entity: permission.entity,
    action:
      PermissionActions[permission.action as keyof typeof PermissionActions],
    cachedModules: [],
  });

  if (hasAccess) {
    console.log(`Middleware: Access granted for ${pathname}`);
    return NextResponse.next();
  } else {
    console.log(
      `Middleware: Access denied for ${pathname}, redirecting to unauthorized`
    );
    return NextResponse.redirect(new URL(routes.root.unauthorized, req.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
