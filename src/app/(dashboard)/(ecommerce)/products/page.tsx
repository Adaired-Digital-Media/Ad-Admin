import Link from 'next/link';
import { PiPlusBold } from 'react-icons/pi';
import { routes } from '@/config/routes';
import { Button } from 'rizzui';
import PageHeader from '@/app/shared/page-header';
import ProductsTable from '@/app/shared/ecommerce/products/product-list/table';
import { fetchProducts } from '@/data/products';
import { metaObject } from '@/config/site.config';
import ExportButton from '@/app/shared/export-button';

export const metadata = {
  ...metaObject('Products'),
};

const pageHeader = {
  title: 'Products',
  breadcrumb: [
    {
      href: routes?.root?.dashboard,
      name: 'Dashboard',
    },
    {
      href: routes?.products?.products,
      name: 'Products',
    },
    {
      name: 'List',
    },
  ],
};

export default async function ProductsPage() {
 const products = await fetchProducts();

  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <div className="mt-4 flex items-center gap-3 @lg:mt-0">
          <ExportButton
            data={products}
            fileName="product_data"
            header="ID,Name,Category,Product Thumbnail,SKU,Stock,Price,Status,Rating"
          />
          <Link
            href={routes?.products?.createProduct}
            className="w-full @lg:w-auto"
          >
            <Button as="span" className="w-full @lg:w-auto">
              <PiPlusBold className="me-1.5 h-[17px] w-[17px]" />
              Add Product
            </Button>
          </Link>
        </div>
      </PageHeader>

      <ProductsTable pageSize={10} products={products}/>
    </>
  );
}
