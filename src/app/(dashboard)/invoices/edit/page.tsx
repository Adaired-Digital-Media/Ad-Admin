import { routes } from '@/config/routes';
import PageHeader from '@/app/shared/page-header';
// import CreateInvoice from '@/app/shared/invoice/create-invoice';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('Create Invoice'),
};

const pageHeader = {
  title: 'Create Invoice',
  breadcrumb: [
    {
      href: routes.root.dashboard,
      name: 'Dashboard',
    },
    {
      href: routes.invoice.list,
      name: 'Invoice',
    },
    {
      name: 'Edit',
    },
  ],
};

export default function InvoiceCreatePage() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}/>
      {/* <CreateInvoice /> */}
    </>
  );
}
