// // import { auth } from "@/auth";
// import { routes } from "@/config/routes";
// // import AffiliateIcon from "@core/components/icons/affiliate";
// // import CrmDashIcon from "@core/components/icons/crm-icon";
// // import ProjectWriteIcon from "@core/components/icons/project-write";
// import {
//   PiCurrencyCircleDollarDuotone,
//   PiFolderLockDuotone,
//   PiImageDuotone,
//   PiHeadsetDuotone,
//   PiPackageDuotone,
//   PiTicketDuotone,
// } from "react-icons/pi";
// import { MdOutlineDashboard } from "react-icons/md";
// import ProjectWriteIcon from "@/core/components/icons/project-write";
// // Note: do not add href in the label object, it is rendering as label

// export const menuItems = [
//   // label start
//   {
//     name: "Home",
//   },
//   // label end
//   {
//     name: "Dashboard",
//     href: "/",
//     icon: <MdOutlineDashboard />,
//   },
//   // label start
//   {
//     name: "Users & Roles",
//   },
//   // label end
//   {
//     name: "Roles & Permissions",
//     href: routes.rolesNpermissions.roles,
//     icon: <PiFolderLockDuotone />,
//   },

//   // label start
//   {
//     name: "E-Commerce",
//   },
//   // label end
//   {
//     name: "Products",
//     href: "#",
//     icon: <PiPackageDuotone />,
//     dropdownItems: [
//       {
//         name: "Products",
//         href: routes?.products?.products,
//       },
//       {
//         name: "Create Product",
//         href: routes?.products?.createProduct,
//       },
//       {
//         name: "Categories",
//         href: routes?.products?.categories,
//       },
//       {
//         name: "Create Categories",
//         href: routes?.products?.createCategory,
//       },
//     ],
//   },
//   {
//     name: "Custom Forms",
//     href: "#",
//     icon: <ProjectWriteIcon />,
//     dropdownItems: [
//       {
//         name: "All Forms",
//         href: routes?.customForms?.all,
//       },
//       {
//         name: "Form Fields",
//         href: routes?.customForms?.fields,
//       },
//       // {
//       //   name: "Create Form",
//       //   href: routes?.customForms?.create,
//       // },
//     ],
//   },

//   {
//     name: "Orders",
//     href: "#",
//     icon: <PiCurrencyCircleDollarDuotone />,
//     dropdownItems: [
//       {
//         name: "All Orders",
//         href: routes?.orders?.orders,
//       },
//     ],
//   },
//   {
//     name: "Coupons",
//     href: "#",
//     icon: <PiTicketDuotone />,
//     dropdownItems: [
//       {
//         name: "All Coupons",
//         href: routes?.coupons?.allCoupons,
//       },
//       {
//         name: "Create Coupon",
//         href: routes?.coupons?.createCoupon,
//       },
//     ],
//   },

//   // label start
//   {
//     name: "Help Center",
//   },
//   // label end
//   {
//     name: "Support",
//     href: routes?.support?.support,
//     icon: <PiHeadsetDuotone />,
//     badge: "",
//   },

//   // label start
//   {
//     name: "Application",
//   },
//   // label end
//   {
//     name: "Media Manager",
//     href: routes?.file?.manager,
//     icon: <PiImageDuotone />,
//   },
// ];




// import { routes } from "@/config/routes";
// import {
//   PiCurrencyCircleDollarDuotone,
//   PiFolderLockDuotone,
//   PiImageDuotone,
//   PiHeadsetDuotone,
//   PiPackageDuotone,
//   PiTicketDuotone,
// } from "react-icons/pi";
// import { MdOutlineDashboard } from "react-icons/md";
// import ProjectWriteIcon from "@/core/components/icons/project-write";

// // Note: do not add href in the label object, it is rendering as label
// export const menuItems = [
//   // Label start
//   {
//     name: "Home",
//   },
//   // Label end
//   {
//     name: "Dashboard",
//     href: "/",
//     icon: <MdOutlineDashboard />,
//     // No entity or action to skip permission check
//   },
//   // Label start
//   {
//     name: "Users & Roles",
//   },
//   // Label end
//   {
//     name: "Roles & Permissions",
//     href: routes.rolesNpermissions.roles,
//     icon: <PiFolderLockDuotone />,
//     entity: "roles",
//     action: "READ",
//   },
//   // Label start
//   {
//     name: "E-Commerce",
//   },
//   // Label end
//   {
//     name: "Products",
//     href: "#",
//     icon: <PiPackageDuotone />,
//     dropdownItems: [
//       {
//         name: "Products",
//         href: routes?.products?.products,
//         entity: "products",
//         action: "READ",
//       },
//       {
//         name: "Create Product",
//         href: routes?.products?.createProduct,
//         entity: "products",
//         action: "CREATE",
//       },
//       {
//         name: "Categories",
//         href: routes?.products?.categories,
//         entity: "products",
//         action: "READ",
//       },
//       {
//         name: "Create Categories",
//         href: routes?.products?.createCategory,
//         entity: "products",
//         action: "CREATE",
//       },
//     ],
//   },
//   {
//     name: "Custom Forms",
//     href: "#",
//     icon: <ProjectWriteIcon />,
//     dropdownItems: [
//       {
//         name: "All Forms",
//         href: routes?.customForms?.all,
//         entity: "customForms",
//         action: "READ",
//       },
//       {
//         name: "Form Fields",
//         href: routes?.customForms?.fields,
//         entity: "customForms",
//         action: "READ",
//       },
//     ],
//   },
//   {
//     name: "Orders",
//     href: "#",
//     icon: <PiCurrencyCircleDollarDuotone />,
//     dropdownItems: [
//       {
//         name: "All Orders",
//         href: routes?.orders?.orders,
//         entity: "orders",
//         action: "READ",
//       },
//     ],
//   },
//   {
//     name: "Coupons",
//     href: "#",
//     icon: <PiTicketDuotone />,
//     dropdownItems: [
//       {
//         name: "All Coupons",
//         href: routes?.coupons?.allCoupons,
//         entity: "coupons",
//         action: "READ",
//       },
//       {
//         name: "Create Coupon",
//         href: routes?.coupons?.createCoupon,
//         entity: "coupons",
//         action: "CREATE",
//       },
//     ],
//   },
//   // Label start
//   {
//     name: "Help Center",
//   },
//   // Label end
//   {
//     name: "Support",
//     href: routes?.support?.support,
//     icon: <PiHeadsetDuotone />,
//     badge: "",
//     entity: "tickets",
//     action: "READ",
//   },
//   // Label start
//   {
//     name: "Application",
//   },
//   // Label end
//   {
//     name: "Media Manager",
//     href: routes?.file?.manager,
//     icon: <PiImageDuotone />,
//     entity: "file",
//     action: "READ",
//   },
// ];





// import { routes } from "@/config/routes";
// import {
//   PiCurrencyCircleDollarDuotone,
//   PiFolderLockDuotone,
//   PiImageDuotone,
//   PiHeadsetDuotone,
//   PiPackageDuotone,
//   PiTicketDuotone,
// } from "react-icons/pi";
// import { MdOutlineDashboard } from "react-icons/md";
// import ProjectWriteIcon from "@/core/components/icons/project-write";

// // Note: do not add href in the label object, it is rendering as label
// export const menuItems = [
//   // Label start
//   {
//     name: "Home",
//   },
//   // Label end
//   {
//     name: "Dashboard",
//     href: "/",
//     icon: <MdOutlineDashboard />,
//     // No entity or action to skip permission check
//   },
//   // Label start
//   {
//     name: "Users & Roles",
//   },
//   // Label end
//   {
//     name: "Roles & Permissions",
//     href: routes.rolesNpermissions.roles,
//     icon: <PiFolderLockDuotone />,
//     entity: "roles",
//     action: "READ",
//   },
//   // Label start
//   {
//     name: "E-Commerce",
//   },
//   // Label end
//   {
//     name: "Products",
//     href: "#",
//     icon: <PiPackageDuotone />,
//     dropdownItems: [
//       {
//         name: "Products",
//         href: routes?.products?.products,
//         entity: "products",
//         action: "READ",
//       },
//       {
//         name: "Create Product",
//         href: routes?.products?.createProduct,
//         entity: "products",
//         action: "CREATE",
//       },
//       {
//         name: "Categories",
//         href: routes?.products?.categories,
//         entity: "products",
//         action: "READ",
//       },
//       {
//         name: "Create Categories",
//         href: routes?.products?.createCategory,
//         entity: "products",
//         action: "CREATE",
//       },
//     ],
//   },
//   {
//     name: "Custom Forms",
//     href: "#",
//     icon: <ProjectWriteIcon />,
//     dropdownItems: [
//       {
//         name: "All Forms",
//         href: routes?.customForms?.all,
//         entity: "customForms",
//         action: "READ",
//       },
//       {
//         name: "Form Fields",
//         href: routes?.customForms?.fields,
//         entity: "customForms",
//         action: "READ",
//       },
//     ],
//   },
//   {
//     name: "Orders",
//     href: "#",
//     icon: <PiCurrencyCircleDollarDuotone />,
//     dropdownItems: [
//       {
//         name: "All Orders",
//         href: routes?.orders?.orders,
//         entity: "orders",
//         action: "READ",
//       },
//     ],
//   },
//   {
//     name: "Coupons",
//     href: "#",
//     icon: <PiTicketDuotone />,
//     dropdownItems: [
//       {
//         name: "All Coupons",
//         href: routes?.coupons?.allCoupons,
//         entity: "coupons",
//         action: "READ",
//       },
//       {
//         name: "Create Coupon",
//         href: routes?.coupons?.createCoupon,
//         entity: "coupons",
//         action: "CREATE",
//       },
//     ],
//   },
//   // Label start
//   {
//     name: "Help Center",
//   },
//   // Label end
//   {
//     name: "Support",
//     href: routes?.support?.support,
//     icon: <PiHeadsetDuotone />,
//     badge: "",
//     entity: "tickets",
//     action: "READ",
//   },
//   // Label start
//   {
//     name: "Application",
//   },
//   // Label end
//   {
//     name: "Media Manager",
//     href: routes?.file?.manager,
//     icon: <PiImageDuotone />,

//   },
// ];





import { routes } from "@/config/routes";
import {
  PiCurrencyCircleDollarDuotone,
  PiFolderLockDuotone,
  PiImageDuotone,
  PiHeadsetDuotone,
  PiPackageDuotone,
  PiTicketDuotone,
} from "react-icons/pi";
import { MdOutlineDashboard } from "react-icons/md";
import ProjectWriteIcon from "@/core/components/icons/project-write";

// Note: do not add href in the label object, it is rendering as label
export const menuItems = [
  // Label start
  {
    name: "Home",
  },
  // Label end
  {
    name: "Dashboard",
    href: "/",
    icon: <MdOutlineDashboard />,
    // No entity or action to skip permission check
  },
  // Label start
  {
    name: "Users & Roles",
  },
  // Label end
  {
    name: "Roles & Permissions",
    href: routes.rolesNpermissions.roles,
    icon: <PiFolderLockDuotone />,
    entity: "roles",
    action: "READ",
  },
  // Label start
  {
    name: "E-Commerce",
  },
  // Label end
  {
    name: "Products",
    href: "#",
    icon: <PiPackageDuotone />,
    dropdownItems: [
      {
        name: "Products",
        href: routes?.products?.products,
        entity: "products",
        action: "READ",
      },
      {
        name: "Create Product",
        href: routes?.products?.createProduct,
        entity: "products",
        action: "CREATE",
      },
      {
        name: "Categories",
        href: routes?.products?.categories,
        entity: "products",
        action: "READ",
      },
      {
        name: "Create Categories",
        href: routes?.products?.createCategory,
        entity: "products",
        action: "CREATE",
      },
    ],
  },
  {
    name: "Custom Forms",
    href: "#",
    icon: <ProjectWriteIcon />,
    dropdownItems: [
      {
        name: "All Forms",
        href: routes?.customForms?.all,
        entity: "customForms",
        action: "READ",
      },
      {
        name: "Form Fields",
        href: routes?.customForms?.fields,
        entity: "customForms",
        action: "READ",
      },
    ],
  },
  {
    name: "Orders",
    href: "#",
    icon: <PiCurrencyCircleDollarDuotone />,
    dropdownItems: [
      {
        name: "All Orders",
        href: routes?.orders?.orders,
        entity: "orders",
        action: "READ",
      },
    ],
  },
  {
    name: "Coupons",
    href: "#",
    icon: <PiTicketDuotone />,
    dropdownItems: [
      {
        name: "All Coupons",
        href: routes?.coupons?.allCoupons,
        entity: "coupons",
        action: "READ",
      },
      {
        name: "Create Coupon",
        href: routes?.coupons?.createCoupon,
        entity: "coupons",
        action: "CREATE",
      },
    ],
  },
  // Label start
  {
    name: "Help Center",
  },
  // Label end
  {
    name: "Support",
    href: routes?.support?.support,
    icon: <PiHeadsetDuotone />,
    badge: "",
    // entity: "tickets",
    // action: "READ",
  },
  // Label start
  {
    name: "Application",
  },
  // Label end
  {
    name: "Media Manager",
    href: routes?.file?.manager,
    icon: <PiImageDuotone />,
    entity: "file",
    action: "READ",
  },
];
