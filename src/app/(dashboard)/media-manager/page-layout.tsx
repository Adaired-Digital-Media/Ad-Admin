"use client";

import { useSearchParams } from "next/navigation";
import FileGrid from "@/app/shared/file/manager/file-grid";
import FileListTable from "@/app/shared/file/manager/file-list/table";
import { CloudinaryFile } from "@/data/cloudinary-files";

export default function PageLayout({ files }: { files: CloudinaryFile[] }) {
  const searchParams = useSearchParams();
  const layout = searchParams.get("layout");
  const isGridLayout = layout?.toLowerCase() === "grid";
  return isGridLayout ? (
    <FileGrid files={files} />
  ) : (
    <FileListTable files={files} />
  );
}
