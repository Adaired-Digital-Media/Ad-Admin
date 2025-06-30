import { routes } from "@/config/routes";

export enum PermissionEntities {
  USERS = "users",
  ROLES = "roles",
  PRODUCTS = "products",
  CUSTOM_FORMS = "custom-forms",
  ORDERS = "orders",
  COUPONS = "coupons",
  INVOICES = "invoices",
  BLOGS = "blogs",
  CASE_STUDIES = "case-studies",
  TICKETS = "tickets",
  FILES = "media",
}

export enum PermissionActions {
  CREATE = 0,
  READ = 1,
  UPDATE = 2,
  DELETE = 3,
}

export interface RoutePermission {
  entity: PermissionEntities;
  action: PermissionActions;
}

export const routePermissions: Record<string, RoutePermission> = {
  [routes.rolesNpermissions.roles]: { entity: PermissionEntities.ROLES, action: PermissionActions.READ },
  [routes.products.products]: { entity: PermissionEntities.PRODUCTS, action: PermissionActions.READ },
  [routes.products.createProduct]: { entity: PermissionEntities.PRODUCTS, action: PermissionActions.CREATE },
  [routes.products.categories]: { entity: PermissionEntities.PRODUCTS, action: PermissionActions.READ },
  [routes.products.createCategory]: { entity: PermissionEntities.PRODUCTS, action: PermissionActions.CREATE },
  [routes.customForms.all]: { entity: PermissionEntities.CUSTOM_FORMS, action: PermissionActions.READ },
  [routes.customForms.fields]: { entity: PermissionEntities.CUSTOM_FORMS, action: PermissionActions.READ },
  [routes.orders.orders]: { entity: PermissionEntities.ORDERS, action: PermissionActions.READ },
  [routes.coupons.allCoupons]: { entity: PermissionEntities.COUPONS, action: PermissionActions.READ },
  [routes.coupons.createCoupon]: { entity: PermissionEntities.COUPONS, action: PermissionActions.CREATE },
  [routes.support.support]: { entity: PermissionEntities.TICKETS, action: PermissionActions.READ },
  [routes.blog.list]: { entity: PermissionEntities.BLOGS, action: PermissionActions.READ },
  [routes.blog.create]: { entity: PermissionEntities.BLOGS, action: PermissionActions.CREATE },
  [routes.blog.edit("")]: { entity: PermissionEntities.BLOGS, action: PermissionActions.UPDATE },
  [routes.blog.categoryList]: { entity: PermissionEntities.BLOGS, action: PermissionActions.READ },
  [routes.caseStudies.list]: { entity: PermissionEntities.CASE_STUDIES, action: PermissionActions.READ },
  [routes.caseStudies.create]: { entity: PermissionEntities.CASE_STUDIES, action: PermissionActions.CREATE },
  [routes.caseStudies.categoryList]: { entity: PermissionEntities.CASE_STUDIES, action: PermissionActions.READ },
  [routes.file.manager]: { entity: PermissionEntities.FILES, action: PermissionActions.READ },
  [routes.invoice.list]: { entity: PermissionEntities.INVOICES, action: PermissionActions.READ },
};

export const publicRoutes = [
  routes.root.unauthorized,
  routes.auth.signIn,
  routes.auth.signUp,
  "/auth/forgot-password",
  "/auth/verify",
  "/auth/reset-password",
  routes.auth["access-denied"],
];