import { routes } from "@/config/routes";
import PageHeader from "@/app/shared/page-header";
import OrderView from "@/app/shared/ecommerce/order/order-view";
import { auth } from "@/auth";

async function fetchOrder(orderNumber: string) {
  const session = await auth();
  const apiUri = process.env.NEXT_PUBLIC_BACKEND_API_URI;

  if (!apiUri) {
    throw new Error("Backend API URI is not defined in the environment variables.");
  }

  const response = await fetch(
    `${apiUri}/orders/getOrders?orderNumber=${orderNumber}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.user?.accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch order: ${response.statusText}`);
  }

  const data = await response.json();
  return data.data;
}

// Props type for App Router Server Component
interface OrderDetailsPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function OrderDetailsPage({
  searchParams,
}: OrderDetailsPageProps) {
  const orderNumber = Array.isArray(searchParams.orderNumber)
    ? searchParams.orderNumber[0] 
    : searchParams.orderNumber || ""; 

  const session = await auth();
  if (!session) {
    throw new Error("User session is not available.");
  }
  const pageHeader = {
    title: `Order #${orderNumber}`,
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
        name: orderNumber
      },
    ],
  };

  const order = await fetchOrder(orderNumber);

  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}/>
      <OrderView order={order} session={session} />
    </>
  );
}
