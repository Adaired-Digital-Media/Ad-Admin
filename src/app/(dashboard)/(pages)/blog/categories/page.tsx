import ModalButton from "@/app/shared/modal-button";
import { routes } from "@/config/routes";
import PageHeader from "@/app/shared/page-header";
import { metaObject } from "@/config/site.config";
import BlogCategoryTable from "@/app/shared/blog/category/list/table";
import { auth } from "@/auth";
import CreateEditCategory from "@/app/shared/blog/category/create-edit";
import { fetchData } from "@/core/utils/fetch-function";
import { BlogCategoryType } from "@/core/types";

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
  const blogCategoryList = await fetchData({
    endpoint: "/blog-category/read",
    accessToken,
    tag: "blog-categories",
  });

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
        initialCategories={blogCategoryList as BlogCategoryType[]}
        session={session!}
      />
    </div>
  );
};

export default BlogCategoryPage;
