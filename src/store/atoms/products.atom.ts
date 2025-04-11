/* eslint-disable @typescript-eslint/no-explicit-any */
import { ProductCategoryType, ProductType } from "@/core/types";
import axios from "axios";
import { atom } from "jotai";
import { atomWithCache } from "jotai-cache";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URI || "";

// State type for products and categories
type ProductsState = {
  products: ProductType[];
  categories: ProductCategoryType[];
  searchQuery: string;
  selectedProductId: string | null;
  selectedCategoryId: string | null;
};

// Optional stats interfaces (if your backend provides them)
export interface ProductStats {
  totalProducts: number;
  activeProducts: number;
  totalCategories: number;
}

export interface StatsResponse {
  success: boolean;
  stats: ProductStats;
}

// Main state atom
export const productsAtom = atom<ProductsState>({
  products: [],
  categories: [],
  searchQuery: "",
  selectedProductId: null,
  selectedCategoryId: null,
});

// Cached atom for selected product
export const selectedProductAtom = atomWithCache((get) => {
  const { products, selectedProductId } = get(productsAtom);
  return products.find((product) => product._id === selectedProductId) || null;
});

// Cached atom for selected category
export const selectedCategoryAtom = atomWithCache((get) => {
  const { categories, selectedCategoryId } = get(productsAtom);
  return (
    categories.find((category) => category._id === selectedCategoryId) || null
  );
});

// Filtered products atom based on search query
export const filteredProductsAtom = atom((get) => {
  const { products, searchQuery } = get(productsAtom);
  if (!searchQuery.trim()) return products;

  const query = searchQuery.toLowerCase();
  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(query) ||
      product.description?.toLowerCase().includes(query) ||
      product._id?.toLowerCase().includes(query)
  );
});

// Filtered categories atom based on search query
export const filteredCategoriesAtom = atom((get) => {
  const { categories, searchQuery } = get(productsAtom);
  if (!searchQuery.trim()) return categories;

  const query = searchQuery.toLowerCase();
  return categories.filter(
    (category) =>
      category?.name?.toLowerCase().includes(query) ||
      category.description?.toLowerCase().includes(query) ||
      category._id?.toLowerCase().includes(query)
  );
});

// Main atom with actions for products and categories
export const productsWithActionsAtom = atom(
  (get) => get(productsAtom),
  async (
    get,
    set,
    action:
      | {
          type: "set";
          payload: {
            products?: ProductType[];
            categories?: ProductCategoryType[];
          };
        }
      | {
          type: "fetch";
          accessToken: string;
          productId?: string;
          categoryId?: string;
        }
      | { type: "search"; query: string }
      | { type: "createProduct"; accessToken: string; data: any }
      | { type: "updateProduct"; id: string; accessToken: string; data: any }
      | { type: "deleteProduct"; id: string; accessToken: string }
      | { type: "duplicateProduct"; id: string; accessToken: string }
      | { type: "createCategory"; accessToken: string; data: any }
      | { type: "updateCategory"; id: string; accessToken: string; data: any }
      | { type: "deleteCategory"; id: string; accessToken: string }
      | { type: "duplicateCategory"; id: string; accessToken: string }
      | { type: "selectProduct"; productId: string | null }
      | { type: "selectCategory"; categoryId: string | null }
      | { type: "fetchStats"; accessToken: string }
  ) => {
    const currentState = get(productsAtom);

    const fetchProducts = async (accessToken: string, productId?: string) => {
      try {
        const url = productId
          ? `${API_BASE_URL}/product/read-product?id=${productId}`
          : `${API_BASE_URL}/product/read-product`;
        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (res.status !== 200) throw new Error("Failed to fetch products");
        const data = res.data.data || res.data; 
        return productId
          ? Array.isArray(data)
            ? data
            : [data]
          : Array.isArray(data)
          ? data
          : [];
      } catch (error) {
        console.error("Fetch products failed:", error);
        return [];
      }
    };

    const fetchCategories = async (
      accessToken: string,
      categoryId?: string
    ) => {
      try {
        const url = categoryId
          ? `${API_BASE_URL}/product/category/read-category?id=${categoryId}`
          : `${API_BASE_URL}/product/category/read-category`;
        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (res.status !== 200) throw new Error("Failed to fetch categories");
        const data = res.data.data || res.data; // Adjust based on your API response
        return categoryId
          ? Array.isArray(data)
            ? data
            : [data]
          : Array.isArray(data)
          ? data
          : [];
      } catch (error) {
        console.error("Fetch categories failed:", error);
        return [];
      }
    };

    const fetchStats = async (accessToken: string) => {
      try {
        const res = await axios.get(`${API_BASE_URL}/products/stats`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (res.status !== 200) throw new Error("Failed to fetch stats");
        return res.data as StatsResponse;
      } catch (error) {
        console.error("Fetch stats failed:", error);
      }
    };

    switch (action.type) {
      case "set":
        set(productsAtom, {
          ...currentState,
          products: action.payload.products ?? currentState.products,
          categories: action.payload.categories ?? currentState.categories,
        });
        break;

      case "fetch":
        try {
          const products = action.productId
            ? await fetchProducts(action.accessToken, action.productId)
            : await fetchProducts(action.accessToken);
          const categories = action.categoryId
            ? await fetchCategories(action.accessToken, action.categoryId)
            : await fetchCategories(action.accessToken);
          set(productsAtom, {
            ...currentState,
            products: action.productId
              ? currentState.products.some((p) => p._id === action.productId)
                ? currentState.products.map((p) =>
                    p._id === action.productId ? products[0] : p
                  )
                : [...currentState.products, ...products]
              : products,
            categories: action.categoryId
              ? currentState.categories.some((c) => c._id === action.categoryId)
                ? currentState.categories.map((c) =>
                    c._id === action.categoryId ? categories[0] : c
                  )
                : [...currentState.categories, ...categories]
              : categories,
          });
        } catch (error) {
          console.error("Fetch failed:", error);
        }
        break;

      case "search":
        set(productsAtom, { ...currentState, searchQuery: action.query });
        break;

      case "selectProduct":
        set(productsAtom, {
          ...currentState,
          selectedProductId: action.productId,
        });
        break;

      case "selectCategory":
        set(productsAtom, {
          ...currentState,
          selectedCategoryId: action.categoryId,
        });
        break;

      case "createProduct":
        try {
          const res = await axios.post(
            `${API_BASE_URL}/products/create-product`,
            action.data,
            {
              headers: {
                Authorization: `Bearer ${action.accessToken}`,
                "Content-Type": "application/json",
              },
            }
          );
          if (res.status !== 201) throw new Error("Failed to create product");
          const newProduct = res.data.data || res.data;
          set(productsAtom, {
            ...currentState,
            products: [...currentState.products, newProduct],
            selectedProductId: newProduct._id,
          });
          await fetch("/api/revalidateTags?tags=products", { method: "GET" });
        } catch (error) {
          console.error("Create product failed:", error);
          throw error;
        }
        break;

      case "updateProduct":
        try {
          const res = await axios.patch(
            `${API_BASE_URL}/products/update-product`,
            action.data,
            {
              headers: { Authorization: `Bearer ${action.accessToken}` },
            }
          );
          if (res.status !== 200) throw new Error("Failed to update product");
          const updatedProduct = res.data.data || res.data;
          set(productsAtom, {
            ...currentState,
            products: currentState.products.map((product) =>
              product._id === action.id ? updatedProduct : product
            ),
          });
          await fetch("/api/revalidateTags?tags=products", { method: "GET" });
        } catch (error) {
          console.error("Update product failed:", error);
          throw error;
        }
        break;

      case "deleteProduct":
        try {
          const res = await axios.delete(
            `${API_BASE_URL}/products/delete-product`,
            {
              headers: { Authorization: `Bearer ${action.accessToken}` },
            }
          );
          if (res.status !== 200) throw new Error("Failed to delete product");
          set(productsAtom, {
            ...currentState,
            products: currentState.products.filter(
              (product) => product._id !== action.id
            ),
            selectedProductId:
              currentState.selectedProductId === action.id
                ? null
                : currentState.selectedProductId,
          });
          await fetch("/api/revalidateTags?tags=products", { method: "GET" });
        } catch (error) {
          console.error("Delete product failed:", error);
          throw error;
        }
        break;

      case "duplicateProduct":
        try {
          const res = await axios.post(
            `${API_BASE_URL}/products/duplicate-product`,
            { id: action.id },
            {
              headers: { Authorization: `Bearer ${action.accessToken}` },
            }
          );
          if (res.status !== 201)
            throw new Error("Failed to duplicate product");
          const newProduct = res.data.data || res.data;
          set(productsAtom, {
            ...currentState,
            products: [...currentState.products, newProduct],
            selectedProductId: newProduct._id,
          });
          await fetch("/api/revalidateTags?tags=products", { method: "GET" });
        } catch (error) {
          console.error("Duplicate product failed:", error);
          throw error;
        }
        break;

      case "createCategory":
        try {
          const res = await axios.post(
            `${API_BASE_URL}/products/create-category`,
            action.data,
            {
              headers: {
                Authorization: `Bearer ${action.accessToken}`,
                "Content-Type": "application/json",
              },
            }
          );
          if (res.status !== 201) throw new Error("Failed to create category");
          const newCategory = res.data.data || res.data;
          set(productsAtom, {
            ...currentState,
            categories: [...currentState.categories, newCategory],
            selectedCategoryId: newCategory._id,
          });
          await fetch("/api/revalidateTags?tags=products", { method: "GET" });
        } catch (error) {
          console.error("Create category failed:", error);
          throw error;
        }
        break;

      case "updateCategory":
        try {
          const res = await axios.patch(
            `${API_BASE_URL}/products/update-category`,
            action.data,
            {
              headers: { Authorization: `Bearer ${action.accessToken}` },
            }
          );
          if (res.status !== 200) throw new Error("Failed to update category");
          const updatedCategory = res.data.data || res.data;
          set(productsAtom, {
            ...currentState,
            categories: currentState.categories.map((category) =>
              category._id === action.id ? updatedCategory : category
            ),
          });
          await fetch("/api/revalidateTags?tags=products", { method: "GET" });
        } catch (error) {
          console.error("Update category failed:", error);
          throw error;
        }
        break;

      case "deleteCategory":
        try {
          const res = await axios.delete(
            `${API_BASE_URL}/products/delete-category`,
            {
              headers: { Authorization: `Bearer ${action.accessToken}` },
            }
          );
          if (res.status !== 200) throw new Error("Failed to delete category");
          set(productsAtom, {
            ...currentState,
            categories: currentState.categories.filter(
              (category) => category._id !== action.id
            ),
            selectedCategoryId:
              currentState.selectedCategoryId === action.id
                ? null
                : currentState.selectedCategoryId,
          });
          await fetch("/api/revalidateTags?tags=products", { method: "GET" });
        } catch (error) {
          console.error("Delete category failed:", error);
          throw error;
        }
        break;

      case "duplicateCategory":
        try {
          const res = await axios.post(
            `${API_BASE_URL}/products/duplicate-category`,
            { id: action.id },
            {
              headers: { Authorization: `Bearer ${action.accessToken}` },
            }
          );
          if (res.status !== 201)
            throw new Error("Failed to duplicate category");
          const newCategory = res.data.data || res.data;
          set(productsAtom, {
            ...currentState,
            categories: [...currentState.categories, newCategory],
            selectedCategoryId: newCategory._id,
          });
          await fetch("/api/revalidateTags?tags=products", { method: "GET" });
        } catch (error) {
          console.error("Duplicate category failed:", error);
          throw error;
        }
        break;

      case "fetchStats":
        try {
          const stats = await fetchStats(action.accessToken);
          if (stats?.success) {
            // Handle stats if needed (e.g., log or store separately)
            console.log("Product stats:", stats.stats);
          }
        } catch (error) {
          console.error("Fetch stats failed:", error);
        }
        break;
    }
  }
);
