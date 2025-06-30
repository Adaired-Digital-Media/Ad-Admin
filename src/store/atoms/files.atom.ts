/* eslint-disable @typescript-eslint/no-explicit-any */
import { atom } from "jotai";
import axios from "axios";
import { CloudinaryFile } from "@/core/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URI;

// Base atom
export const cloudinaryFilesAtom = atom<CloudinaryFile[]>([]);

// Atom for file stats
export const cloudinaryFilesStatsAtom = atom<any>(null);

// Helper function for API calls
const apiRequest = async (
  method: "get" | "post" | "put" | "delete",
  endpoint: string,
  token: string,
  data?: unknown,
  contentType?: "application/json" | "multipart/form-data"
) => {
  try {
    const response = await axios({
      method,
      url: `${API_BASE_URL}${endpoint}`,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": contentType || "application/json",
      },
      data,
    });

    return response.data;
  } catch (error: any) {
    return error.response;
  }
};

// Fetch files from the server with better typing
const fetchFiles = async (fileType = "all"): Promise<CloudinaryFile[]> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/multer/getUploadedMedia?fileType=${fileType}`,
      { next: { tags: ["cloudinaryFiles"] } }
    );

    if (!response.ok) {
      console.log(response);
      throw new Error(`Failed to fetch files: ${response.statusText}`);
    }

    const res = await response.json();
    return res?.data || [];
  } catch (error) {
    throw error;
  }
};

export const cloudinaryActionsAtom = atom(
  null,
  async (
    get,
    set,
    action: {
      type: "fetchUsage" | "upload" | "fetch" | "edit" | "delete";
      payload?: any;
      token: string;
    }
  ) => {
    switch (action.type) {
      case "fetchUsage": {
        const usage = await apiRequest(
          "get",
          "/multer/get-usage",
          action.token
        );
        set(cloudinaryFilesStatsAtom, usage.data);
        return usage.data;
      }

      case "upload": {
        const formData = new FormData();
        action.payload?.files.forEach((file: File) =>
          formData.append("files", file)
        );
        const response = await apiRequest(
          "post",
          "/multer/upload",
          action.token,
          formData,
          "multipart/form-data"
        );
        const updatedFiles = await fetchFiles(action.payload?.fileType);
        set(cloudinaryFilesAtom, updatedFiles);
        await fetch("/api/revalidateTags?tag=cloudinaryFiles", {
          method: "GET",
        });
        await fetch("/api/revalidateTags?tag=cloudinaryUsage", {
          method: "GET",
        });
        return response;
      }

      case "fetch": {
        const files = await fetchFiles(action.payload?.fileType);
        set(cloudinaryFilesAtom, files);
        return files;
      }

      case "edit": {
        const { public_id, file } = action.payload;
        const response = await apiRequest(
          "put",
          `/multer/editImage?public_id=${public_id}`,
          action.token,
          {
            caption: file.caption,
            alt: file.alt,
          }
        );
        const updatedFiles = await fetchFiles(action.payload?.fileType);
        set(cloudinaryFilesAtom, updatedFiles);
        await fetch("/api/revalidateTags?tag=cloudinaryFiles", {
          method: "GET",
        });
        return response.data;
      }

      case "delete": {
        const { public_id } = action.payload;
        const response = await apiRequest(
          "delete",
          `/multer/deleteFile?public_id=${public_id}`,
          action.token
        );
        await fetch("/api/revalidateTags?tag=cloudinaryFiles", {
          method: "GET",
        });
        await fetch("/api/revalidateTags?tag=cloudinaryUsage", {
          method: "GET",
        });
        set(cloudinaryFilesAtom, (prev) =>
          prev.filter((f) => f.public_id !== public_id)
        );
        return response.message;
      }
    }
  }
);
