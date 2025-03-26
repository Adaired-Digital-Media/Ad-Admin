import NextAuth from "next-auth";

import authConfig from "@/app/api/auth/[...nextauth]/auth-config";

export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|.*\\.png$|auth/sign-in|auth/sign-up|auth/forgot-password|auth/verify|auth/reset-password).*)",
  ],
};
