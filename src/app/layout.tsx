import { Toaster } from "react-hot-toast";
import { SessionProvider } from "next-auth/react";
import GlobalDrawer from "@/app/shared/drawer-views/container";
import GlobalModal from "@/app/shared/modal-views/container";
import { JotaiProvider, ThemeProvider } from "@/app/shared/theme-provider";
import { siteConfig } from "@/config/site.config";
import { inter, lexendDeca } from "@/app/fonts";
import cn from "@core/utils/class-names";
import NextProgress from "@core/components/next-progress";
import type { Metadata } from "next";

// styles
// import 'swiper/css';
// import 'swiper/css/navigation';
import "@/app/globals.css";

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      dir="ltr"
      // required this one for next-themes, remove it if you are not using next-theme
      suppressHydrationWarning
    >
      <body
        // to prevent any warning that is caused by third party extensions like Grammarly
        suppressHydrationWarning
        className={cn(
          inter.variable,
          lexendDeca.variable,
          "font-inter antialiased"
        )}
      >
        <SessionProvider>
          <ThemeProvider>
            <NextProgress />
            <JotaiProvider>
              {children}
              <Toaster />
              <GlobalDrawer />
              <GlobalModal />
            </JotaiProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
