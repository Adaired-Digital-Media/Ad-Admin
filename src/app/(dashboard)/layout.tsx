"use client";
import DefaultLayout from "@/layout/dashboard/layout";

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return <DefaultLayout>{children}</DefaultLayout>;
}
