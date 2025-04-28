import dynamic from "next/dynamic";
import PageHeader from "@/app/shared/page-header";
import { routes } from "@/config/routes";
import FileStats from "@/app/shared/file/manager/file-stats";
import { metaObject } from "@/config/site.config";
import UploadButton from "@/app/shared/upload-button";
import PageLayout from "@/app/(dashboard)/media-manager/page-layout";
import { Suspense } from "react";
import { auth } from "@/auth";
const FileUpload = dynamic(() => import("@/app/shared/file-upload"), {
  ssr: false,
});

export const metadata = {
  ...metaObject("Media Manager"),
};

// Centralized API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URI;

// Fetch endpoints configuration
const ENDPOINTS = {
  cloudinaryFiles: "/multer/getUploadedMedia?fileType=all",
  cloudinaryUsage: "/multer/get-usage",
};

const fetchData = async (
  endpoint: string,
  accessToken: string,
  tag: string
) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      next: {
        tags: [tag],
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ${tag}: ${response.statusText}`);
    }

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching ${tag}:`, error);
    return [];
  }
};

const pageHeader = {
  title: "Media Manager",
  breadcrumb: [
    {
      href: routes.root.dashboard,
      name: "Dashboard",
    },
    {
      href: routes.file.manager,
      name: "Media Manager",
    },
    {
      name: "List",
    },
  ],
};

export default async function FileListPage() {
  const session = await auth();
  if (!session) {
    throw new Error("User session is not available.");
  }
  const accessToken = session?.user?.accessToken || "";

  const [files, usage] = await Promise.all([
    fetchData(ENDPOINTS.cloudinaryFiles, accessToken, "cloudinaryFiles"),
    fetchData(ENDPOINTS.cloudinaryUsage, accessToken, "cloudinaryUsage"),
  ]);

  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <UploadButton modalView={<FileUpload />} />
      </PageHeader>

      <FileStats className="mb-6 @5xl:mb-8 @7xl:mb-11" usage={usage} />
      <Suspense fallback={<div>Loading files...</div>}>
        <PageLayout files={files} />
      </Suspense>
    </>
  );
}
