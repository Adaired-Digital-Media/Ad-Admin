import { routes } from "@/config/routes";
import PageHeader from "@/app/shared/page-header";
import InvoiceTable from "@/app/shared/ecommerce/invoice/invoice-list/table";
import ExportButton from "@/app/shared/export-button";
import { metaObject } from "@/config/site.config";
import { auth } from "@/auth";
import { fetchData } from "@/core/utils/fetch-function";
import { InvoiceTypes } from "@/core/types";

// Fetch endpoints configuration
const ENDPOINTS = {
  invoices: "/invoices/getInvoices",
};

export const metadata = {
  ...metaObject("Invoices"),
};

const pageHeader = {
  title: "Invoice List",
  breadcrumb: [
    {
      href: routes.root.dashboard,
      name: "Dashboard",
    },
    {
      href: routes.invoice.list,
      name: "Invoices",
    },
    {
      name: "List",
    },
  ],
};

export default async function InvoiceListPage() {
  const session = await auth();
  if (!session) throw new Error("User session is not available.");
  const accessToken = session?.user?.accessToken || "";
  const invoices = await fetchData({
    endpoint: ENDPOINTS.invoices,
    accessToken,
    tag: "invoices",
  });

  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <div className="mt-4 flex items-center gap-3 @lg:mt-0">
          <ExportButton
            data={invoices as InvoiceTypes[]}
            fileName="invoice_data"
            header="ID,Name,Username,Avatar,Email,Due Date,Amount,Status,Created At"
          />
        </div>
      </PageHeader>

      <InvoiceTable
        initialInvoices={invoices as InvoiceTypes[]}
        session={session}
      />
    </>
  );
}
