import axios from "axios";
import { routes } from "@/config/routes";
import { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

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
          console.log("User : ", user)

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
        // console.log("***********************************************");
        // console.log("User: ", user);
        // console.log("***********************************************");
        // console.log("Account Provider: ", account?.provider);
        // console.log("***********************************************");
        // console.log("Account Access Token: ", account?.access_token);
        // console.log("***********************************************");
        // console.log("Account ID Token: ", account?.id_token);
        // console.log("***********************************************");
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
          if (response.status === 201) {
          }
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
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token._id = user._id;
        token.name = user.name || "";
        token.userName = user.userName;
        token.email = user.email || "";
        token.contact = user.contact;
        token.isAdmin = user.isAdmin;
        token.userStatus = user.userStatus;
        token.isVerifiedUser = user.isVerifiedUser || false;
        token.role = user.role;
        token.accessToken = user.accessToken;
      }
      if (trigger === "update" && session) {
        token = { ...token, ...session };
      }
      return token;
    },
    async session({ session, token }) {
      session.user._id = token._id as string;
      session.user.name = token.name;
      session.user.userName = token.userName;
      session.user.email = token.email;
      session.user.contact = token.contact;
      session.user.isAdmin = token.isAdmin;
      session.user.userStatus = token.userStatus;
      session.user.isVerifiedUser = token.isVerifiedUser || false;
      session.user.role = token.role;
      session.user.accessToken = token.accessToken as string;
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
} satisfies NextAuthConfig;
