import CreateCategory from '@/app/shared/ecommerce/category/create-category';
import PageHeader from '@/app/shared/page-header';
import { Button } from 'rizzui';
import { routes } from '@/config/routes';
import Link from 'next/link';
import { metaObject } from '@/config/site.config';
import { fetchProductCategories } from '@/data/product-categories';

export const metadata = {
  ...metaObject('Create a Category'),
};

const pageHeader = {
  title: 'Create A Category',
  breadcrumb: [
    {
      href: routes.root.dashboard,
      name: 'Dashboard',
    },
    {
      href: routes.products.products,
      name: 'Products',
    },
    {
      href: routes.products.categories,
      name: 'Categories',
    },
    {
      name: 'Create',
    },
  ],
};

export default async function CreateCategoryPage() {
    const categories = await fetchProductCategories();
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
      <CreateCategory categories={categories}/>
    </>
  );
}
