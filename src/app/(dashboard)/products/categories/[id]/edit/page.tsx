/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "rizzui";
import { routes } from "@/config/routes";
import PageHeader from "@/app/shared/page-header";
import CreateCategory from "@/app/shared/ecommerce/category/create-category";
import Link from "next/link";
import { metaObject } from "@/config/site.config";
import { Metadata } from "next";
import {
  fetchProductCategories,
  ProductCategoryType,
} from "@/data/product-categories";

type Props = {
  params: { id: string };
};

/**
 * for dynamic metadata
 * @link: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function
 */

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // read route params
  const id = params.id;

  return metaObject(`Edit ${id}`);
}

const pageHeader = {
  title: "Edit Category",
  breadcrumb: [
    {
      href: routes.root.dashboard,
      name: "Home",
    },
    {
      href: routes.products.categories,
      name: "Categories",
    },
    {
      name: "Edit",
    },
  ],
};

export default async function EditCategoryPage({ params }: any) {
  const categories = await fetchProductCategories();
  const category = categories.find(
    (c: ProductCategoryType) => c._id === params.id
  );
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <Link
          href={routes.products.categories}
          className="mt-4 w-full @lg:mt-0 @lg:w-auto"
        >
          <Button as="span" className="w-full @lg:w-auto" variant="outline">
            Cancel
          </Button>
        </Link>
      </PageHeader>
      <CreateCategory
        id={params.id}
        category={category}
        categories={categories}
      />
    </>
  );
}
