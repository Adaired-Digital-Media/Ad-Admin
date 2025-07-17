/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { atom } from "jotai";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URI || "";

// Base atoms for blog-related state
export const blogsAtom = atom<any[]>([]);
export const blogCategoryAtom = atom<any[]>([]);

// Helper function for API calls
const blogApiRequest = async (
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

export const blogActionsAtom = atom(
  null,
  async (
    get,
    set,
    action: {
      type:
        | "createBlog"
        | "fetchAllBlog"
        | "fetchSingleBlog"
        | "updateBlog"
        | "deleteBlog"
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
      case "createBlog": {
        const data = await blogApiRequest(
          "post",
          "/blog/create",
          action.token,
          action.payload
        );
        if (data.status !== 201) {
          return data;
        }
        set(blogsAtom, (prev) => [...prev, data.data]);
        await Promise.all([
          fetch("/api/revalidateTags?tags=blog"),
          fetch(`${process.env.NEXT_PUBLIC_SITE_URI}/api/revalidatePage`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ slug: "/blog" }),
          }),
        ]);

        return data;
      }

      case "fetchAllBlog": {
        const data = await blogApiRequest("get", "/blog/read", action.token);
        if (data.status !== 200) {
          return data;
        }
        set(blogsAtom, data.data.data);
        return data;
      }

      case "fetchSingleBlog": {
        const { id } = action.payload;
        const data = await blogApiRequest(
          "get",
          `/blog/read?id=${id}`,
          action.token
        );
        if (data.status !== 200) {
          return data;
        }
        set(blogsAtom, (prev) =>
          prev.map((blog) => (blog._id === id ? data.data.data : blog))
        );
        return data;
      }

      case "updateBlog": {
        const { id, ...updateData } = action.payload;
        const updatedBlog = await blogApiRequest(
          "patch",
          `/blog/update?id=${id}`,
          action.token,
          updateData
        );
        if (updatedBlog.status !== 200) {
          return updatedBlog;
        }
        set(blogsAtom, (prev) =>
          prev.map((blog) =>
            blog._id === id ? { ...blog, ...updatedBlog.data } : blog
          )
        );

        await Promise.all([
          fetch("/api/revalidateTags?tags=blog"),
          fetch(`${process.env.NEXT_PUBLIC_SITE_URI}/api/revalidatePage`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ slug: `/blog/${updatedBlog.data.data.slug}` }),
          }),
        ]);

        return updatedBlog;
      }

      case "deleteBlog": {
        const { id } = action.payload;
        const response = await blogApiRequest(
          "delete",
          `/blog/delete?id=${id}`,
          action.token
        );
        if (response.status !== 200) {
          return response;
        }
        set(blogsAtom, (prev) => prev.filter((blog) => blog._id !== id));
        await Promise.all([
          fetch("/api/revalidateTags?tags=blog"),
          fetch(`${process.env.NEXT_PUBLIC_SITE_URI}/api/revalidatePage`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ slug: `/blog` }),
          }),
        ]);
        return response;
      }

      case "createCategory": {
        const categoryData = await blogApiRequest(
          "post",
          "/blog-category/create",
          action.token,
          action.payload
        );
        if (categoryData.status !== 201) {
          return categoryData;
        }
        set(blogCategoryAtom, (prev) => [...prev, categoryData.data.data]);
        await fetch("/api/revalidateTags?tags=blog-category");
        return categoryData;
      }
      case "fetchAllCategories": {
        const categoryData = await blogApiRequest(
          "get",
          "/blog-category/read",
          action.token
        );
        if (categoryData.status !== 200) {
          return categoryData;
        }
        set(blogCategoryAtom, categoryData.data.data);
        return categoryData;
      }
      case "fetchSingleCategory": {
        const { id } = action.payload;
        const categoryData = await blogApiRequest(
          "get",
          `/blog-category/read?id=${id}`,
          action.token
        );
        if (categoryData.status !== 200) {
          return categoryData;
        }
        set(blogCategoryAtom, categoryData.data.data);
        return categoryData;
      }
      case "updateCategory": {
        const { id, ...updateData } = action.payload;
        const updatedCategory = await blogApiRequest(
          "patch",
          `/blog-category/update?id=${id}`,
          action.token,
          updateData
        );
        if (updatedCategory.status !== 200) {
          return updatedCategory;
        }
        set(blogCategoryAtom, (prev) =>
          prev.map((category) =>
            category._id === id
              ? { ...category, ...updatedCategory.data.data, _id: category._id }
              : category
          )
        );
        await fetch("/api/revalidateTags?tags=blog-category");
        return updatedCategory;
      }
      case "deleteCategory": {
        const { id } = action.payload;
        const response = await blogApiRequest(
          "delete",
          `/blog-category/delete?id=${id}`,
          action.token
        );
        if (response.status !== 200) {
          return response;
        }
        set(blogCategoryAtom, (prev) =>
          prev.filter((category) => category._id !== id)
        );
        await fetch("/api/revalidateTags?tags=blog-category");
        return response;
      }
    }
  }
);
