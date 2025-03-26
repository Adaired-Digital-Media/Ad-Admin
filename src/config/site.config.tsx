import { Metadata } from "next";
import logoImg from "@public/logo.svg";
import logoIconImg from "@public/logo-short.svg";
import { OpenGraph } from "next/dist/lib/metadata/types/opengraph-types";

enum MODE {
  DARK = "dark",
  LIGHT = "light",
}

export const siteConfig = {
  title: "Admin Dashboard ",
  description: ``,
  logo: logoImg,
  icon: logoIconImg,
  mode: MODE.LIGHT,
  // TODO: favicon
};

export const metaObject = (
  title?: string,
  openGraph?: OpenGraph,
  description: string = siteConfig.description
): Metadata => {
  return {
    title: title ? `${title} - Adaired Digital` : siteConfig.title,
    description,
    openGraph: openGraph ?? {
      title: title ? `${title} - AdaireDigital` : title,
      description,
      url: "",
      siteName: "Adaired Digital Media", // https://developers.google.com/search/docs/appearance/site-names
      images: {
        url: "",
        width: 1200,
        height: 630,
      },
      locale: "en_US",
      type: "website",
    },
  };
};
