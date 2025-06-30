"use client";
import InactivityTracker from "@/core/utils/inactivity-tracker";
import { SessionProvider, useSession, signOut } from "next-auth/react";
import { useEffect } from "react";

function TokenExpirationChecker({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  useEffect(() => {
    if (!session) return;

    const checkTokenExpiration = () => {
      if (session?.expires) {
        const now = new Date();
        const expiresAt = new Date(session.expires);
        if (now > expiresAt) {
          signOut({ callbackUrl: "/auth/signIn" });
        }
      }
    };

    // Check immediately
    checkTokenExpiration();

    // Set up interval to check every minute
    const interval = setInterval(checkTokenExpiration, 60 * 1000);

    return () => clearInterval(interval);
  }, [session]);

  return <>{children}</>;
}

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <InactivityTracker />
      <TokenExpirationChecker>{children}</TokenExpirationChecker>
    </SessionProvider>
  );
}
