import dynamic from "next/dynamic";
import PageHeader from "@/app/shared/page-header";
import { routes } from "@/config/routes";
import FileStats from "@/app/shared/file/manager/file-stats";
import { metaObject } from "@/config/site.config";
import UploadButton from "@/app/shared/upload-button";
import PageLayout from "@/app/(dashboard)/file-manager/page-layout";
import { checkUsage, fetchFiles } from "@/data/cloudinary-files";
import { Suspense } from "react";
const FileUpload = dynamic(() => import("@/app/shared/file-upload"), {
  ssr: false,
});

export const metadata = {
  ...metaObject("File Manager"),
};

const pageHeader = {
  title: "File Manager",
  breadcrumb: [
    {
      href: routes.root.dashboard,
      name: "Dashboard",
    },
    {
      href: routes.file.manager,
      name: "File Manager",
    },
    {
      name: "List",
    },
  ],
};

export default async function FileListPage() {
  const files = await fetchFiles({ fileType: "all" });
  const usage = await checkUsage();
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
