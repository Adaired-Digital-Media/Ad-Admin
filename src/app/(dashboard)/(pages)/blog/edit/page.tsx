import { metaObject } from "@/config/site.config";
import PageHeader from "@/app/shared/page-header";
import { routes } from "@/config/routes";
import CreateEditBlog from "@/app/shared/blog/create-edit";
import { auth } from "@/auth";

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
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <CreateEditBlog
        id={searchParams.id}
        accessToken={session?.user?.accessToken}
      />
    </>
  );
}
