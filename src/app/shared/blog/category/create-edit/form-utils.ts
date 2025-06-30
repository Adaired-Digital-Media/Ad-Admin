import { BlogCategoryType } from "@/core/types";
import { BlogCategoryFormInput } from "@/validators/blog-category.schema";

export function categoryDefaultValues(
  category?: BlogCategoryType
): BlogCategoryFormInput {
  return {
    _id: category?._id,
    parentCategory:
      category?.parentCategory && typeof category.parentCategory === "object"
        ? (category.parentCategory as { _id: string })?._id
        : "",
    image: category?.image || "",
    name: category?.name || "",
    slug: category?.slug || "",
    status: category?.status || "",
  };
}
