import { routes } from "@/config/routes";
import {
  PiCurrencyCircleDollarDuotone,
  PiFolderLockDuotone,
  PiImageDuotone,
  PiHeadsetDuotone,
  PiPackageDuotone,
  PiTicketDuotone,
  PiCurrencyDollarDuotone,
} from "react-icons/pi";
import { MdOutlineDashboard } from "react-icons/md";
import ProjectWriteIcon from "@/core/components/icons/project-write";
import { TbBrandBlogger } from "react-icons/tb";
import { FiFileText } from "react-icons/fi";
import { PermissionEntities, PermissionActions } from "@/config/permissions.config";

export interface DropdownItem {
  name: string;
  href: string;
  entity?: PermissionEntities;
  action?: PermissionActions;
}

export interface MenuItem {
  name: string;
  href?: string;
  icon?: JSX.Element;
  badge?: string;
  entity?: PermissionEntities;
  action?: PermissionActions;
  dropdownItems?: DropdownItem[];
}

export const menuItems: MenuItem[] = [
  { name: "Home" },
  {
    name: "Dashboard",
    href: "/",
    icon: <MdOutlineDashboard />,
  },
  { name: "Users & Roles" },
  {
    name: "Roles & Permissions",
    href: routes.rolesNpermissions.roles,
    icon: <PiFolderLockDuotone />,
    entity: PermissionEntities.ROLES,
    action: PermissionActions.READ,
  },
  { name: "E-Commerce" },
  {
    name: "Products",
    href: "#",
    icon: <PiPackageDuotone />,
    dropdownItems: [
      {
        name: "Products",
        href: routes.products.products,
        entity: PermissionEntities.PRODUCTS,
        action: PermissionActions.READ,
      },
      {
        name: "Create Product",
        href: routes.products.createProduct,
        entity: PermissionEntities.PRODUCTS,
        action: PermissionActions.CREATE,
      },
      {
        name: "Categories",
        href: routes.products.categories,
        entity: PermissionEntities.PRODUCTS,
        action: PermissionActions.READ,
      },
      {
        name: "Create Categories",
        href: routes.products.createCategory,
        entity: PermissionEntities.PRODUCTS,
        action: PermissionActions.CREATE,
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
        href: routes.customForms.all,
        entity: PermissionEntities.CUSTOM_FORMS,
        action: PermissionActions.READ,
      },
      {
        name: "Form Fields",
        href: routes.customForms.fields,
        entity: PermissionEntities.CUSTOM_FORMS,
        action: PermissionActions.READ,
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
        href: routes.orders.orders,
        entity: PermissionEntities.ORDERS,
        action: PermissionActions.READ,
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
        href: routes.coupons.allCoupons,
        entity: PermissionEntities.COUPONS,
        action: PermissionActions.READ,
      },
      {
        name: "Create Coupon",
        href: routes.coupons.createCoupon,
        entity: PermissionEntities.COUPONS,
        action: PermissionActions.CREATE,
      },
    ],
  },
  {
    name: "Invoices",
    href: routes.invoice.list,
    icon: <PiCurrencyDollarDuotone />,
    badge: "",
    entity: PermissionEntities.INVOICES,
    action: PermissionActions.READ,
  },
  { name: "Pages" },
  {
    name: "Blog",
    href: "#",
    icon: <TbBrandBlogger />,
    dropdownItems: [
      {
        name: "Blog List",
        href: routes.blog.list,
        entity: PermissionEntities.BLOGS,
        action: PermissionActions.READ,
      },
      {
        name: "Add Blog",
        href: routes.blog.create,
        entity: PermissionEntities.BLOGS,
        action: PermissionActions.CREATE,
      },
      {
        name: "Categories",
        href: routes.blog.categoryList,
        entity: PermissionEntities.BLOGS,
        action: PermissionActions.READ,
      },
    ],
  },
  {
    name: "Case Studies",
    href: "#",
    icon: <FiFileText />,
    dropdownItems: [
      {
        name: "Case Studies",
        href: routes.caseStudies.list,
        entity: PermissionEntities.CASE_STUDIES,
        action: PermissionActions.READ,
      },
      {
        name: "Add Case Study",
        href: routes.caseStudies.create,
        entity: PermissionEntities.CASE_STUDIES,
        action: PermissionActions.CREATE,
      },
      {
        name: "Categories",
        href: routes.caseStudies.categoryList,
        entity: PermissionEntities.CASE_STUDIES,
        action: PermissionActions.READ,
      },
    ],
  },
  { name: "Help Center" },
  {
    name: "Support",
    href: routes.support.support,
    icon: <PiHeadsetDuotone />,
    badge: "",
    entity: PermissionEntities.TICKETS,
    action: PermissionActions.READ,
  },
  { name: "Application" },
  {
    name: "Media Manager",
    href: routes.file.manager,
    icon: <PiImageDuotone />,
    entity: PermissionEntities.FILES,
    action: PermissionActions.READ,
  },
];
