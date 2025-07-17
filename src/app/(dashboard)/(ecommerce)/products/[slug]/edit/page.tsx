import CreateEditProduct from "@/app/shared/ecommerce/products/create-edit";
import PageHeader from "@/app/shared/page-header";
import { metaObject } from "@/config/site.config";
import { routes } from "@/config/routes";
import { auth } from "@/auth";
import { fetchData } from "@/core/utils/fetch-function";
import { ProductFormValues } from "@/validators/create-product.schema";

export const metadata = {
  ...metaObject("Edit Product"),
};

const pageHeader = {
  title: "Edit Product",
  breadcrumb: [
    {
      href: routes.root.dashboard,
      name: "Dashboard",
    },
    {
      href: routes.products.products,
      name: "Products",
    },
    {
      name: "Edit",
      isCurrent: true,
    },
  ],
};

export default async function EditProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const session = await auth();
  if (!session) return;
  const accessToken = session?.user?.accessToken || "";
  const data = await fetchData({
    endpoint: `/product/read-product?query=${params.slug}`,
    accessToken,
    tag: "products",
  });

  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <CreateEditProduct
        product={data as ProductFormValues}
        accessToken={session.user.accessToken!}
      />
    </>
  );
}
