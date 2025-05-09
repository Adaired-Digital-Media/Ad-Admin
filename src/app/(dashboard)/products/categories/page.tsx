import { routes } from '@/config/routes';
import CategoryTable from '@/app/shared/ecommerce/category/category-list/table';
import CategoryPageHeader from './category-page-header';
import { metaObject } from '@/config/site.config';
import { fetchProductCategories } from '@/data/product-categories';


export const metadata = {
  ...metaObject('Categories'),
};

const pageHeader = {
  title: 'Categories',
  breadcrumb: [
    {
      href: routes.root.dashboard,
      name: 'Dashboard',
    },
    {
      href: routes.products.categories,
      name: 'Categories',
    },
    {
      name: 'List',
    },
  ],
};

export default async function CategoriesPage() {
    const categories = await fetchProductCategories();
    
  return (
    <>
      <CategoryPageHeader
        title={pageHeader.title}
        breadcrumb={pageHeader.breadcrumb}
        categories={categories}
      />
      <CategoryTable categories={categories}/>
    </>
  );
}
