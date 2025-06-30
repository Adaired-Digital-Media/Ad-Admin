import CreateEditProduct from "@/app/shared/ecommerce/products/create-edit";
import { metaObject } from "@/config/site.config";
import PageHeader from "@/app/shared/page-header";
import { routes } from "@/config/routes";

export const metadata = {
  ...metaObject("Create Product"),
};

const pageHeader = {
  title: "Create Product",
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
      name: "Create",
    },
  ],
};

export default function CreateProductPage() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <CreateEditProduct />
    </>
  );
}
