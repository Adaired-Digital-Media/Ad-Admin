export type ProductType = {
  _id: string;
  featuredImage: string;
  name: string;
  description: string;
  category: Category;
  subCategory: string[];
  minimumQuantity: number;
  minimumWords: number | null;
  slug: string;
  pricePerUnit: number;
  pricingType: "perQuantity" | "perWord";
  stock: number;
  images: string[];
  tags: string[];
  priority: number;
  keywords: string[];
  formId: string;
  metaTitle: string;
  metaDescription: string;
  canonicalLink: string;
  status: string;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};

interface Category {
  _id: string;
  name: string;
  description: string;
  parentCategory: string | null;
  children: string[];
  products: string[];
  slug: string;
  image: string;
  metaTitle: string;
  metaDescription: string;
  canonicalLink: string;
  status: "Active" | "Inactive";
  createdBy: string;
  updatedBy: string | null;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export const fetchProducts = async () => {
  const _response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_API_URI}/product/read-product`,
    {
      next: {
        tags: ["products"],
      },
    }
  );
  const response = await _response.json();

  return response?.data;
};

export const fetchProductBySlug = async (slug: string) => {
  const _response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_API_URI}/product/category/read-category?identifier=${slug}`
  );
  const response = await _response.json();
  return response?.data;
};
