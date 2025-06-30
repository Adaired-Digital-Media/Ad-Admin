"use client";

import Link from "next/link";
import HamburgerButton from "@/layout/hamburger-button";
import Sidebar from "@/layout/dashboard/sidebar";
import HeaderMenuRight from "@/layout/header-menu-right";
import StickyHeader from "@/layout/sticky-header";
import SearchWidget from "@/app/shared/search/search";
import Image from "next/image";
import { routes } from "@/config/routes";

export default function Header() {
  return (
    <StickyHeader className="z-[990] 2xl:py-5 3xl:px-8 4xl:px-10">
      <div className="flex w-full max-w-2xl items-center">
        <HamburgerButton
          view={<Sidebar className="static w-full 2xl:w-full" />}
        />

        <Link
          href={routes.root.dashboard}
          aria-label="Site Logo"
          className="me-4 w-9 shrink-0 text-gray-800 hover:text-gray-900 lg:me-5 xl:hidden"
        >
          <Image
            src="/logo-short.svg"
            alt="Adaired Logo"
            width={60}
            height={60}
            priority
            className=""
          />
        </Link>

        <SearchWidget />
      </div>

      <HeaderMenuRight />
    </StickyHeader>
  );
}
