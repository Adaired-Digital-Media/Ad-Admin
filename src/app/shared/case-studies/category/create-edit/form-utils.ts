import { CaseStudyCategoryType } from "@/core/types";
import { CaseStudyCategoryFormInput } from "@/validators/case-study-category.schema";

export function categoryDefaultValues(
  category?: CaseStudyCategoryType
): CaseStudyCategoryFormInput {
  return {
    _id: category?._id,
    parentCategory:
      category?.parentCategory &&
      typeof category.parentCategory === "object" &&
      category.parentCategory !== null
        ? (category.parentCategory as { _id: string })?._id
        : "",
    image: category?.image || "",
    name: category?.name || "",
    slug: category?.slug || "",
    status: category?.status || "active",
    metaTitle: category?.metaTitle || "",
    metaDescription: category?.metaDescription || "",
    canonicalLink: category?.canonicalLink?.includes("://")
      ? category?.canonicalLink?.split("/").pop()
      : category?.canonicalLink || "",
  };
}
