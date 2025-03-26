/* eslint-disable @typescript-eslint/no-explicit-any */
import { FileFormInput } from "@/validators/edit-file.schema";
import axios from "axios";

export const checkUsage = async () => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_API_URI}/multer/get-usage`
  );
  return response.data;
};

export const uploadFiles = async (files: File[]) => {
  const formData = new FormData();
  files.forEach((file: File) => formData.append("files", file));
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_BACKEND_API_URI}/multer/upload`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response;
};

export const fetchFiles = async ({
  fileType = "all",
}: {
  fileType: string;
}) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_API_URI}/multer/getUploadedMedia?fileType=${fileType}`,
    { next: { tags: ["cloudinaryFiles"] } }
  );
  const res = await response.json();
  return res?.data;
};

export const deleteFile = async ({ public_id }: { public_id: string }) => {
  const response = await axios.delete(
    `${process.env.NEXT_PUBLIC_BACKEND_API_URI}/multer/deleteFile?public_id=${public_id}`
  );
  return response.data.message;
};

export const editFiles = async ({
  public_id,
  file,
}: {
  public_id: string;
  file: FileFormInput;
}) => {
  try {
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URI}/multer/editImage?public_id=${public_id}`,
      {
        caption: file.caption,
        alt: file.alt,
      }
    );
    return response;
  } catch (error) {
    console.error("Error editing file:", error);
    throw new Error(error instanceof Error ? error.message : String(error));
  }
};

export interface CloudinaryFile {
  asset_id: string;
  public_id: string;
  folder: string;
  filename: string;
  format: string;
  version: number;
  resource_type: string;
  type: string;
  created_at: string;
  uploaded_at: string;
  bytes: number;
  backup_bytes: number;
  width: number;
  height: number;
  aspect_ratio: number;
  pixels: number;
  context?: {
    alt?: string;
    caption?: string;
  };
  url: string;
  secure_url: string;
  status: string;
  access_mode: string;
  access_control: any | null;
  etag: string;
  created_by: {
    access_key: string;
  };
  uploaded_by: {
    access_key: string;
  };
  last_updated: {
    context_updated_at: string;
    updated_at: string;
  };
}
