import { metaObject } from "@/config/site.config";
import PageHeader from "@/app/shared/page-header";
import { routes } from "@/config/routes";
import CreateEditBlog from "@/app/shared/blog/create-edit";
import { auth } from "@/auth";

export const metadata = {
  ...metaObject("Create Blog"),
};

const pageHeader = {
  title: "Create Blog",
  breadcrumb: [
    {
      href: routes.root.dashboard,
      name: "Dashboard",
    },
    {
      href: routes?.blog?.list,
      name: "Blog",
    },
    {
      name: "Create",
    },
  ],
};

export default async function CreateBlogPage() {
  const session = await auth();
  if (!session) return;
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <CreateEditBlog accessToken={session?.user?.accessToken} />
    </>
  );
}
