import { atom } from "jotai";
import { CloudinaryFile } from "@/data/cloudinary-files";

export const cloudinaryFilesAtom = atom<CloudinaryFile[]>([]);

export const cloudinaryFilesWithActionsAtom = atom(
  (get) => get(cloudinaryFilesAtom),
  async (
    get,
    set,
    action:
      | { type: "set"; payload: CloudinaryFile[] }
      | { type: "fetch"; fileType?: string }
      | { type: "refetch"; fileType?: string }
  ) => {
    const fetchFiles = async (fileType = "all") => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URI}/multer/getUploadedMedia?fileType=${fileType}`
      );
      if (!response.ok) throw new Error("Failed to fetch files");
      const res = await response.json();
      return res?.data
    };

    switch (action.type) {
      case "set":
        set(cloudinaryFilesAtom, action.payload);
        break;
      case "fetch":
        // Only fetch if we don't already have files
        if (get(cloudinaryFilesAtom).length === 0) {
          const files = await fetchFiles(action.fileType);
          set(cloudinaryFilesAtom, files);
        }
        break;
      case "refetch":
        const files = await fetchFiles(action.fileType);
        set(cloudinaryFilesAtom, files);
        break;
      default:
        break;
    }
  }
);
