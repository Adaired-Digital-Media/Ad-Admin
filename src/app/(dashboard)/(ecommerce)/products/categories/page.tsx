import ModalButton from "@/app/shared/modal-button";
import { routes } from "@/config/routes";
import PageHeader from "@/app/shared/page-header";
import { metaObject } from "@/config/site.config";
import ProductCategoryTable from "@/app/shared/ecommerce/products/category/category-list/table";
import { auth } from "@/auth";
import CreateEditCategory from "@/app/shared/ecommerce/products/category/create-edit";

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
  ...metaObject("Product Categories"),
};

const pageHeader = {
  title: "Product Categories",
  breadcrumb: [
    {
      href: routes.root.dashboard,
      name: "Dashboard",
    },
    {
      href: routes.products .products,
      name: "Products",
    },
    {
      href: routes.products.categories,
      name: "Categories",
      isCurrent: true,
    },
  ],
};

export default async function CategoriesPage() {
  const session = await auth();
  if (!session) return;
  const accessToken = session?.user?.accessToken || "";
  const categories = await fetchData(
    "/product/category/read-category",
    accessToken,
    "product-categories"
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
      <ProductCategoryTable initialCategories={categories} session={session} />
    </div>
  );
}
