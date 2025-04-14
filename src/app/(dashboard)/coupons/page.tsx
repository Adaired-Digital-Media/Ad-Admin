import Link from "next/link";
import { PiPlusBold } from "react-icons/pi";
import { routes } from "@/config/routes";
import { Button } from "rizzui";
import PageHeader from "@/app/shared/page-header";
import { metaObject } from "@/config/site.config";
import CouponsTable from "@/app/shared/ecommerce/coupons/coupon-list/table";
import { auth } from "@/auth";

// Centralized API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URI;

// Fetch endpoints configuration
const ENDPOINTS = {
  coupons: "/coupons/read",
  couponStats: "/coupons/usageStats",
};

const fetchData = async (
  endpoint: string,
  accessToken: string,
  tag: string
) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      next: {
        tags: [tag],
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ${tag}: ${response.statusText}`);
    }

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching ${tag}:`, error);
    return [];
  }
};

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
  if (!session) {
    throw new Error("User session is not available.");
  }
  const accessToken = session?.user?.accessToken || "";
  // Parallel data fetching
  const [coupons, couponStats] = await Promise.all([
    fetchData(ENDPOINTS.coupons, accessToken, "coupons"),
    fetchData(ENDPOINTS.couponStats, accessToken, "couponStats"),
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

      <CouponsTable pageSize={10} coupons={coupons} couponStats={couponStats} />
    </>
  );
}
