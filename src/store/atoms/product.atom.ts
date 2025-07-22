/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { atom } from "jotai";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URI || "";

// Base atoms for blog-related state
export const productsAtom = atom<any[]>([]);
export const productsCategoryAtom = atom<any[]>([]);

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
    return response;
  } catch (error: any) {
    return error.response;
  }
};

export const productActionsAtom = atom(
  null,
  async (
    get,
    set,
    action: {
      type:
        | "createProduct"
        | "fetchAllProducts"
        | "fetchSingleProduct"
        | "updateProduct"
        | "deleteProduct"
        | "createCategory"
        | "fetchAllCategories"
        | "fetchSingleCategory"
        | "updateCategory"
        | "deleteCategory";
      token: string;
      payload?: any;
    }
  ) => {
    switch (action.type) {
      case "createProduct": {
        const data = await productApiRequest(
          "post",
          "/product/create-product",
          action.token,
          action.payload
        );
        if (data.status !== 201) {
          return data;
        }
        set(productsAtom, (prev) => [...prev, data.data]);
        await Promise.all([
          fetch("/api/revalidateTags?tags=products"),
          fetch(`${process.env.NEXT_PUBLIC_SITE_URI}/api/revalidatePage`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ slug: "/expert-content-solutions" }),
          }),
        ]);
        return data;
      }

      case "fetchAllProducts": {
        const data = await productApiRequest(
          "get",
          "/product/read-product",
          action.token
        );
        if (data.status !== 200) {
          return data;
        }
        set(productsAtom, data.data);
        return data;
      }

      case "fetchSingleProduct": {
        const { id } = action.payload;
        const data = await productApiRequest(
          "get",
          `/product/read-product?id=${id}`,
          action.token
        );
        if (data.status !== 200) {
          return data;
        }
        return data;
      }

      case "updateProduct": {
        const { id, ...updatedData } = action.payload;
        console.log("Updating product with ID:", id, "and data:", updatedData);
        const data = await productApiRequest(
          "patch",
          `/product/update-product?query=${id}`,
          action.token,
          updatedData
        );

        console.log("Update response data:", data.data.data);
        if (data.status !== 200) {
          return data;
        }
        set(productsAtom, (prev) =>
          prev.map((product) => (product._id === id ? data.data.data : product))
        );

        // Trigger revalidation in parallel
        const slug = data?.data?.data?.slug || "";
        const revalidate = await Promise.all([
          fetch("/api/revalidateTags?tags=products"),
          fetch(`${process.env.NEXT_PUBLIC_SITE_URI}/api/revalidatePage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ slug: `/expert-content-solutions` }),
          }),
          fetch(`${process.env.NEXT_PUBLIC_SITE_URI}/api/revalidatePage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              slug: `/expert-content-solutions/products/${slug}/form`,
            }),
          }),
        ]);
        if (revalidate.every((res) => res.ok)) {
          console.log("Revalidation successful");
        }

        return data;
      }

      case "deleteProduct": {
        const { id } = action.payload;
        const data = await productApiRequest(
          "delete",
          `/product/delete-product?query=${id}`,
          action.token
        );
        if (data.status !== 200) {
          return data;
        }
        set(productsAtom, (prev) => prev.filter((p) => p._id !== id));
        await Promise.all([
          fetch("/api/revalidateTags?tags=products"),
          fetch(`${process.env.NEXT_PUBLIC_SITE_URI}/api/revalidatePage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ slug: `/expert-content-solutions` }),
          }),
        ]);
        return data;
      }

      // ****************** Categories ******************
      case "createCategory": {
        const data = await productApiRequest(
          "post",
          "/product/category/create-category",
          action.token,
          action.payload
        );
        if (data.status !== 201) {
          return data;
        }
        set(productsCategoryAtom, (prev) => [data.data.data, ...prev]);
        await fetch("/api/revalidateTags?tags=product-categories");
        return data;
      }

      case "fetchAllCategories": {
        const data = await productApiRequest(
          "get",
          "/product/category/read-category",
          action.token
        );
        if (data.status !== 200) {
          return data;
        }
        set(productsCategoryAtom, data.data.data);
        return data;
      }

      case "fetchSingleCategory": {
        const { id } = action.payload;
        const data = await productApiRequest(
          "get",
          `/product/category/read-category?id=${id}`,
          action.token
        );
        if (data.status !== 200) {
          return data;
        }
        set(productsCategoryAtom, data.data.data);
        return data.data;
      }

      case "updateCategory": {
        const { id, ...updateData } = action.payload;
        const data = await productApiRequest(
          "patch",
          `/product/category/update-category?id=${id}`,
          action.token,
          updateData
        );
        if (data.status !== 200) {
          return data;
        }

        set(productsCategoryAtom, (prev) =>
          prev.map((category) =>
            category._id === id ? data.data.data : category
          )
        );
        await fetch("/api/revalidateTags?tags=product-categories");
        return data;
      }

      case "deleteCategory": {
        const { id } = action.payload;
        const data = await productApiRequest(
          "delete",
          `/product/category/delete-category?id=${id}`,
          action.token
        );
        if (data.status !== 200) {
          return data;
        }
        set(productsCategoryAtom, (prev) => prev.filter((c) => c._id !== id));
        await fetch("/api/revalidateTags?tags=product-categories");
        return data;
      }

      // Add other cases as needed
      default:
        throw new Error("Unknown action type");
    }
  }
);
