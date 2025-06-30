import ModalButton from "@/app/shared/modal-button";
import { routes } from "@/config/routes";
import PageHeader from "@/app/shared/page-header";
import { metaObject } from "@/config/site.config";
import BlogCategoryTable from "@/app/shared/blog/category/list/table";
import { auth } from "@/auth";
import CreateEditCategory from "@/app/shared/blog/category/create-edit";

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
  ...metaObject("Blog Categories"),
};

const pageHeader = {
  title: "Blog Categories",
  breadcrumb: [
    {
      href: routes?.root?.dashboard,
      name: "Dashboard",
    },
    {
      href: routes?.blog?.list,
      name: "Blog",
    },
    {
      href: routes?.blog?.categoryList,
      name: "Categories",
    },
  ],
};

const BlogCategoryPage = async () => {
  const session = await auth();
  const accessToken = session?.user?.accessToken || "";
  const blogCategoryList = await fetchData(
    "/blog-category/read",
    accessToken,
    "blog-categories"
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
      <BlogCategoryTable
        initialCategories={blogCategoryList}
        session={session!}
      />
    </div>
  );
};

export default BlogCategoryPage;
