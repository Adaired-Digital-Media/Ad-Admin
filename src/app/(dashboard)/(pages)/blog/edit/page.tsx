import { metaObject } from "@/config/site.config";
import PageHeader from "@/app/shared/page-header";
import { routes } from "@/config/routes";
import CreateEditBlog from "@/app/shared/blog/create-edit";
import { auth } from "@/auth";
import { fetchData } from "@/core/utils/fetch-function";
import { BlogTypes } from "@/core/types";

type Props = {
  searchParams: { id?: string };
};

export const metadata = {
  ...metaObject("Edit Blog"),
};

const pageHeader = {
  title: "Edit Blog",
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
      name: "Edit",
    },
  ],
};

export default async function EditCouponPage({ searchParams }: Props) {
  const session = await auth();
  if (!session) return;
  const accessToken = session?.user?.accessToken || "";
  const blog = await fetchData<BlogTypes[]>({
    endpoint: `/blog/read?id=${searchParams.id}`,
    accessToken,
    tag: "blog",
  });
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <CreateEditBlog
        blog={blog[0]}
        accessToken={session?.user?.accessToken}
      />
    </>
  );
}
