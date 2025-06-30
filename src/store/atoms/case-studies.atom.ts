/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { atom } from "jotai";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URI || "";

// Base atoms for case study-related state
export const caseStudiesAtom = atom<any[]>([]);
export const caseStudyCategoryAtom = atom<any[]>([]);

// Helper function for API calls
const caseStudyApiRequest = async (
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

export const caseStudyActionsAtom = atom(
  null,
  async (
    get,
    set,
    action: {
      type:
        | "createCaseStudy"
        | "fetchAllCaseStudies"
        | "fetchSingleCaseStudy"
        | "updateCaseStudy"
        | "deleteCaseStudy"
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
      case "createCaseStudy": {
        const data = await caseStudyApiRequest(
          "post",
          "/case-study/create",
          action.token,
          action.payload
        );
        if (data.status !== 201) {
          return data;
        }
        set(caseStudiesAtom, (prev) => [...prev, data.data]);
        await fetch("/api/revalidate?tag=case-study");
        return data;
      }
      case "fetchAllCaseStudies": {
        const data = await caseStudyApiRequest(
          "get",
          "/case-study/read",
          action.token
        );
        if (data.status !== 200) {
          return data;
        }
        set(caseStudiesAtom, data.data.data);
        return data;
      }
      case "fetchSingleCaseStudy": {
        const { id } = action.payload;
        const data = await caseStudyApiRequest(
          "get",
          `/case-study/read?id=${id}`,
          action.token
        );
        if (data.status !== 200) {
          return data;
        }
        set(caseStudiesAtom, (prev) =>
          prev.map((caseStudy) => (caseStudy._id === id ? data.data.data : caseStudy))
        );
        return data;
      }
      case "updateCaseStudy": {
        const { id, ...updateData } = action.payload;
        const updatedCaseStudy = await caseStudyApiRequest(
          "patch",
          `/case-study/update?id=${id}`,
          action.token,
          updateData
        );
        if (updatedCaseStudy.status !== 200) {
          return updatedCaseStudy;
        }
        set(caseStudiesAtom, (prev) =>
          prev.map((caseStudy) =>
            caseStudy._id === id ? { ...caseStudy, ...updatedCaseStudy.data } : caseStudy
          )
        );
        await fetch("/api/revalidate?tag=case-study");
        return updatedCaseStudy;
      }
      case "deleteCaseStudy": {
        const { id } = action.payload;
        const response = await caseStudyApiRequest(
          "delete",
          `/case-study/delete?id=${id}`,
          action.token
        );
        if (response.status !== 200) {
          return response;
        }
        set(caseStudiesAtom, (prev) => prev.filter((caseStudy) => caseStudy._id !== id));
        await fetch("/api/revalidate?tag=case-study");
        return response;
      }
      case "createCategory": {
        const categoryData = await caseStudyApiRequest(
          "post",
          "/case-study/category/create",
          action.token,
          action.payload
        );
        if (categoryData.status !== 201) {
          return categoryData;
        }
        set(caseStudyCategoryAtom, (prev) => [...prev, categoryData.data.data]);
        await fetch("/api/revalidate?tag=case-study-categories");
        return categoryData;
      }
      case "fetchAllCategories": {
        const categoryData = await caseStudyApiRequest(
          "get",
          "/case-study/category/read",
          action.token
        );
        if (categoryData.status !== 200) {
          return categoryData;
        }
        set(caseStudyCategoryAtom, categoryData.data.data);
        return categoryData;
      }
      case "fetchSingleCategory": {
        const { id } = action.payload;
        const categoryData = await caseStudyApiRequest(
          "get",
          `/case-study/category/read?id=${id}`,
          action.token
        );
        if (categoryData.status !== 200) {
          return categoryData;
        }
        set(caseStudyCategoryAtom, categoryData.data.data);
        return categoryData;
      }
      case "updateCategory": {
        const { id, ...updateData } = action.payload;
        const updatedCategory = await caseStudyApiRequest(
          "patch",
          `/case-study/category/update?id=${id}`,
          action.token,
          updateData
        );
        if (updatedCategory.status !== 200) {
          return updatedCategory;
        }
        set(caseStudyCategoryAtom, (prev) =>
          prev.map((category) =>
            category._id === id
              ? { ...category, ...updatedCategory.data.data, _id: category._id }
              : category
          )
        );
        await fetch("/api/revalidate?tag=case-study-categories");
        return updatedCategory;
      }
      case "deleteCategory": {
        const { id } = action.payload;
        const response = await caseStudyApiRequest(
          "delete",
          `/case-study/category/delete?id=${id}`,
          action.token
        );
        if (response.status !== 200) {
          return response;
        }
        set(caseStudyCategoryAtom, (prev) =>
          prev.filter((category) => category._id !== id)
        );
        await fetch("/api/revalidate?tag=case-study-categories");
        return response;
      }
    }
  }
);