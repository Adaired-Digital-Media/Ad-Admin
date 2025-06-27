// import { routes } from "@/config/routes";
// import PageHeader from "@/app/shared/page-header";
// import CreateInvoice from '@/app/shared/invoice/create-invoice';
// import { metaObject } from "@/config/site.config";
// import { Metadata } from "next";

// type Props = {
//   searchParams: { invoiceNumber?: string };
// };

// export async function generateMetadata({
//   searchParams,
// }: Props): Promise<Metadata> {
//   const id = searchParams.invoiceNumber || "";

//   return metaObject(`Edit ${id}`);
// }

// const pageHeader = {
//   title: "Edit Invoice",
//   breadcrumb: [
//     {
//       href: routes.root.dashboard,
//       name: "Dashboard",
//     },
//     {
//       href: routes.invoice.list,
//       name: "Invoice",
//     },
//     {
//       name: "Edit",
//     },
//   ],
// };

// export default function InvoiceCreatePage({ searchParams }: Props) {
//   return (
//     <>
//       <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
//       <CreateInvoice id={searchParams.invoiceNumber || ""}/>
//     </>
//   );
// }
