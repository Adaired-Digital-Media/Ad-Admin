import { BlogTypes } from "@/core/types";
import { BlogFormInput } from "@/validators/blog.schema";

export function blogDefaultValues(blog?: BlogTypes): BlogFormInput {
  return {
    _id: blog?._id || undefined,
    postTitle: blog?.postTitle || "",
    postDescription: blog?.postDescription || "",
    slug: blog?.slug || "",
    featuredImage: blog?.featuredImage || "",
    category:
      blog?.category && typeof blog.category === "object"
        ? (blog.category as { _id: string })?._id
        : blog?.category?.toString() || "",
    tags: blog?.tags || [],
    status: blog?.status || "draft",
    seo: {
      metaTitle: blog?.seo?.metaTitle || "",
      metaDescription: blog?.seo?.metaDescription || "",
      canonicalLink: blog?.seo?.canonicalLink || "",
      focusKeyword: blog?.seo?.focusKeyword || "",
      keywords: blog?.seo?.keywords || [],
      openGraph: {
        title: blog?.seo?.openGraph?.title || "",
        description: blog?.seo?.openGraph?.description || "",
        image: blog?.seo?.openGraph?.image || "",
        type: blog?.seo?.openGraph?.type || "website",
        url: blog?.seo?.openGraph?.url || "",
        siteName: blog?.seo?.openGraph?.siteName || "",
      },
      twitterCard: {
        cardType: blog?.seo?.twitterCard?.cardType || "summary_large_image",
        site: blog?.seo?.twitterCard?.site || "",
        creator: blog?.seo?.twitterCard?.creator || "",
        title: blog?.seo?.twitterCard?.title || "",
        description: blog?.seo?.twitterCard?.description || "",
        image: blog?.seo?.twitterCard?.image || "",
      },
      robotsText: blog?.seo?.robotsText || "index,follow",
      schemaOrg: blog?.seo?.schemaOrg || "",
      bodyScript: blog?.seo?.bodyScript || "",
      headerScript: blog?.seo?.headerScript || "",
      footerScript: blog?.seo?.footerScript || "",
      priority: blog?.seo?.priority || 0.5,
      changeFrequency: blog?.seo?.changeFrequency || "monthly",
      redirect: {
        type: blog?.seo?.redirect?.type || null,
        url: blog?.seo?.redirect?.url || "",
      },
    },
  };
}