/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import cn from "@/core/utils/class-names";
import { Link } from "react-scroll";
import SimpleBar from "@core/ui/simplebar";
import { useAtom } from "jotai";
import { atom } from "jotai";

export type SectionType = {
  id: string;
  type: string;
  label: string;
  data: Record<string, any>;
};

export const dynamicSectionsAtom = atom<SectionType[]>([]);

export const formParts = {
  seoSettings: "seoSettings",
};

export const menuItems = [
  { label: "SEO Settings", value: formParts.seoSettings },
];

interface PageNavProps {
  className?: string;
}

export default function PageNav({ className }: PageNavProps) {
  const [dynamicSections] = useAtom(dynamicSectionsAtom);

  return (
    <div
      className={cn(
        "sticky top-[68px] z-20 border-b border-gray-300 bg-white py-0 font-medium text-gray-500 @2xl:top-[72px] dark:bg-gray-50 2xl:top-20",
        className
      )}
    >
      <SimpleBar>
        <div className="inline-grid grid-flow-col gap-5 md:gap-7 lg:gap-10">
          {dynamicSections.map((section) => (
            <Link
              key={section.id}
              to={section.id}
              spy={true}
              hashSpy={true}
              smooth={true}
              offset={-150}
              duration={500}
              className="relative cursor-pointer whitespace-nowrap py-4 hover:text-gray-1000"
              activeClass="active before:absolute before:bottom-0 before:left-0 before:z-[1] before:h-0.5 before:w-full before:bg-gray-1000 font-semibold text-gray-1000"
            >
              {section.label}
            </Link>
          ))}
          <Link
            to={formParts.seoSettings}
            spy={true}
            hashSpy={true}
            smooth={true}
            offset={-150}
            duration={500}
            className="relative cursor-pointer whitespace-nowrap py-4 hover:text-gray-1000"
            activeClass="active before:absolute before:bottom-0 before:left-0 before:z-[1] before:h-0.5 before:w-full before:bg-gray-1000 font-semibold text-gray-1000"
          >
            SEO Settings
          </Link>
        </div>
      </SimpleBar>
    </div>
  );
}