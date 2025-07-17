/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { PiPlusBold } from "react-icons/pi";
import { routes } from "@/config/routes";
import { Button } from "rizzui";
import PageHeader from "@/app/shared/page-header";
import { metaObject } from "@/config/site.config";
import CouponsTable from "@/app/shared/ecommerce/coupons/coupon-list/table";
import { auth } from "@/auth";
import { fetchData } from "@/core/utils/fetch-function";
import { CouponTypes } from "@/core/types";

export const metadata = {
  ...metaObject("Coupons"),
};

const pageHeader = {
  title: "Coupons",
  breadcrumb: [
    {
      href: routes?.root?.dashboard,
      name: "Dashboard",
    },
    {
      href: routes?.coupons?.allCoupons,
      name: "Coupons",
    },
    {
      name: "All Coupons",
    },
  ],
};

export default async function CouponsPage() {
  const session = await auth();
  const accessToken = session?.user?.accessToken || "";

  const [coupons, couponStats] = await Promise.all([
    fetchData({
      endpoint: "/coupons/read",
      accessToken,
      tag: "coupons",
    }) as Promise<CouponTypes[]>,
    fetchData({
      endpoint: "/coupons/usageStats",
      accessToken,
      tag: "couponStats",
    }) as Promise<any[]>,
  ]);

  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <div className="mt-4 flex items-center gap-3 @lg:mt-0">
          <Link
            href={routes?.coupons?.createCoupon}
            className="w-full @lg:w-auto"
          >
            <Button as="span" className="w-full @lg:w-auto">
              <PiPlusBold className="me-1.5 h-[17px] w-[17px]" />
              Add Coupon
            </Button>
          </Link>
        </div>
      </PageHeader>

      <CouponsTable
        pageSize={10}
        initialCoupons={coupons}
        couponStats={couponStats}
        session={session!}
      />
    </>
  );
}
