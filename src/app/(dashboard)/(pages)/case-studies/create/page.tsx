import { metaObject } from "@/config/site.config";
import PageHeader from "@/app/shared/page-header";
import { routes } from "@/config/routes";
import CreateEditBlog from "@/app/shared/case-studies/create-edit";
import { auth } from "@/auth";

export const metadata = {
  ...metaObject("Create Case Study"),
};

const pageHeader = {
  title: "Create Case Study",
  breadcrumb: [
    {
      href: routes.root.dashboard,
      name: "Dashboard",
    },
    {
      href: routes?.caseStudies?.list,
      name: "Case Studies",
    },
    {
      name: "Create",
    },
  ],
};

export default async function CreateCaseStudyPage() {
  const session = await auth();
  if (!session) return;
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <CreateEditBlog accessToken={session?.user?.accessToken} />
    </>
  );
}
