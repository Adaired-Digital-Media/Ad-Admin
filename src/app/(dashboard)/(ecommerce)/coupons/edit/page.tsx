import PageHeader from "@/app/shared/page-header";
import { metaObject } from "@/config/site.config";
import { routes } from "@/config/routes";
import CreateEditCoupon from "@/app/shared/ecommerce/coupons/create-edit";
import { auth } from "@/auth";
import { fetchData } from "@/core/utils/fetch-function";
import { CouponTypes } from "@/core/types";

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
      href: routes.coupons.allCoupons,
      name: "Coupons",
    },
    {
      name: `Edit`,
    },
  ],
};
export default async function EditCouponPage({ searchParams }: Props) {
  const session = await auth();
  if (!session) return;
  const accessToken = session?.user?.accessToken || "";
  const data = await fetchData({
    endpoint: `/coupons/read?id=${searchParams.couponId}`,
    accessToken,
    tag: "coupons",
  });
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />

      <CreateEditCoupon
        coupon={data as CouponTypes}
        accessToken={session?.user?.accessToken}
      />
    </>
  );
}
