import axios from "axios";
import { routes } from "@/config/routes";
import { NextAuthConfig, Session, User } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";

const isAuthRoute = (pathname: string) => {
  const authRoutePatterns = [/\/auth\/signIn/, /\/auth\/signUp/];
  return authRoutePatterns.some((pattern) => pattern.test(pathname));
};

export default {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET as string,
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_API_URI}/auth/login`,
            {
              email: credentials?.email,
              password: credentials?.password,
            }
          );

          const { accessToken, user } = res.data;
          console.log("User : ", user);

          if (!accessToken || !user) {
            throw new Error("Invalid credentials.");
          }
          return { accessToken, ...user };
        } catch (err) {
          console.error("Authorize error:", err);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // This callback runs after the user successfully signs in
      if (account?.provider === "google") {
        try {
          // Make a request to your backend to create the user without logging them in
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_API_URI}/auth/register`,
            {
              googleId: user.id,
              image: user.image,
              name: user.name,
              email: user.email,
            }
          );
          console.log("Google user registered:", response.data);
        } catch (error) {
          console.error("Failed to register Google user: ", error);
        }

        return true;
      }

      return true;
    },
    async authorized({ request: { nextUrl }, auth }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = nextUrl;
      if (isAuthRoute(pathname)) {
        if (isLoggedIn) {
          return Response.redirect(new URL(routes.root.dashboard, nextUrl));
        }
        return true;
      }
      return isLoggedIn;
    },
    async jwt({
      token,
      user,
      trigger,
      session,
    }: {
      token: JWT;
      user?: User;
      trigger?: "signIn" | "signUp" | "update";
      session?: Session;
    }) {
      if (user) {
        token._id = user._id;
        token.name = user.name || "";
        token.image = user.image || "";
        token.userName = user.userName;
        token.email = user.email ?? "";
        token.contact = user.contact;
        token.isAdmin = user.isAdmin;
        token.userStatus = user.userStatus;
        token.isVerifiedUser = user.isVerifiedUser || false;
        token.role = user.role;
        token.accessToken = user.accessToken;
      }

      if (trigger === "update" && session?.user) {
        return {
          ...token,
          name: session.user.name || token.name,
          image: session.user.image || token.image,
          userName: session.user.userName || token.userName,
          email: session.user.email || token.email,
          contact: session.user.contact || token.contact,
          isAdmin: session.user.isAdmin ?? token.isAdmin,
          userStatus: session.user.userStatus ?? token.userStatus,
          isVerifiedUser: session.user.isVerifiedUser ?? token.isVerifiedUser,
          role: session.user.role || token.role,
          accessToken: token.accessToken,
        };
      }
      return token;
    },
    async session({ session, token }) {
      if (!token) return session;
      session.user = {
        ...session.user,
        _id: token._id as string,
        name: token.name,
        image: token.image,
        userName: token.userName,
        email: token.email,
        contact: token.contact,
        isAdmin: token.isAdmin ?? false,
        userStatus: token.userStatus ?? false,
        isVerifiedUser: token.isVerifiedUser ?? false,
        role: token.role,
        accessToken: token.accessToken as string,
      };
      return session;
    },
    async redirect({ url, baseUrl }) {
      const parsedUrl = new URL(url, baseUrl);

      if (parsedUrl.searchParams.has("callbackUrl")) {
        const callbackUrl = parsedUrl.searchParams.get("callbackUrl")!;
        return callbackUrl.startsWith(baseUrl)
          ? callbackUrl
          : `${baseUrl}${callbackUrl}`;
      }
      return `${baseUrl}`;
    },
  },
  pages: {
    signIn: routes.auth.signIn,
    signOut: routes.auth.signIn,
  },
  session: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
} satisfies NextAuthConfig;
