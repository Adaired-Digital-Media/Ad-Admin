import { CaseStudyType } from "@core/types";
import { CaseStudyFormInput } from "@/validators/case-study.schema";

export function caseStudyDefaultValues(
  caseStudy?: CaseStudyType
): CaseStudyFormInput {
  return {
    _id: caseStudy?._id || undefined,
    category:
      caseStudy?.category && typeof caseStudy.category === "object"
        ? (caseStudy.category as { _id: string })?._id
        : caseStudy?.category?.toString() || "",
    name: caseStudy?.name || "",
    slug: caseStudy?.slug || "",
    colorScheme: caseStudy?.colorScheme || "",
    status: caseStudy?.status || "inactive",
    bodyData: caseStudy?.bodyData || [],
    seo: {
      metaTitle: caseStudy?.seo?.metaTitle || "",
      metaDescription: caseStudy?.seo?.metaDescription || "",
      canonicalLink: caseStudy?.seo?.canonicalLink || "",
      focusKeyword: caseStudy?.seo?.focusKeyword || "",
      keywords: caseStudy?.seo?.keywords || [],
      openGraph: {
        title: caseStudy?.seo?.openGraph?.title || "",
        description: caseStudy?.seo?.openGraph?.description || "",
        image: caseStudy?.seo?.openGraph?.image || "",
        type: caseStudy?.seo?.openGraph?.type || "website",
        url: caseStudy?.seo?.openGraph?.url || "",
        siteName: caseStudy?.seo?.openGraph?.siteName || "",
      },
      twitterCard: {
        cardType:
          caseStudy?.seo?.twitterCard?.cardType || "summary_large_image",
        site: caseStudy?.seo?.twitterCard?.site || "",
        creator: caseStudy?.seo?.twitterCard?.creator || "",
        title: caseStudy?.seo?.twitterCard?.title || "",
        description: caseStudy?.seo?.twitterCard?.description || "",
        image: caseStudy?.seo?.twitterCard?.image || "",
      },
      robotsText: caseStudy?.seo?.robotsText || "index,follow",
      schemaOrg: caseStudy?.seo?.schemaOrg || "",
      bodyScript: caseStudy?.seo?.bodyScript || "",
      headerScript: caseStudy?.seo?.headerScript || "",
      footerScript: caseStudy?.seo?.footerScript || "",
      priority: caseStudy?.seo?.priority || 0.5,
      changeFrequency: caseStudy?.seo?.changeFrequency || "monthly",
      redirect: {
        type: caseStudy?.seo?.redirect?.type || null,
        url: caseStudy?.seo?.redirect?.url || "",
      },
    },
  };
}
