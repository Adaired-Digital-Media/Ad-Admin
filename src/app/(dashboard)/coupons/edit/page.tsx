import PageHeader from "@/app/shared/page-header";
import { metaObject } from "@/config/site.config";
import { routes } from "@/config/routes";
import CreateEditCoupon from "@/app/shared/ecommerce/coupons/create-edit";
import { auth } from "@/auth";

type Props = {
  searchParams: { couponId?: string };
};

export const metadata = {
  ...metaObject("Edit Coupon"),
};

const pageHeader = {
  title: "Edit Coupon",
  breadcrumb: [
    {
      href: routes.root.dashboard,
      name: "Dashboard",
    },
    {
      href: routes.products.products,
      name: "Coupons",
    },
    {
      name: `Edit`,
    },
  ],
};
export default async function EditProductPage({ searchParams }: Props) {
  const session = await auth();
  if (!session) return;
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />

      <CreateEditCoupon couponId={searchParams.couponId || ""}  accessToken={session?.user?.accessToken}/>
    </>
  );
}
