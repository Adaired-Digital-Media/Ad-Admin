import { routes } from "@/config/routes";
import PageHeader from "@/app/shared/page-header";
import { metaObject } from "@/config/site.config";
import ExportButton from "@/app/shared/export-button";
import { auth } from "@/auth";
import OrderTable from "@/app/shared/ecommerce/order/order-list/table";
import { fetchData } from "@/core/utils/fetch-function";
import { OrderType } from "@/core/types";

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

const Orders = async () => {
  const session = await auth();
  // const orders = await fetchOrders();
  const orders = (await fetchData({
    endpoint: "/orders/getOrders",
    accessToken: session?.user?.accessToken,
    tag: "orders",
  })) as OrderType[];

  const exportHeader =
    "ID,Order Number,Customer Name,Products,Total Quantity,Total Price,Coupon Discount,Final Price,Coupon ID,Payment ID,Invoice ID,Payment URL,Status,Payment Status,Payment Method,Created At,Updated At";
  const exportData = orders.map((order: OrderType) => ({
    id: order._id,
    orderNumber: order.orderNumber,
    customerName: order?.userId?.name,
    products: order.products.map((product) => product.name).join(", "),
    totalQuantity: order.totalQuantity,
    totalPrice: order.totalPrice,
    couponDiscount: order.couponDiscount,
    finalPrice: order.finalPrice,
    couponId: order.couponId,
    paymentId: order.paymentId,
    invoiceId: order.invoiceId,
    paymentUrl: order.paymentUrl,
    status: order.status,
    paymentStatus: order.paymentStatus,
    paymentMethod: order.paymentMethod,
    createdAt: new Date(order?.createdAt || Date.now()).toLocaleDateString(),
    updatedAt: new Date(order?.updatedAt || Date.now()).toLocaleDateString(),
  }));
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <div className="mt-4 flex items-center gap-3 @lg:mt-0">
          <ExportButton
            data={exportData}
            fileName="order_data"
            header={exportHeader}
          />
        </div>
      </PageHeader>

      <OrderTable orderData={orders} session={session!} />
    </>
  );
};

export default Orders;
