"use client";
import { useAtom } from "jotai";
import { routes } from "@/config/routes";
import WelcomeBanner from "@/core/components/banners/welcome";
import HandWaveIcon from "@core/components/icons/hand-wave";
import welcomeImg from "@public/shop-illustration.png";
import { Session } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { PiPlusBold } from "react-icons/pi";
import { Button } from "rizzui";
import StatCards from "./stat-cards";
import SalesReport from "./sales-report";
import { ordersWithActionsAtom } from "@/store/atoms/orders.atom";
import { useEffect } from "react";
import RecentOrder from "./recent-order";

const Index = ({ session }: { session: Session }) => {
  const [orders, setOrders] = useAtom(ordersWithActionsAtom);
  // Fetch orders when component mounts
  useEffect(() => {
    if (session?.user?.accessToken) {
      setOrders({
        type: "fetch",
        accessToken: session.user.accessToken,
      });
    }
  }, [session?.user?.accessToken, setOrders]);

  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      return "Good Morning";
    } else if (currentHour < 18) {
      return "Good Afternoon";
    } else {
      return "Good Evening";
    }
  };
  return (
    <div className="@container">
      <div className="grid grid-cols-1 gap-6 @4xl:grid-cols-2 @7xl:grid-cols-12 3xl:gap-8">
        <WelcomeBanner
          title={
            <>
              {getGreeting()}, <br /> {session.user.name}{" "}
              <HandWaveIcon className="inline-flex h-8 w-8" />
            </>
          }
          description={
            "Here’s What happening on your store today. See the statistics at once."
          }
          media={
            <div className="absolute -bottom-6 end-4 hidden w-[300px] @2xl:block lg:w-[320px] 2xl:-bottom-7 2xl:w-[330px]">
              <div className="relative">
                <Image
                  src={welcomeImg}
                  alt="Welcome shop image form freepik"
                  className="dark:brightness-95 dark:drop-shadow-md"
                />
              </div>
            </div>
          }
          contentClassName="@2xl:max-w-[calc(100%-340px)]"
          className="border border-muted bg-gray-0 pb-8 @4xl:col-span-2 @7xl:col-span-8 dark:bg-gray-100/30 lg:pb-9"
        >
          <Link href={routes?.products?.createProduct} className="inline-flex">
            <Button as="span" className="h-[38px] shadow md:h-10">
              <PiPlusBold className="me-1 h-4 w-4" /> Add Product
            </Button>
          </Link>
        </WelcomeBanner>

        <StatCards className="@2xl:grid-cols-3 @3xl:gap-6 @4xl:col-span-2 @7xl:col-span-8" orderData={orders}/>

        <SalesReport className="@4xl:col-span-2 @7xl:col-span-8" />

        <RecentOrder className="relative @4xl:col-span-2 @7xl:col-span-12" orderData={orders}/>
      </div>
    </div>
  );
};

export default Index;
