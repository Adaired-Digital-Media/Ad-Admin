// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";
// import Link from "next/link";
// import { Fragment, useEffect } from "react";
// import { usePathname } from "next/navigation";
// import { Title, Collapse } from "rizzui";
// import cn from "@core/utils/class-names";
// import { PiCaretDownBold } from "react-icons/pi";
// import { menuItems } from "@/layout/dashboard/menu-items";
// import StatusBadge from "@core/components/get-status-badge";
// import { useAtom } from "jotai";
// import { ticketActionsAtom, ticketStatsAtom } from "@/store/atoms/tickets.atom";
// import { useSession } from "next-auth/react";

// export function SidebarMenu() {
//   const pathname = usePathname();
//   const { data: session } = useSession();
//   const [ticketStats] = useAtom(ticketStatsAtom);
//   const [, dispatch] = useAtom(ticketActionsAtom);

//   useEffect(() => {
//     if (session?.user?.accessToken) {
//       try {
//         const fetchTicketStats = async () => {
//           await dispatch({
//             type: "fetchStats",
//             token: session?.user?.accessToken ?? "",
//           });
//         };
//         fetchTicketStats();
//       } catch (error) {
//         console.error("Error fetching ticket stats:", error);
//       }
//     }
//   }, [session?.user?.accessToken, dispatch]);

//   // Clone menuItems and update the Support item's badge dynamically
//   const updatedMenuItems = menuItems.map((item) =>
//     item.name === "Support"
//       ? {
//           ...item,
//           badge: ticketStats?.stats?.open > 0 ? ticketStats?.stats?.open.toString() : "",
//         }
//       : item
//   );

//   return (
//     <div className="mt-4 pb-3 3xl:mt-6">
//       {updatedMenuItems.map((item, index) => {
//         const isActive = pathname === (item?.href as string);
//         const pathnameExistInDropdowns: any = item?.dropdownItems?.filter(
//           (dropdownItem) => dropdownItem.href === pathname
//         );
//         const isDropdownOpen = Boolean(pathnameExistInDropdowns?.length);

//         return (
//           <Fragment key={item.name + "-" + index}>
//             {item?.href ? (
//               <>
//                 {item?.dropdownItems ? (
//                   <Collapse
//                     defaultOpen={isDropdownOpen}
//                     header={({ open, toggle }) => (
//                       <div
//                         onClick={toggle}
//                         className={cn(
//                           "group relative mx-3 flex cursor-pointer items-center justify-between rounded-md px-3 py-2 font-medium lg:my-1 2xl:mx-5 2xl:my-2",
//                           isDropdownOpen
//                             ? "before:top-2/5 text-primary before:absolute before:-start-3 before:block before:h-4/5 before:w-1 before:rounded-ee-md before:rounded-se-md before:bg-primary 2xl:before:-start-5"
//                             : "text-gray-700 transition-colors duration-200 hover:bg-gray-100 dark:text-gray-700/90 dark:hover:text-gray-700"
//                         )}
//                       >
//                         <span className="flex items-center">
//                           {item?.icon && (
//                             <span
//                               className={cn(
//                                 "me-2 inline-flex h-5 w-5 items-center justify-center rounded-md [&>svg]:h-[20px] [&>svg]:w-[20px]",
//                                 isDropdownOpen
//                                   ? "text-primary"
//                                   : "text-gray-800 dark:text-gray-500 dark:group-hover:text-gray-700"
//                               )}
//                             >
//                               {item?.icon}
//                             </span>
//                           )}
//                           {item.name}
//                         </span>

//                         <PiCaretDownBold
//                           strokeWidth={3}
//                           className={cn(
//                             "h-3.5 w-3.5 -rotate-90 text-gray-500 transition-transform duration-200 rtl:rotate-90",
//                             open && "rotate-0 rtl:rotate-0"
//                           )}
//                         />
//                       </div>
//                     )}
//                   >
//                     {item?.dropdownItems?.map((dropdownItem, index) => {
//                       const isChildActive =
//                         pathname === (dropdownItem?.href as string);

//                       return (
//                         <Link
//                           href={dropdownItem?.href}
//                           key={dropdownItem?.name + index}
//                           className={cn(
//                             "mx-3.5 mb-0.5 flex items-center justify-between rounded-md px-3.5 py-2 font-medium capitalize last-of-type:mb-1 lg:last-of-type:mb-2 2xl:mx-5",
//                             isChildActive
//                               ? "text-primary"
//                               : "text-gray-500 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-900"
//                           )}
//                         >
//                           <div className="flex items-center truncate">
//                             <span
//                               className={cn(
//                                 "me-[18px] ms-1 inline-flex h-1 w-1 rounded-full bg-current transition-all duration-200",
//                                 isChildActive
//                                   ? "bg-primary ring-[1px] ring-primary"
//                                   : "opacity-40"
//                               )}
//                             />
//                             <span className="truncate">
//                               {dropdownItem?.name}
//                             </span>
//                           </div>
//                           {/* Uncomment if dropdown items need badges */}
//                           {/* {dropdownItem?.badge?.length ? (
//                             <StatusBadge status={dropdownItem?.badge} />
//                           ) : null} */}
//                         </Link>
//                       );
//                     })}
//                   </Collapse>
//                 ) : (
//                   <Link
//                     href={item?.href}
//                     className={cn(
//                       "group relative mx-3 my-0.5 flex items-center justify-between rounded-md px-3 py-2 font-medium capitalize lg:my-1 2xl:mx-5 2xl:my-2",
//                       isActive
//                         ? "before:top-2/5 text-primary before:absolute before:-start-3 before:block before:h-4/5 before:w-1 before:rounded-ee-md before:rounded-se-md before:bg-primary 2xl:before:-start-5"
//                         : "text-gray-700 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-700/90"
//                     )}
//                   >
//                     <div className="flex items-center truncate">
//                       {item?.icon && (
//                         <span
//                           className={cn(
//                             "me-2 inline-flex size-5 items-center justify-center rounded-md [&>svg]:size-5",
//                             isActive
//                               ? "text-primary"
//                               : "text-gray-800 dark:text-gray-500 dark:group-hover:text-gray-700"
//                           )}
//                         >
//                           {item?.icon}
//                         </span>
//                       )}
//                       <span className="truncate">{item.name}</span>
//                     </div>
//                     {item?.badge?.length ? (
//                       <StatusBadge status={item.badge} />
//                     ) : null}
//                   </Link>
//                 )}
//               </>
//             ) : (
//               <Title
//                 as="h6"
//                 className={cn(
//                   "mb-2 truncate px-6 text-xs font-normal uppercase tracking-widest text-gray-500 2xl:px-8",
//                   index !== 0 && "mt-6 3xl:mt-7"
//                 )}
//               >
//                 {item.name}
//               </Title>
//             )}
//           </Fragment>
//         );
//       })}
//     </div>
//   );
// }

/* eslint-disable @typescript-eslint/no-explicit-any */





// "use client";
// import Link from "next/link";
// import { Fragment, useEffect, useState, useCallback } from "react";
// import { usePathname } from "next/navigation";
// import { Title, Collapse } from "rizzui";
// import cn from "@core/utils/class-names";
// import { PiCaretDownBold } from "react-icons/pi";
// import { menuItems } from "@/layout/dashboard/menu-items";
// import StatusBadge from "@core/components/get-status-badge";
// import { useAtom } from "jotai";
// import { ticketActionsAtom, ticketStatsAtom } from "@/store/atoms/tickets.atom";
// import { usePermissions, PermissionActions } from "@core/utils/permissions";
// import { routes } from "@/config/routes";
// import { useSession } from "next-auth/react";
// import { useRouter } from "nextjs-toploader/app";

// export function SidebarMenu() {
//   const pathname = usePathname();
//   const router = useRouter();
//   const { data: session } = useSession();
//   const [ticketStats] = useAtom(ticketStatsAtom);
//   const [, dispatch] = useAtom(ticketActionsAtom);
//   const { hasPermission } = usePermissions();
//   const [permissions, setPermissions] = useState<{
//     [key: string]: { [action: string]: boolean };
//   }>({});

//   // Fetch ticket stats
//   useEffect(() => {
//     if (session?.user?.accessToken) {
//       try {
//         const fetchTicketStats = async () => {
//           await dispatch({
//             type: "fetchStats",
//             token: session?.user?.accessToken ?? "",
//           });
//         };
//         fetchTicketStats();
//       } catch (error) {
//         console.error("Error fetching ticket stats:", error);
//       }
//     }
//   }, [session?.user?.accessToken, dispatch]);

//   // Check permissions for all menu items and dropdown items
//   useEffect(() => {
//     const checkMenuPermissions = async () => {
//       if (!session?.user) return;

//       const permissionChecks: {
//         [key: string]: { [action: string]: Promise<boolean> };
//       } = {};

//       menuItems.forEach((item) => {
//         // Skip items without entity (e.g., Dashboard, labels)
//         if (item.entity && item.action) {
//           permissionChecks[item.entity] = permissionChecks[item.entity] || {};
//           permissionChecks[item.entity][item.action] = hasPermission({
//             session,
//             entity: item.entity,
//             action:
//               PermissionActions[item.action as keyof typeof PermissionActions],
//           });
//         }
//         if (item.dropdownItems) {
//           item.dropdownItems.forEach((dropdownItem) => {
//             if (dropdownItem.entity && dropdownItem.action) {
//               permissionChecks[dropdownItem.entity] =
//                 permissionChecks[dropdownItem.entity] || {};
//               permissionChecks[dropdownItem.entity][dropdownItem.action] =
//                 hasPermission({
//                   session,
//                   entity: dropdownItem.entity,
//                   action:
//                     PermissionActions[
//                       dropdownItem.action as keyof typeof PermissionActions
//                     ],
//                 });
//             }
//           });
//         }
//       });

//       const resolvedPermissions: {
//         [key: string]: { [action: string]: boolean };
//       } = {};
//       for (const entity of Object.keys(permissionChecks)) {
//         resolvedPermissions[entity] = {};
//         for (const action of Object.keys(permissionChecks[entity])) {
//           resolvedPermissions[entity][action] = await permissionChecks[entity][
//             action
//           ];
//         }
//       }

//       setPermissions(resolvedPermissions);
//     };

//     checkMenuPermissions();
//   }, [session, hasPermission]);

//   // Clone menuItems and update the Support item's badge dynamically
//   const updatedMenuItems = menuItems.map((item) =>
//     item.name === "Support"
//       ? {
//           ...item,
//           badge:
//             ticketStats?.stats?.open > 0
//               ? ticketStats?.stats?.open.toString()
//               : "",
//         }
//       : item
//   );

//   // Handle menu item click with permission check
//   const handleMenuClick = useCallback(
//     async (
//       entity: string | undefined,
//       action: string | undefined,
//       href: string
//     ) => {
//       // Skip permission check if no entity (e.g., Dashboard)
//       if (!entity || !action || !session) {
//         router.push(href);
//         return;
//       }

//       const hasAccess = await hasPermission({
//         session,
//         entity,
//         action: PermissionActions[action as keyof typeof PermissionActions],
//       });

//       if (hasAccess) {
//         router.push(href);
//       } else {
//         router.push(routes.root["access-denied"]);
//       }
//     },
//     [session, hasPermission, router]
//   );

//   return (
//     <div className="mt-4 pb-3 3xl:mt-6">
//       {updatedMenuItems.map((item, index) => {
//         const isActive = pathname === (item?.href as string);
//         const pathnameExistInDropdowns = item?.dropdownItems?.filter(
//           (dropdownItem) => dropdownItem.href && dropdownItem.href === pathname
//         ) || [];
//         const isDropdownOpen = Boolean(pathnameExistInDropdowns?.length);

//         // For dropdown items, check if at least one dropdown item is accessible
//         let hasDropdownAccess = true;
//         if (item.dropdownItems) {
//           hasDropdownAccess = item.dropdownItems.some((dropdownItem) => {
//             if (!dropdownItem.entity || !dropdownItem.action) return true;
//             return (
//               permissions[dropdownItem.entity]?.[dropdownItem.action] !== false
//             );
//           });
//         }

//         // Skip rendering if no permission for the item and it's not a dropdown or label
//         if (
//           item.entity &&
//           item.action &&
//           permissions[item.entity]?.[item.action] === false &&
//           !item.dropdownItems
//         ) {
//           return null;
//         }

//         // Skip rendering dropdown if no accessible dropdown items
//         if (item.dropdownItems && !hasDropdownAccess) {
//           return null;
//         }

//         return (
//           <Fragment key={item.name + "-" + index}>
//             {item?.href ? (
//               <>
//                 {item?.dropdownItems ? (
//                   <Collapse
//                     defaultOpen={isDropdownOpen}
//                     header={({ open, toggle }) => (
//                       <div
//                         onClick={toggle}
//                         className={cn(
//                           "group relative mx-3 flex cursor-pointer items-center justify-between rounded-md px-3 py-2 font-medium lg:my-1 2xl:mx-5 2xl:my-2",
//                           isDropdownOpen
//                             ? "before:top-2/5 text-primary before:absolute before:-start-3 before:block before:h-4/5 before:w-1 before:rounded-ee-md before:rounded-se-md before:bg-primary 2xl:before:-start-5"
//                             : "text-gray-700 transition-colors duration-200 hover:bg-gray-100 dark:text-gray-700/90 dark:hover:text-gray-700"
//                         )}
//                       >
//                         <span className="flex items-center">
//                           {item?.icon && (
//                             <span
//                               className={cn(
//                                 "me-2 inline-flex h-5 w-5 items-center justify-center rounded-md [&>svg]:h-[20px] [&>svg]:w-[20px]",
//                                 isDropdownOpen
//                                   ? "text-primary"
//                                   : "text-gray-800 dark:text-gray-500 dark:group-hover:text-gray-700"
//                               )}
//                             >
//                               {item?.icon}
//                             </span>
//                           )}
//                           {item.name}
//                         </span>
//                         <PiCaretDownBold
//                           strokeWidth={3}
//                           className={cn(
//                             "h-3.5 w-3.5 -rotate-90 text-gray-500 transition-transform duration-200 rtl:rotate-90",
//                             open && "rotate-0 rtl:rotate-0"
//                           )}
//                         />
//                       </div>
//                     )}
//                   >
//                     {item?.dropdownItems?.map((dropdownItem, index) => {
//                       const isChildActive =
//                         pathname === (dropdownItem?.href as string);

//                       // Skip rendering if no permission for dropdown item
//                       if (
//                         dropdownItem.entity &&
//                         dropdownItem.action &&
//                         permissions[dropdownItem.entity]?.[
//                           dropdownItem.action
//                         ] === false
//                       ) {
//                         return null;
//                       }

//                       return (
//                         <Link
//                           // href={dropdownItem?.href}
//                           // onClick={() => {
//                           //   // e.preventDefault();
//                           //   handleMenuClick(
//                           //     dropdownItem.entity,
//                           //     dropdownItem.action,
//                           //     dropdownItem.href
//                           //   );
//                           // }}

//                           href={"#"} // Prevent default navigation
//                           onClick={(e) => {
//                             e.preventDefault();
//                             handleMenuClick(
//                               dropdownItem.entity,
//                               dropdownItem.action,
//                               dropdownItem.href!
//                             );
//                           }}
//                           key={dropdownItem?.name + index}
//                           className={cn(
//                             "mx-3.5 mb-0.5 flex items-center justify-between rounded-md px-3.5 py-2 font-medium capitalize last-of-type:mb-1 lg:last-of-type:mb-2 2xl:mx-5",
//                             isChildActive
//                               ? "text-primary"
//                               : "text-gray-500 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-900"
//                           )}
//                         >
//                           <div className="flex items-center truncate">
//                             <span
//                               className={cn(
//                                 "me-[18px] ms-1 inline-flex h-1 w-1 rounded-full bg-current transition-all duration-200",
//                                 isChildActive
//                                   ? "bg-primary ring-[1px] ring-primary"
//                                   : "opacity-40"
//                               )}
//                             />
//                             <span className="truncate">
//                               {dropdownItem?.name}
//                             </span>
//                           </div>
//                         </Link>
//                       );
//                     })}
//                   </Collapse>
//                 ) : (
//                   <Link
//                     href={item?.href}
//                     onClick={() => {
//                       // e.preventDefault();
//                       handleMenuClick(item.entity, item.action, item.href);
//                     }}
//                     className={cn(
//                       "group relative mx-3 my-0.5 flex items-center justify-between rounded-md px-3 py-2 font-medium capitalize lg:my-1 2xl:mx-5 2xl:my-2",
//                       isActive
//                         ? "before:top-2/5 text-primary before:absolute before:-start-3 before:block before:h-4/5 before:w-1 before:rounded-ee-md before:rounded-se-md before:bg-primary 2xl:before:-start-5"
//                         : "text-gray-700 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-700/90"
//                     )}
//                   >
//                     <div className="flex items-center truncate">
//                       {item?.icon && (
//                         <span
//                           className={cn(
//                             "me-2 inline-flex size-5 items-center justify-center rounded-md [&>svg]:size-5",
//                             isActive
//                               ? "text-primary"
//                               : "text-gray-800 dark:text-gray-500 dark:group-hover:text-gray-700"
//                           )}
//                         >
//                           {item?.icon}
//                         </span>
//                       )}
//                       <span className="truncate">{item.name}</span>
//                     </div>
//                     {item?.badge?.length ? (
//                       <StatusBadge status={item.badge} />
//                     ) : null}
//                   </Link>
//                 )}
//               </>
//             ) : (
//               <Title
//                 as="h6"
//                 className={cn(
//                   "mb-2 truncate px-6 text-xs font-normal uppercase tracking-widest text-gray-500 2xl:px-8",
//                   index !== 0 && "mt-6 3xl:mt-7"
//                 )}
//               >
//                 {item.name}
//               </Title>
//             )}
//           </Fragment>
//         );
//       })}
//     </div>
//   );
// }



/* eslint-disable @typescript-eslint/no-explicit-any */





// "use client";
// import Link from "next/link";
// import { Fragment, useEffect, useState, useCallback } from "react";
// import { usePathname, useRouter } from "next/navigation";
// import { Title, Collapse } from "rizzui";
// import cn from "@core/utils/class-names";
// import { PiCaretDownBold } from "react-icons/pi";
// import { menuItems } from "@/layout/dashboard/menu-items";
// import StatusBadge from "@core/components/get-status-badge";
// import { useAtom } from "jotai";
// import { ticketActionsAtom, ticketStatsAtom } from "@/store/atoms/tickets.atom";
// import { usePermissions, PermissionActions } from "@core/utils/permissions";
// import { routes } from "@/config/routes";
// import { useSession } from "next-auth/react";

// interface DropdownItem {
//   name: string;
//   href: string;
//   entity?: string;
//   action?: string;
// }

// interface MenuItem {
//   name: string;
//   href?: string;
//   icon?: JSX.Element;
//   badge?: string;
//   entity?: string;
//   action?: string;
//   dropdownItems?: DropdownItem[];
// }

// interface MenuGroup {
//   label?: MenuItem;
//   items: MenuItem[];
// }

// export function SidebarMenu() {
//   const pathname = usePathname();
//   const router = useRouter();
//   const { data: session } = useSession();
//   const [ticketStats] = useAtom(ticketStatsAtom);
//   const [, dispatch] = useAtom(ticketActionsAtom);
//   const { hasPermission } = usePermissions();
//   const [permissions, setPermissions] = useState<{
//     [key: string]: { [action: string]: boolean };
//   }>({});

//   // Fetch ticket stats
//   useEffect(() => {
//     if (session?.user?.accessToken) {
//       try {
//         const fetchTicketStats = async () => {
//           await dispatch({
//             type: "fetchStats",
//             token: session?.user?.accessToken ?? "",
//           });
//         };
//         fetchTicketStats();
//       } catch (error) {
//         console.error("Error fetching ticket stats:", error);
//       }
//     }
//   }, [session?.user?.accessToken, dispatch]);

//   // Check permissions for all menu items and dropdown items
//   useEffect(() => {
//     const checkMenuPermissions = async () => {
//       if (!session?.user) return;

//       const permissionChecks: { [key: string]: { [action: string]: Promise<boolean> } } = {};

//       menuItems.forEach((item: MenuItem) => {
//         if (item.entity && item.action) {
//           permissionChecks[item.entity] = permissionChecks[item.entity] || {};
//           permissionChecks[item.entity][item.action] = hasPermission({
//             session,
//             entity: item.entity,
//             action: PermissionActions[item.action as keyof typeof PermissionActions],
//           });
//         }
//         if (item.dropdownItems) {
//           item.dropdownItems.forEach((dropdownItem) => {
//             if (dropdownItem.entity && dropdownItem.action) {
//               permissionChecks[dropdownItem.entity] = permissionChecks[dropdownItem.entity] || {};
//               permissionChecks[dropdownItem.entity][dropdownItem.action] = hasPermission({
//                 session,
//                 entity: dropdownItem.entity,
//                 action: PermissionActions[dropdownItem.action as keyof typeof PermissionActions],
//               });
//             }
//           });
//         }
//       });

//       const resolvedPermissions: { [key: string]: { [action: string]: boolean } } = {};
//       for (const entity of Object.keys(permissionChecks)) {
//         resolvedPermissions[entity] = {};
//         for (const action of Object.keys(permissionChecks[entity])) {
//           resolvedPermissions[entity][action] = await permissionChecks[entity][action];
//         }
//       }

//       setPermissions(resolvedPermissions);
//     };

//     checkMenuPermissions();
//   }, [session, hasPermission]);

//   // Clone menuItems and update the Support item's badge dynamically
//   const updatedMenuItems = menuItems.map((item: MenuItem) =>
//     item.name === "Support"
//       ? {
//           ...item,
//           badge: ticketStats?.stats?.open > 0 ? ticketStats?.stats?.open.toString() : "",
//         }
//       : item
//   );

//   // Group menu items by labels
//   const groupedMenuItems: MenuGroup[] = [];
//   let currentGroup: MenuGroup = { items: [] };
//   updatedMenuItems.forEach((item) => {
//     if (!item.href && !item.dropdownItems) {
//       // Label item
//       if (currentGroup.items.length > 0 || currentGroup.label) {
//         groupedMenuItems.push(currentGroup);
//       }
//       currentGroup = { label: item, items: [] };
//     } else {
//       // Menu item
//       currentGroup.items.push(item);
//     }
//   });
//   if (currentGroup.items.length > 0 || currentGroup.label) {
//     groupedMenuItems.push(currentGroup);
//   }

//   // Handle menu item click with permission check
//   const handleMenuClick = useCallback(
//     async (entity: string | undefined, action: string | undefined, href: string) => {
//       if (!href) {
//         console.warn(`Navigation aborted: href is undefined`);
//         return;
//       }
//       // Skip permission check if no entity (e.g., Dashboard)
//       if (!entity || !action || !session) {
//         router.push(href);
//         return;
//       }

//       const hasAccess = await hasPermission({
//         session,
//         entity,
//         action: PermissionActions[action as keyof typeof PermissionActions],
//       });

//       if (hasAccess) {
//         router.push(href);
//       } else {
//         router.push(routes.root["access-denied"]);
//       }
//     },
//     [session, hasPermission, router]
//   );

//   // Check if a menu item is visible based on permissions
//   const isItemVisible = (item: MenuItem): boolean => {
//     if (!item.entity || !item.action) {
//       // Items without entity/action (e.g., Dashboard) are always visible
//       return true;
//     }
//     if (item.dropdownItems) {
//       // Dropdown item is visible if at least one sub-item is accessible
//       return item.dropdownItems.some((dropdownItem) => {
//         if (!dropdownItem.entity || !dropdownItem.action) return true;
//         return permissions[dropdownItem.entity]?.[dropdownItem.action] !== false;
//       });
//     }
//     // Non-dropdown item is visible if it has permission
//     return permissions[item.entity]?.[item.action] !== false;
//   };

//   return (
//     <div className="mt-4 pb-3 3xl:mt-6">
//       {groupedMenuItems.map((group, groupIndex) => {
//         // Check if any items in the group are visible
//         const hasVisibleItems = group.items.some((item) => isItemVisible(item));

//         // Skip rendering the entire group (label and items) if no items are visible
//         if (!hasVisibleItems) {
//           console.log(`Skipping group ${group.label?.name || "unnamed"}: no visible items`);
//           return null;
//         }

//         return (
//           <Fragment key={`group-${groupIndex}`}>
//             {group.label && (
//               <>
//                 {console.log(`Rendering label: ${group.label.name}`)}
//                 <Title
//                   as="h6"
//                   className={cn(
//                     "mb-2 truncate px-6 text-xs font-normal uppercase tracking-widest text-gray-500 2xl:px-8",
//                     groupIndex !== 0 && "mt-6 3xl:mt-7"
//                   )}
//                 >
//                   {group.label.name}
//                 </Title>
//               </>
//             )}
//             {group.items.map((item, index) => {
//               // Validate item props
//               if (!item.name) {
//                 console.warn(`Menu item at index ${index} in group ${group.label?.name || "unnamed"} has undefined name`);
//                 return null;
//               }

//               const isActive = item.href && item.href !== "#" ? pathname === item.href : false;
//               const pathnameExistInDropdowns = item.dropdownItems
//                 ? item.dropdownItems.filter(
//                     (dropdownItem) =>
//                       typeof dropdownItem.href === "string" && dropdownItem.href === pathname
//                   )
//                 : [];
//               const isDropdownOpen = pathnameExistInDropdowns.length > 0;

//               // Skip rendering if item is not visible
//               if (!isItemVisible(item)) {
//                 console.log(`Skipping item: ${item.name} due to permissions`);
//                 return null;
//               }

//               return (
//                 <Fragment key={`${item.name}-${index}`}>
//                   {item.href ? (
//                     <>
//                       {item.dropdownItems ? (
//                         <>
//                           {console.log(`Rendering Collapse for ${item.name}`, {
//                             href: item.href,
//                             badge: item.badge,
//                             dropdownItems: item.dropdownItems.map((di) => ({
//                               name: di.name,
//                               href: di.href,
//                             })),
//                           })}
//                           <Collapse
//                             defaultOpen={isDropdownOpen}
//                             header={({ open, toggle }) => (
//                               <div
//                                 onClick={toggle}
//                                 className={cn(
//                                   "group relative mx-3 flex cursor-pointer items-center justify-between rounded-md px-3 py-2 font-medium lg:my-1 2xl:mx-5 2xl:my-2",
//                                   isDropdownOpen
//                                     ? "before:top-2/5 text-primary before:absolute before:-start-3 before:block before:h-4/5 before:w-1 before:rounded-ee-md before:rounded-se-md before:bg-primary 2xl:before:-start-5"
//                                     : "text-gray-700 transition-colors duration-200 hover:bg-gray-100 dark:text-gray-700/90 dark:hover:text-gray-700"
//                                 )}
//                               >
//                                 <span className="flex items-center">
//                                   {item.icon && (
//                                     <span
//                                       className={cn(
//                                         "me-2 inline-flex h-5 w-5 items-center justify-center rounded-md [&>svg]:h-[20px] [&>svg]:w-[20px]",
//                                         isDropdownOpen
//                                           ? "text-primary"
//                                           : "text-gray-800 dark:text-gray-500 dark:group-hover:text-gray-700"
//                                       )}
//                                     >
//                                       {item.icon}
//                                     </span>
//                                   )}
//                                   {item.name}
//                                 </span>
//                                 <PiCaretDownBold
//                                   strokeWidth={3}
//                                   className={cn(
//                                     "h-3.5 w-3.5 -rotate-90 text-gray-500 transition-transform duration-200 rtl:rotate-90",
//                                     open && "rotate-0 rtl:rotate-0"
//                                   )}
//                                 />
//                               </div>
//                             )}
//                           >
//                             {item.dropdownItems.map((dropdownItem, subIndex) => {
//                               // Validate dropdown item props
//                               if (!dropdownItem.name) {
//                                 console.warn(`Dropdown item at index ${subIndex} for ${item.name} has undefined name`);
//                                 return null;
//                               }
//                               if (!dropdownItem.href) {
//                                 console.warn(`Dropdown item "${dropdownItem.name}" for ${item.name} has undefined href`);
//                                 return null;
//                               }

//                               const isChildActive = pathname === dropdownItem.href;

//                               // Skip rendering if no permission for dropdown item
//                               if (
//                                 dropdownItem.entity &&
//                                 dropdownItem.action &&
//                                 permissions[dropdownItem.entity]?.[dropdownItem.action] === false
//                               ) {
//                                 console.log(`Skipping dropdown item: ${dropdownItem.name} due to permissions`);
//                                 return null;
//                               }

//                               return (
//                                 <Link
//                                   href={"#"} // Prevent default navigation
//                                   onClick={(e) => {
//                                     e.preventDefault();
//                                     console.log(`Clicked Link for ${dropdownItem.name}`, {
//                                       href: dropdownItem.href,
//                                       entity: dropdownItem.entity,
//                                       action: dropdownItem.action,
//                                     });
//                                     handleMenuClick(dropdownItem.entity, dropdownItem.action, dropdownItem.href);
//                                   }}
//                                   key={`${dropdownItem.name}-${subIndex}`}
//                                   className={cn(
//                                     "mx-3.5 mb-0.5 flex items-center justify-between rounded-md px-3.5 py-2 font-medium capitalize last-of-type:mb-1 lg:last-of-type:mb-2 2xl:mx-5",
//                                     isChildActive
//                                       ? "text-primary"
//                                       : "text-gray-500 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-900"
//                                   )}
//                                 >
//                                   <div className="flex items-center truncate">
//                                     <span
//                                       className={cn(
//                                         "me-[18px] ms-1 inline-flex h-1 w-1 rounded-full bg-current transition-all duration-200",
//                                         isChildActive
//                                           ? "bg-primary ring-[1px] ring-primary"
//                                           : "opacity-40"
//                                       )}
//                                     />
//                                     <span className="truncate">{dropdownItem.name}</span>
//                                   </div>
//                                 </Link>
//                               );
//                             })}
//                           </Collapse>
//                         </>
//                       ) : (
//                         <>
//                           {console.log(`Rendering Link for ${item.name}`, {
//                             href: item.href,
//                             badge: item.badge,
//                           })}
//                           <Link
//                             href={"#"} // Prevent default navigation
//                             onClick={(e) => {
//                               e.preventDefault();
//                               if (!item.href) {
//                                 console.warn(`Menu item "${item.name}" has undefined href`);
//                                 return;
//                               }
//                               console.log(`Clicked Link for ${item.name}`, {
//                                 href: item.href,
//                                 entity: item.entity,
//                                 action: item.action,
//                               });
//                               handleMenuClick(item.entity, item.action, item.href);
//                             }}
//                             className={cn(
//                               "group relative mx-3 my-0.5 flex items-center justify-between rounded-md px-3 py-2 font-medium capitalize lg:my-1 2xl:mx-5 2xl:my-2",
//                               isActive
//                                 ? "before:top-2/5 text-primary before:absolute before:-start-3 before:block before:h-4/5 before:w-1 before:rounded-ee-md before:rounded-se-md before:bg-primary 2xl:before:-start-5"
//                                 : "text-gray-700 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-700/90"
//                             )}
//                           >
//                             <div className="flex items-center truncate">
//                               {item.icon && (
//                                 <span
//                                   className={cn(
//                                     "me-2 inline-flex size-5 items-center justify-center rounded-md [&>svg]:size-5",
//                                     isActive
//                                       ? "text-primary"
//                                       : "text-gray-800 dark:text-gray-500 dark:group-hover:text-gray-700"
//                                   )}
//                                 >
//                                   {item.icon}
//                                 </span>
//                               )}
//                               <span className="truncate">{item.name}</span>
//                             </div>
//                             {item.badge ? <StatusBadge status={item.badge} /> : null}
//                           </Link>
//                         </>
//                       )}
//                     </>
//                   ) : (
//                     <Title
//                       as="h6"
//                       className={cn(
//                         "mb-2 truncate px-6 text-xs font-normal uppercase tracking-widest text-gray-500 2xl:px-8",
//                         index !== 0 && "mt-6 3xl:mt-7"
//                       )}
//                     >
//                       {item.name}
//                     </Title>
//                   )}
//                 </Fragment>
//               );
//             })}
//           </Fragment>
//         );
//       })}
//     </div>
//   );
// }





/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Link from "next/link";
import { Fragment, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { Title, Collapse } from "rizzui";
import cn from "@core/utils/class-names";
import { PiCaretDownBold } from "react-icons/pi";
import { menuItems } from "@/layout/dashboard/menu-items";
import StatusBadge from "@core/components/get-status-badge";
import { useAtom } from "jotai";
import { ticketActionsAtom, ticketStatsAtom } from "@/store/atoms/tickets.atom";
import { usePermissions, PermissionActions } from "@core/utils/permissions";
import { routes } from "@/config/routes";
import { useSession } from "next-auth/react";
import { useRouter } from "nextjs-toploader/app";


interface DropdownItem {
  name: string;
  href: string;
  entity?: string;
  action?: string;
}

interface MenuItem {
  name: string;
  href?: string;
  icon?: JSX.Element;
  badge?: string;
  entity?: string;
  action?: string;
  dropdownItems?: DropdownItem[];
}

export function SidebarMenu() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [ticketStats] = useAtom(ticketStatsAtom);
  const [, dispatch] = useAtom(ticketActionsAtom);
  const { hasPermission } = usePermissions();

  // Fetch ticket stats
  useEffect(() => {
    if (session?.user?.accessToken) {
      try {
        const fetchTicketStats = async () => {
          await dispatch({
            type: "fetchStats",
            token: session?.user?.accessToken ?? "",
          });
        };
        fetchTicketStats();
      } catch (error) {
        console.error("Error fetching ticket stats:", error);
      }
    }
  }, [session?.user?.accessToken, dispatch]);

  // Clone menuItems and update the Support item's badge dynamically
  const updatedMenuItems = menuItems.map((item: MenuItem) =>
    item.name === "Support"
      ? {
          ...item,
          badge: ticketStats?.stats?.open > 0 ? ticketStats?.stats?.open.toString() : "",
        }
      : item
  );

  // Handle menu item click with permission check
  const handleMenuClick = useCallback(
    async (entity: string | undefined, action: string | undefined, href: string) => {
      if (!href) {
        console.warn(`Navigation aborted: href is undefined`);
        return;
      }
      // Skip permission check if no entity or action (e.g., Dashboard)
      if (!entity || !action || !session) {
        router.push(href);
        return;
      }

      const hasAccess = await hasPermission({
        session,
        entity,
        action: PermissionActions[action as keyof typeof PermissionActions],
      });

      if (hasAccess) {
        router.push(href);
      } else {
        console.log(`Redirecting to unauthorized: ${entity}/${action}`);
        router.push(routes.root.unauthorized);
      }
    },
    [session, hasPermission, router]
  );

  return (
    <div className="mt-4 pb-3 3xl:mt-6">
      {updatedMenuItems.map((item: MenuItem, index: number) => {
        // Validate item props
        if (!item.name) {
          console.warn(`Menu item at index ${index} has undefined name`);
          return null;
        }

        const isActive = item.href && item.href !== "#" ? pathname === item.href : false;
        const pathnameExistInDropdowns = item.dropdownItems
          ? item.dropdownItems.filter(
              (dropdownItem) =>
                typeof dropdownItem.href === "string" && dropdownItem.href === pathname
            )
          : [];
        const isDropdownOpen = pathnameExistInDropdowns.length > 0;

        return (
          <Fragment key={`${item.name}-${index}`}>
            {item.href ? (
              <>
                {item.dropdownItems ? (
                  <>
                    <Collapse
                      defaultOpen={isDropdownOpen}
                      header={({ open, toggle }) => {
                        return (
                          <div
                            onClick={toggle}
                            className={cn(
                              "group relative mx-3 flex cursor-pointer items-center justify-between rounded-md px-3 py-2 font-medium lg:my-1 2xl:mx-5 2xl:my-2",
                              isDropdownOpen
                                ? "before:top-2/5 text-primary before:absolute before:-start-3 before:block before:h-4/5 before:w-1 before:rounded-ee-md before:rounded-se-md before:bg-primary 2xl:before:-start-5"
                                : "text-gray-700 transition-colors duration-200 hover:bg-gray-100 dark:text-gray-700/90 dark:hover:text-gray-700"
                            )}
                          >
                            <span className="flex items-center">
                              {item.icon && (
                                <span
                                  className={cn(
                                    "me-2 inline-flex h-5 w-5 items-center justify-center rounded-md [&>svg]:h-[20px] [&>svg]:w-[20px]",
                                    isDropdownOpen
                                      ? "text-primary"
                                      : "text-gray-800 dark:text-gray-500 dark:group-hover:text-gray-700"
                                  )}
                                >
                                  {item.icon}
                                </span>
                              )}
                              {item.name}
                            </span>
                            <PiCaretDownBold
                              strokeWidth={3}
                              className={cn(
                                "h-3.5 w-3.5 -rotate-90 text-gray-500 transition-transform duration-200 rtl:rotate-90",
                                open && "rotate-0 rtl:rotate-0"
                              )}
                            />
                          </div>
                        );
                      }}
                    >
                      {item.dropdownItems.map((dropdownItem, subIndex) => {
                        // Validate dropdown item props
                        if (!dropdownItem.name) {
                          console.warn(`Dropdown item at index ${subIndex} for ${item.name} has undefined name`);
                          return null;
                        }
                        if (!dropdownItem.href) {
                          console.warn(`Dropdown item "${dropdownItem.name}" for ${item.name} has undefined href`);
                          return null;
                        }

                        const isChildActive = pathname === dropdownItem.href;

                        return (
                          <Link
                            href={dropdownItem.href} 
                            onClick={(e) => {
                              e.preventDefault();
                              handleMenuClick(dropdownItem.entity, dropdownItem.action, dropdownItem.href);
                            }}
                            key={`${dropdownItem.name}-${subIndex}`}
                            className={cn(
                              "mx-3.5 mb-0.5 flex items-center justify-between rounded-md px-3.5 py-2 font-medium capitalize last-of-type:mb-1 lg:last-of-type:mb-2 2xl:mx-5",
                              isChildActive
                                ? "text-primary"
                                : "text-gray-500 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-900"
                            )}
                          >
                            <div className="flex items-center truncate">
                              <span
                                className={cn(
                                  "me-[18px] ms-1 inline-flex h-1 w-1 rounded-full bg-current transition-all duration-200",
                                  isChildActive
                                    ? "bg-primary ring-[1px] ring-primary"
                                    : "opacity-40"
                                )}
                              />
                              <span className="truncate">{dropdownItem.name}</span>
                            </div>
                          </Link>
                        );
                      })}
                    </Collapse>
                  </>
                ) : (
                  <>
                    <Link
                      href={item?.href} 
                      onClick={(e) => {
                        e.preventDefault();
                        if (!item.href) {
                          console.warn(`Menu item "${item.name}" has undefined href`);
                          return;
                        }
                        handleMenuClick(item.entity, item.action, item.href);
                      }}
                      className={cn(
                        "group relative mx-3 my-0.5 flex items-center justify-between rounded-md px-3 py-2 font-medium capitalize lg:my-1 2xl:mx-5 2xl:my-2",
                        isActive
                          ? "before:top-2/5 text-primary before:absolute before:-start-3 before:block before:h-4/5 before:w-1 before:rounded-ee-md before:rounded-se-md before:bg-primary 2xl:before:-start-5"
                          : "text-gray-700 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-700/90"
                      )}
                    >
                      <div className="flex items-center truncate">
                        {item.icon && (
                          <span
                            className={cn(
                              "me-2 inline-flex size-5 items-center justify-center rounded-md [&>svg]:size-5",
                              isActive
                                ? "text-primary"
                                : "text-gray-800 dark:text-gray-500 dark:group-hover:text-gray-700"
                            )}
                          >
                            {item.icon}
                          </span>
                        )}
                        <span className="truncate">{item.name}</span>
                      </div>
                      {item.badge ? <StatusBadge status={item.badge} /> : null}
                    </Link>
                  </>
                )}
              </>
            ) : (
              <>
                <Title
                  as="h6"
                  className={cn(
                    "mb-2 truncate px-6 text-xs font-normal uppercase tracking-widest text-gray-500 2xl:px-8",
                    index !== 0 && "mt-6 3xl:mt-7"
                  )}
                >
                  {item.name}
                </Title>
              </>
            )}
          </Fragment>
        );
      })}
    </div>
  );
}