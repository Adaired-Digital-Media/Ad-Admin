import { ProductCategoryType } from "@/core/types";
import { ProductCategoryFormInput } from "@/validators/product-category.schema";

export function categoryDefaultValues(
  category?: ProductCategoryType
): ProductCategoryFormInput {
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
