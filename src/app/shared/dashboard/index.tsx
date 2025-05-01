// "use client";
// import { useAtom, useSetAtom } from "jotai";
// import { routes } from "@/config/routes";
// import WelcomeBanner from "@/core/components/banners/welcome";
// import HandWaveIcon from "@core/components/icons/hand-wave";
// import welcomeImg from "@public/shop-illustration.png";
// import { Session } from "next-auth";
// import Image from "next/image";
// import Link from "next/link";
// import { PiPlusBold } from "react-icons/pi";
// import { Button } from "rizzui";
// import StatCards from "./stat-cards";
// import SalesReport from "./sales-report";
// import { useEffect } from "react";
// import RecentOrder from "./recent-order";
// import TicketsWidget from "./tickets-report";
// import OrdersWidget from "./orders-report";

// // Atoms
// import { cloudinaryActionsAtom } from "@/store/atoms/files.atom";
// import { productActionsAtom } from "@/store/atoms/products.atom";
// import { userActionsAtom } from "@/store/atoms/users.atom";
// import {
//   orderActionsAtom,
//   ordersAtom,
//   orderStatsAtom,
// } from "@/store/atoms/orders.atom";

// const Index = ({ session }: { session: Session }) => {
//   const [orders] = useAtom(ordersAtom);
//   const [orderStats] = useAtom(orderStatsAtom);

//   const setOrders = useSetAtom(orderActionsAtom);
//   const setUsers = useSetAtom(userActionsAtom);
//   const setProducts = useSetAtom(productActionsAtom);
//   const setFiles = useSetAtom(cloudinaryActionsAtom);

//   // Fetch all data when component mounts
//   useEffect(() => {
//     if (!session?.user?.accessToken) return;

//     const fetchData = async () => {
//       try {
//         await Promise.all([
//           setOrders({
//             type: "fetchAll",
//             token: session?.user?.accessToken ?? "",
//           }),
//           setUsers({
//             type: "fetchAll",
//             token: session?.user?.accessToken ?? "",
//           }),
//           setProducts({
//             type: "fetchProducts",
//             token: session?.user?.accessToken ?? "",
//           }),
//           setOrders({
//             type: "fetchStats",
//             token: session?.user?.accessToken ?? "",
//           }),
//           setOrders({
//             type: "fetchSalesReport",
//             token: session?.user?.accessToken ?? "",
//             payload: { year: new Date().getFullYear() },
//           }),
//           setFiles({
//             type: "fetch",
//             token: session?.user?.accessToken ?? "",
//           }),
//         ]);
//       } catch (error) {
//         console.error("Failed to fetch dashboard data:", error);
//       }
//     };

//     fetchData();
//   }, [session?.user?.accessToken, setOrders, setUsers, setProducts, setFiles]);

//   const getGreeting = () => {
//     const currentHour = new Date().getHours();
//     if (currentHour < 12) return "Good Morning";
//     if (currentHour < 18) return "Good Afternoon";
//     return "Good Evening";
//   };

//   return (
//     <div className="@container">
//       <div className="grid grid-cols-1 gap-6 @4xl:grid-cols-2 @7xl:grid-cols-12 3xl:gap-8">
//         <WelcomeBanner
//           title={
//             <>
//               {getGreeting()}, <br /> {session.user.name}{" "}
//               <HandWaveIcon className="inline-flex h-8 w-8" />
//             </>
//           }
//           description={
//             "Here's what's happening on your store today. See the statistics at once."
//           }
//           media={
//             <div className="absolute -bottom-6 end-4 hidden w-[300px] @2xl:block lg:w-[320px] 2xl:-bottom-7 2xl:w-[330px]">
//               <div className="relative">
//                 <Image
//                   src={welcomeImg}
//                   alt="Welcome shop image form freepik"
//                   className="dark:brightness-95 dark:drop-shadow-md"
//                 />
//               </div>
//             </div>
//           }
//           contentClassName="@2xl:max-w-[calc(100%-340px)]"
//           className="border border-muted bg-gray-0 pb-8 @4xl:col-span-2 @7xl:col-span-8 dark:bg-gray-100/30 lg:pb-9"
//         >
//           <Link href={routes.products.createProduct} className="inline-flex">
//             <Button as="span" className="h-[38px] shadow md:h-10">
//               <PiPlusBold className="me-1 h-4 w-4" /> Add Product
//             </Button>
//           </Link>
//         </WelcomeBanner>

//         <StatCards
//           className="@2xl:grid-cols-3 @3xl:gap-6 @4xl:col-span-2 @7xl:col-span-8"
//           orderStats={orderStats}
//         />

//         <TicketsWidget className="h-[464px] @sm:h-[520px] @7xl:col-span-4 @7xl:col-start-9 @7xl:row-start-1 @7xl:row-end-3 @7xl:h-full" />

//         <SalesReport
//           className="@4xl:col-span-2 @7xl:col-span-8"
//           token={session.user.accessToken!}
//         />

//         <OrdersWidget
//           orderStats={orderStats}
//           className="@4xl:col-start-2 @4xl:row-start-3 @7xl:col-span-4 @7xl:col-start-auto @7xl:row-start-auto"
//         />

//         <RecentOrder
//           className="relative @4xl:col-span-2 @7xl:col-span-12"
//           orderData={orders}
//         />
//       </div>
//     </div>
//   );
// };

// export default Index;

// "use client";

// import { useAtom, useSetAtom } from "jotai";
// import { routes } from "@/config/routes";
// import WelcomeBanner from "@/core/components/banners/welcome";
// import HandWaveIcon from "@core/components/icons/hand-wave";
// import welcomeImg from "@public/shop-illustration.png";
// import { Session } from "next-auth";
// import Image from "next/image";
// import Link from "next/link";
// import { PiPlusBold } from "react-icons/pi";
// import { Button, Loader } from "rizzui";
// import StatCards from "./stat-cards";
// import SalesReport from "./sales-report";
// import { useEffect, useState } from "react";
// import RecentOrder from "./recent-order";
// import TicketsWidget from "./tickets-report";
// import OrdersWidget from "./orders-report";

// // Atoms
// import { cloudinaryActionsAtom } from "@/store/atoms/files.atom";
// import { productActionsAtom } from "@/store/atoms/products.atom";
// import { userActionsAtom } from "@/store/atoms/users.atom";
// import {
//   orderActionsAtom,
//   ordersAtom,
//   orderStatsAtom,
// } from "@/store/atoms/orders.atom";
// import { checkPermission, PermissionActions } from "@/core/utils/permissions";

// const Index = ({ session }: { session: Session }) => {
//   const [hasPermissions, setHasPermissions] = useState<{
//     [key: string]: boolean;
//   }>({});

//   console.log("hasPermissions", hasPermissions);
//   const [loading, setLoading] = useState(true);
//   const [orders] = useAtom(ordersAtom);
//   const [orderStats] = useAtom(orderStatsAtom);

//   const setOrders = useSetAtom(orderActionsAtom);
//   const setUsers = useSetAtom(userActionsAtom);
//   const setProducts = useSetAtom(productActionsAtom);
//   const setFiles = useSetAtom(cloudinaryActionsAtom);

//   // Check permissions on mount
//   useEffect(() => {
//     const checkPermissions = async () => {
//       if (!session?.user?.accessToken) return;

//       try {
//         const permissions = {
//           orders: await checkPermission({
//             session,
//             entity: "orders",
//             action: PermissionActions.READ,
//           }),
//           products: await checkPermission({
//             session,
//             entity: "products",
//             action: PermissionActions.READ,
//           }),
//           users: await checkPermission({
//             session,
//             entity: "users",
//             action: PermissionActions.READ,
//           }),
//           tickets: await checkPermission({
//             session,
//             entity: "tickets",
//             action: PermissionActions.READ,
//           }),
//         };

//         setHasPermissions(permissions);
//         setLoading(false);

//         // Fetch data based on permissions
//         await fetchData(permissions);
//       } catch (error) {
//         console.error("Failed to check permissions:", error);
//         setLoading(false);
//       }
//     };

//     checkPermissions();
//   }, [session]);

//   const fetchData = async (permissions: { [key: string]: boolean }) => {
//     const fetchPromises = [];

//     if (permissions.orders) {
//       fetchPromises.push(
//         setOrders({
//           type: "fetchAll",
//           token: session?.user?.accessToken ?? "",
//         }),
//         setOrders({
//           type: "fetchStats",
//           token: session?.user?.accessToken ?? "",
//         }),
//         setOrders({
//           type: "fetchSalesReport",
//           token: session?.user?.accessToken ?? "",
//           payload: { year: new Date().getFullYear() },
//         })
//       );
//     }

//     if (permissions.users) {
//       fetchPromises.push(
//         setUsers({
//           type: "fetchAll",
//           token: session?.user?.accessToken ?? "",
//         })
//       );
//     }

//     if (permissions.products) {
//       fetchPromises.push(
//         setProducts({
//           type: "fetchProducts",
//           token: session?.user?.accessToken ?? "",
//         })
//       );
//     }

//     // if (permissions.files) {
//     fetchPromises.push(
//       setFiles({
//         type: "fetch",
//         token: session?.user?.accessToken ?? "",
//       })
//     );
//     // }

//     try {
//       await Promise.all(fetchPromises);
//     } catch (error) {
//       console.error("Failed to fetch dashboard data:", error);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex h-screen items-center justify-center">
//         <div className="text-center flex flex-col items-center gap-4">
//           <Loader className="h-16 w-16 " />
//           <p>Checking permissions...</p>
//         </div>
//       </div>
//     );
//   }

//   const canCreateProduct =
//     hasPermissions.products &&
//     checkPermission({
//       session,
//       entity: "products",
//       action: PermissionActions.CREATE,
//     });

//   const getGreeting = () => {
//     const currentHour = new Date().getHours();
//     if (currentHour < 12) return "Good Morning";
//     if (currentHour < 18) return "Good Afternoon";
//     return "Good Evening";
//   };

//   return (
//     <div className="@container">
//       <div className="grid grid-cols-1 gap-6 @4xl:grid-cols-2 @7xl:grid-cols-12 3xl:gap-8">
//         <WelcomeBanner
//           title={
//             <>
//               {getGreeting()}, <br /> {session.user.name}{" "}
//               <HandWaveIcon className="inline-flex h-8 w-8" />
//             </>
//           }
//           description={
//             "Here's what's happening on your store today. See the statistics at once."
//           }
//           media={
//             <div className="absolute -bottom-6 end-4 hidden w-[300px] @2xl:block lg:w-[320px] 2xl:-bottom-7 2xl:w-[330px]">
//               <div className="relative">
//                 <Image
//                   src={welcomeImg}
//                   alt="Welcome shop image form freepik"
//                   className="dark:brightness-95 dark:drop-shadow-md"
//                 />
//               </div>
//             </div>
//           }
//           contentClassName="@2xl:max-w-[calc(100%-340px)]"
//           className="border border-muted bg-gray-0 pb-8 @4xl:col-span-2 @7xl:col-span-8 dark:bg-gray-100/30 lg:pb-9"
//         >
//           {canCreateProduct && (
//             <Link href={routes.products.createProduct} className="inline-flex">
//               <Button as="span" className="h-[38px] shadow md:h-10">
//                 <PiPlusBold className="me-1 h-4 w-4" /> Add Product
//               </Button>
//             </Link>
//           )}
//         </WelcomeBanner>

//         {hasPermissions.orders && (
//           <>
//             <StatCards
//               className="@2xl:grid-cols-3 @3xl:gap-6 @4xl:col-span-2 @7xl:col-span-8"
//               orderStats={orderStats}
//             />
//             <SalesReport
//               className="@4xl:col-span-2 @7xl:col-span-8"
//               token={session.user.accessToken!}
//             />
//             <OrdersWidget
//               orderStats={orderStats}
//               className="@4xl:col-start-2 @4xl:row-start-3 @7xl:col-span-4 @7xl:col-start-auto @7xl:row-start-auto"
//             />
//             <RecentOrder
//               className="relative @4xl:col-span-2 @7xl:col-span-12"
//               orderData={orders}
//             />
//           </>
//         )}

//         {hasPermissions.tickets && (
//           <TicketsWidget className="h-[464px] @sm:h-[520px] @7xl:col-span-4 @7xl:col-start-9 @7xl:row-start-1 @7xl:row-end-3 @7xl:h-full" />
//         )}

//         {Object.values(hasPermissions).every((perm) => !perm) && (
//           <div className="@4xl:col-span-2 @7xl:col-span-12 p-8 text-center">
//             <p className="text-lg font-medium">
//               You don&apos;t have permission to view any dashboard content
//             </p>
//             <p className="text-gray-500">
//               Contact your administrator to request access
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Index;

"use client";

import { useAtom, useSetAtom } from "jotai";
import { routes } from "@/config/routes";
import WelcomeBanner from "@/core/components/banners/welcome";
import HandWaveIcon from "@core/components/icons/hand-wave";
import welcomeImg from "@public/shop-illustration.png";
import { Session } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { PiPlusBold } from "react-icons/pi";
import { Button, Loader } from "rizzui";
import StatCards from "./stat-cards";
import SalesReport from "./sales-report";
import RecentOrder from "./recent-order";
import TicketsWidget from "./tickets-report";
import OrdersWidget from "./orders-report";
import { useEffect, useState, useCallback } from "react";
import { usePermissions, PermissionActions } from "@core/utils/permissions";

// Atoms
import { cloudinaryActionsAtom } from "@/store/atoms/files.atom";
import { productActionsAtom } from "@/store/atoms/products.atom";
import { userActionsAtom } from "@/store/atoms/users.atom";
import {
  orderActionsAtom,
  ordersAtom,
  orderStatsAtom,
} from "@/store/atoms/orders.atom";

const Index = ({ session }: { session: Session }) => {
  const [hasPermissions, setHasPermissions] = useState<{
    [key: string]: boolean;
  }>({});
  const [loading, setLoading] = useState(true);
  const [orders] = useAtom(ordersAtom);
  const [orderStats] = useAtom(orderStatsAtom);

  const setOrders = useSetAtom(orderActionsAtom);
  const setUsers = useSetAtom(userActionsAtom);
  const setProducts = useSetAtom(productActionsAtom);
  const setFiles = useSetAtom(cloudinaryActionsAtom);

  const { hasPermission } = usePermissions();

  // Memoize fetchData to stabilize its reference
  const fetchData = useCallback(
    async (permissions: { [key: string]: boolean }) => {
      const fetchPromises = [];

      if (permissions.orders) {
        fetchPromises.push(
          setOrders({
            type: "fetchAll",
            token: session?.user?.accessToken ?? "",
          }),
          setOrders({
            type: "fetchStats",
            token: session?.user?.accessToken ?? "",
          }),
          setOrders({
            type: "fetchSalesReport",
            token: session?.user?.accessToken ?? "",
            payload: { year: new Date().getFullYear() },
          })
        );
      }

      if (permissions.users) {
        fetchPromises.push(
          setUsers({
            type: "fetchAll",
            token: session?.user?.accessToken ?? "",
          })
        );
      }

      if (permissions.products) {
        fetchPromises.push(
          setProducts({
            type: "fetchProducts",
            token: session?.user?.accessToken ?? "",
          })
        );
      }

      fetchPromises.push(
        setFiles({
          type: "fetch",
          token: session?.user?.accessToken ?? "",
        })
      );

      try {
        await Promise.all(fetchPromises);
      } catch (error) {
        // console.error("Failed to fetch dashboard data:", error);
        throw error;
      }
    },
    [session?.user?.accessToken, setOrders, setUsers, setProducts, setFiles]
  );

  // Check permissions on mount
  useEffect(() => {
    const checkPermissions = async () => {
      if (!session?.user?.accessToken) {
        setLoading(false);
        return;
      }

      try {
        const permissions = {
          orders: await hasPermission({
            session,
            entity: "orders",
            action: PermissionActions.READ,
          }),
          products: await hasPermission({
            session,
            entity: "products",
            action: PermissionActions.READ,
          }),
          users: await hasPermission({
            session,
            entity: "users",
            action: PermissionActions.READ,
          }),
          tickets: await hasPermission({
            session,
            entity: "tickets",
            action: PermissionActions.READ,
          }),
          productsCreate: await hasPermission({
            session,
            entity: "products",
            action: PermissionActions.CREATE,
          }),
        };

        setHasPermissions(permissions);
        setLoading(false);

        await fetchData(permissions);
      } catch (error) {
        console.error("Failed to check permissions:", error);
        setLoading(false);
      }
    };

    checkPermissions();
  }, [session, hasPermission, fetchData]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center flex flex-col items-center gap-4">
          <Loader className="h-16 w-16" />
          <p>Checking permissions...</p>
        </div>
      </div>
    );
  }

  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) return "Good Morning";
    if (currentHour < 18) return "Good Afternoon";
    return "Good Evening";
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
            "Here's what's happening on your store today. See the statistics at once."
          }
          media={
            <div className="absolute -bottom-6 end-4 hidden w-[300px] @2xl:block lg:w-[320px] 2xl:-bottom-7 2xl:w-[330px]">
              <div className="relative">
                <Image
                  src={welcomeImg}
                  alt="Welcome shop image from freepik"
                  className="dark:brightness-95 dark:drop-shadow-md"
                />
              </div>
            </div>
          }
          contentClassName="@2xl:max-w-[calc(100%-340px)]"
          className="border border-muted bg-gray-0 pb-8 @4xl:col-span-2 @7xl:col-span-8 dark:bg-gray-100/30 lg:pb-9"
        >
          {hasPermissions.productsCreate && (
            <Link href={routes.products.createProduct} className="inline-flex">
              <Button as="span" className="h-[38px] shadow md:h-10">
                <PiPlusBold className="me-1 h-4 w-4" /> Add Product
              </Button>
            </Link>
          )}
        </WelcomeBanner>

        {hasPermissions.orders && (
          <>
            <StatCards
              className="@2xl:grid-cols-3 @3xl:gap-6 @4xl:col-span-2 @7xl:col-span-8"
              orderStats={orderStats}
            />
            <SalesReport
              className="@4xl:col-span-2 @7xl:col-span-8"
              token={session.user.accessToken!}
            />
            <OrdersWidget
              orderStats={orderStats}
              className="@4xl:col-start-2 @4xl:row-start-3 @7xl:col-span-4 @7xl:col-start-auto @7xl:row-start-auto"
            />
            <RecentOrder
              className="relative @4xl:col-span-2 @7xl:col-span-12"
              orderData={orders}
            />
          </>
        )}

        {hasPermissions.tickets && (
          <TicketsWidget className="h-[464px] @sm:h-[520px] @7xl:col-span-4 @7xl:col-start-9 @7xl:row-start-1 @7xl:row-end-3 @7xl:h-full" />
        )}

        {Object.values(hasPermissions).every((perm) => !perm) && (
          <div className="@4xl:col-span-2 @7xl:col-span-12 p-8 text-center">
            <p className="text-lg font-medium">
              You don&apos;t have permission to view any dashboard content
            </p>
            <p className="text-gray-500">
              Contact your administrator to request access
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
