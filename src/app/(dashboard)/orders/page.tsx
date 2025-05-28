import { routes } from "@/config/routes";
import PageHeader from "@/app/shared/page-header";
import { metaObject } from "@/config/site.config";
import ExportButton from "@/app/shared/export-button";
import { auth } from "@/auth";
import OrderTable from "@/app/shared/ecommerce/order/order-list/table";


export const metadata = {
  ...metaObject("Orders"),
};

const pageHeader = {
  title: "Orders",
  breadcrumb: [
    {
      href: routes.root.dashboard,
      name: "Dashboard",
    },
    {
      href: routes.orders.orders,
      name: "Orders",
    },
    {
      name: "All Orders",
    },
  ],
};

async function fetchOrders() {
  const session = await auth();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_API_URI}/orders/getOrders`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.user?.accessToken}`,
      },
      next: {
        tags: ["orders"],
      },
    }
  );
  const data = await res.json();
  return data.data;
}

const Orders = async () => {
  const session = await auth();
  const orders = await fetchOrders();
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <div className="mt-4 flex items-center gap-3 @lg:mt-0">
          <ExportButton data={orders} fileName="order_data" header="" />
        </div>
      </PageHeader>

      <OrderTable orderData={orders} session={session!}/>
    </>
  );
};

export default Orders;
