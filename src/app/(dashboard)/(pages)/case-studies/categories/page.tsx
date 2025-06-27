import { routes } from "@/config/routes";
import PageHeader from "@/app/shared/page-header";
import { metaObject } from "@/config/site.config";
import { auth } from "@/auth";
import CaseStudyCategoryTable from "@/app/shared/case-studies/category/list/table";
import ModalButton from "@/app/shared/modal-button";
import CreateEditCategory from "@/app/shared/case-studies/category/create-edit";

const fetchData = async (
  endpoint: string,
  accessToken: string,
  tag: string
) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URI}${endpoint}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        next: {
          tags: [tag],
        },
      }
    );

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

export const metadata = {
  ...metaObject("Case Study Categories"),
};

const pageHeader = {
  title: "Case Study Categories",
  breadcrumb: [
    {
      href: routes?.root?.dashboard,
      name: "Dashboard",
    },
    {
      href: routes?.caseStudies?.list,
      name: "Case Study",
    },
    {
      href: routes?.caseStudies?.categoryList,
      name: "Categories",
    },
  ],
};

const CaseStudyCategoryPage = async () => {
  const session = await auth();
  const accessToken = session?.user?.accessToken || "";
  const caseStudyCategoryList = await fetchData(
    "/case-study/category/read",
    accessToken,
    "case-study-categories"
  );

  return (
    <div className="p-4">
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <div className="mt-4 flex items-center gap-3 @lg:mt-0">
          <ModalButton
            label="Add Category"
            view={
              <CreateEditCategory accessToken={session?.user?.accessToken} />
            }
          />
        </div>
      </PageHeader>
      <CaseStudyCategoryTable
        initialCategories={caseStudyCategoryList}
        session={session!}
      />
    </div>
  );
};

export default CaseStudyCategoryPage;
