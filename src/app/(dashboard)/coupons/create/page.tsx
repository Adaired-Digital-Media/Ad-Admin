import { metaObject } from "@/config/site.config";
import PageHeader from "@/app/shared/page-header";
import { routes } from "@/config/routes";
import CreateEditCoupon from "@/app/shared/ecommerce/coupons/create-edit";
import { auth } from "@/auth";

export const metadata = {
  ...metaObject("Create Coupon"),
};

const pageHeader = {
  title: "Create Coupon",
  breadcrumb: [
    {
      href: routes.root.dashboard,
      name: "Dashboard",
    },
    {
      href: routes?.coupons?.allCoupons,
      name: "Coupons",
    },
    {
      name: "Create",
    },
  ],
};

export default async function CreateCouponPage() {
  const session = await auth();
  if (!session) return;
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />

      <CreateEditCoupon accessToken={session?.user?.accessToken} />
    </>
  );
}
