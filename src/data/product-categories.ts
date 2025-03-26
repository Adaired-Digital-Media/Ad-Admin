export type ProductCategoryType = {
  _id: string;
  name: string;
  description: string;
  parentCategory: ProductCategoryType | null;
  children: ProductCategoryType[];
  products: string[];
  slug: string;
  image: string;
  metaTitle: string;
  metaDescription: string;
  canonicalLink: string;
  status: string;
  createdBy: string;
  updatedBy: string | null;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};

export const fetchProductCategories = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_API_URI}/product/category/read-category`,
    { next: { tags: ["product-categories"] } }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch product categories: ${response.statusText}`
    );
  }

  const data = await response.json();
  return data.data;
};
