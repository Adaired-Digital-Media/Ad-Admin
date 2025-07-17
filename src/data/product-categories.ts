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

