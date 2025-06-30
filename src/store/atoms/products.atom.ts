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

// Base atom
export const productsAtom = atom<ProductsState>({
  products: [],
  categories: [],
  searchQuery: "",
  selectedProductId: null,
  selectedCategoryId: null,
});

// Derived atoms
export const selectedProductAtom = atomWithCache((get) => {
  const { products, selectedProductId } = get(productsAtom);
  return products.find((product) => product._id === selectedProductId) || null;
});

export const selectedCategoryAtom = atomWithCache((get) => {
  const { categories, selectedCategoryId } = get(productsAtom);
  return (
    categories.find((category) => category._id === selectedCategoryId) || null
  );
});

export const filteredProductsAtom = atom((get) => {
  const { products, searchQuery } = get(productsAtom);
  if (!searchQuery.trim()) return products;

  const query = searchQuery?.toLowerCase();
  return products.filter(
    (product) =>
      product.name?.toLowerCase().includes(query) ||
      product.description?.toLowerCase().includes(query) ||
      product._id?.toLowerCase().includes(query)
  );
});

export const filteredCategoriesAtom = atom((get) => {
  const { categories, searchQuery } = get(productsAtom);
  if (!searchQuery.trim()) return categories;

  const query = searchQuery?.toLowerCase();
  return categories.filter(
    (category) =>
      category?.name?.toLowerCase().includes(query) ||
      category.description?.toLowerCase().includes(query) ||
      category._id?.toLowerCase().includes(query)
  );
});

// Helper function for API calls
const productApiRequest = async (
  method: "get" | "post" | "patch" | "delete",
  endpoint: string,
  token: string,
  data?: any
) => {
  try {
    const response = await axios({
      method,
      url: `${API_BASE_URL}${endpoint}`,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      data,
    });
    return response.data;
  } catch (error) {
    console.error(`Product API ${method.toUpperCase()} error:`, error);
    throw error;
  }
};

export const productActionsAtom = atom(
  null,
  async (
    get,
    set,
    action: {
      type:
        | "fetchProducts"
        | "fetchCategories"
        | "search"
        | "createProduct"
        | "updateProduct"
        | "deleteProduct"
        | "duplicateProduct"
        | "createCategory"
        | "updateCategory"
        | "deleteCategory"
        | "duplicateCategory"
        | "selectProduct"
        | "selectCategory";
      token: string;
      payload?: any;
    }
  ) => {
    const currentState = get(productsAtom);

    switch (action.type) {
      case "fetchProducts": {
        const { productId } = action.payload || {};
        const endpoint = productId
          ? `/product/read-product?id=${productId}`
          : `/product/read-product`;
        const data = await productApiRequest("get", endpoint, action.token);

        const products = productId
          ? Array.isArray(data.data)
            ? data.data
            : [data.data]
          : Array.isArray(data.data)
          ? data.data
          : [];

        set(productsAtom, {
          ...currentState,
          products: productId
            ? currentState.products.some((p) => p._id === productId)
              ? currentState.products.map((p) =>
                  p._id === productId ? products[0] : p
                )
              : [...currentState.products, ...products]
            : products,
        });
        return data;
      }

      case "fetchCategories": {
        const { categoryId } = action.payload || {};
        const endpoint = categoryId
          ? `/product/category/read-category?id=${categoryId}`
          : `/product/category/read-category`;
        const data = await productApiRequest("get", endpoint, action.token);

        const categories = categoryId
          ? Array.isArray(data.data)
            ? data.data
            : [data.data]
          : Array.isArray(data.data)
          ? data.data
          : [];

        set(productsAtom, {
          ...currentState,
          categories: categoryId
            ? currentState.categories.some((c) => c._id === categoryId)
              ? currentState.categories.map((c) =>
                  c._id === categoryId ? categories[0] : c
                )
              : [...currentState.categories, ...categories]
            : categories,
        });
        return data;
      }

      case "search": {
        set(productsAtom, {
          ...currentState,
          searchQuery: action.payload.query,
        });
        break;
      }

      case "selectProduct": {
        set(productsAtom, {
          ...currentState,
          selectedProductId: action.payload.productId,
        });
        break;
      }

      case "selectCategory": {
        set(productsAtom, {
          ...currentState,
          selectedCategoryId: action.payload.categoryId,
        });
        break;
      }

      case "createProduct": {
        const data = await productApiRequest(
          "post",
          "/products/create-product",
          action.token,
          action.payload
        );
        const newProduct = data.data || data;
        set(productsAtom, {
          ...currentState,
          products: [...currentState.products, newProduct],
          selectedProductId: newProduct._id,
        });
        await fetch("/api/revalidateTags?tags=products", { method: "GET" });
        return data;
      }

      case "updateProduct": {
        const { id, ...updateData } = action.payload;
        const data = await productApiRequest(
          "patch",
          "/products/update-product",
          action.token,
          updateData
        );
        const updatedProduct = data.data || data;
        set(productsAtom, {
          ...currentState,
          products: currentState.products.map((product) =>
            product._id === id ? updatedProduct : product
          ),
        });
        await fetch("/api/revalidateTags?tags=products", { method: "GET" });
        return data;
      }

      case "deleteProduct": {
        const { id } = action.payload;
        await productApiRequest(
          "delete",
          "/products/delete-product",
          action.token,
          { id }
        );
        set(productsAtom, {
          ...currentState,
          products: currentState.products.filter(
            (product) => product._id !== id
          ),
          selectedProductId:
            currentState.selectedProductId === id
              ? null
              : currentState.selectedProductId,
        });
        await fetch("/api/revalidateTags?tags=products", { method: "GET" });
        return { success: true };
      }

      case "duplicateProduct": {
        const { id } = action.payload;
        const data = await productApiRequest(
          "post",
          "/products/duplicate-product",
          action.token,
          { id }
        );
        const newProduct = data.data || data;
        set(productsAtom, {
          ...currentState,
          products: [...currentState.products, newProduct],
          selectedProductId: newProduct._id,
        });
        await fetch("/api/revalidateTags?tags=products", { method: "GET" });
        return data;
      }

      case "createCategory": {
        const data = await productApiRequest(
          "post",
          "/products/create-category",
          action.token,
          action.payload
        );
        const newCategory = data.data || data;
        set(productsAtom, {
          ...currentState,
          categories: [...currentState.categories, newCategory],
          selectedCategoryId: newCategory._id,
        });
        await fetch("/api/revalidateTags?tags=products", { method: "GET" });
        return data;
      }

      case "updateCategory": {
        const { id, ...updateData } = action.payload;
        const data = await productApiRequest(
          "patch",
          "/products/update-category",
          action.token,
          updateData
        );
        const updatedCategory = data.data || data;
        set(productsAtom, {
          ...currentState,
          categories: currentState.categories.map((category) =>
            category._id === id ? updatedCategory : category
          ),
        });
        await fetch("/api/revalidateTags?tags=products", { method: "GET" });
        return data;
      }

      case "deleteCategory": {
        const { id } = action.payload;
        await productApiRequest(
          "delete",
          "/products/delete-category",
          action.token,
          { id }
        );
        set(productsAtom, {
          ...currentState,
          categories: currentState.categories.filter(
            (category) => category._id !== id
          ),
          selectedCategoryId:
            currentState.selectedCategoryId === id
              ? null
              : currentState.selectedCategoryId,
        });
        await fetch("/api/revalidateTags?tags=products", { method: "GET" });
        return { success: true };
      }

      case "duplicateCategory": {
        const { id } = action.payload;
        const data = await productApiRequest(
          "post",
          "/products/duplicate-category",
          action.token,
          { id }
        );
        const newCategory = data.data || data;
        set(productsAtom, {
          ...currentState,
          categories: [...currentState.categories, newCategory],
          selectedCategoryId: newCategory._id,
        });
        await fetch("/api/revalidateTags?tags=products", { method: "GET" });
        return data;
      }
    }
  }
);
