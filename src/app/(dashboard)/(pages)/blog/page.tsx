import Link from "next/link";
import { PiPlusBold } from "react-icons/pi";
import { routes } from "@/config/routes";
import { Button } from "rizzui";
import PageHeader from "@/app/shared/page-header";
import { metaObject } from "@/config/site.config";
import BlogTable from "@/app/shared/blog/blog-list/table";
import { auth } from "@/auth";
import { fetchData } from "@/core/utils/fetch-function";
import { BlogTypes } from "@/core/types";

export const metadata = {
  ...metaObject("Blog"),
};

const pageHeader = {
  title: "Blog",
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
      name: "List",
    },
  ],
};

const BlogPage = async () => {
  const session = await auth();
  const accessToken = session?.user?.accessToken || "";
  const blogList = await fetchData({
    endpoint: "/blog/read",
    accessToken,
    tag: "blog",
  });
  return (
    <div className="p-4">
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <div className="mt-4 flex items-center gap-3 @lg:mt-0">
          <Link href={routes?.blog?.create} className="w-full @lg:w-auto">
            <Button as="span" className="w-full @lg:w-auto">
              <PiPlusBold className="me-1.5 h-[17px] w-[17px]" />
              Add Blog
            </Button>
          </Link>
        </div>
      </PageHeader>
      <BlogTable initialBlogs={blogList as BlogTypes[]} session={session!} />
    </div>
  );
};

export default BlogPage;
