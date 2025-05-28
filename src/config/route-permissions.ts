import { routes } from "@/config/routes";

// Map routes to their required entity and action
export const routePermissions: {
  [key: string]: { entity: string; action: string };
} = {
  [routes.rolesNpermissions.roles]: { entity: "roles", action: "READ" },
  [routes.products.products]: { entity: "products", action: "READ" },
  [routes.products.createProduct]: { entity: "products", action: "CREATE" },
  [routes.products.categories]: { entity: "products", action: "READ" },
  [routes.products.createCategory]: { entity: "products", action: "CREATE" },
  [routes.customForms.all]: { entity: "customForms", action: "READ" },
  [routes.customForms.fields]: { entity: "customForms", action: "READ" },
  [routes.orders.orders]: { entity: "orders", action: "READ" },
  [routes.coupons.allCoupons]: { entity: "coupons", action: "READ" },
  [routes.coupons.createCoupon]: { entity: "coupons", action: "CREATE" },
  [routes.support.support]: { entity: "tickets", action: "READ" },

  // Blog
  [routes.blog.list]: { entity: "blog", action: "READ" },
  [routes.blog.create]: { entity: "blog", action: "CREATE" },
  [routes.blog.edit("")]: { entity: "blog", action: "UPDATE" },
};

// Routes that don't require permission checks
export const publicRoutes = [
  // routes.root.dashboard,
  routes.root.unauthorized,
  routes.auth.signIn,
  routes.auth.signUp,
  "/auth/forgot-password",
  "/auth/verify",
  "/auth/reset-password",
  routes.auth["access-denied"],
];
