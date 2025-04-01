export const routes = {
  auth: {
    signIn: "/auth/sign-in",
    signUp: "/auth/sign-up",
    forgotPassword: "/auth/forgot-password",
  },
  root: {
    website: "",
    dashboard: "/",
  },
  rolesNpermissions: {
    roles: "/roles-permissions",
  },
  profileSettings: {
    myDetails:"/profile-settings",
    password:"/profile-settings/password",
  },
  products: {
    products: "/products",
    createProduct: "/products/create",
    editProduct: (slug: string) => `/products/${slug}/edit`,
    categories: "/products/categories",
    createCategory: "/products/categories/create",
    editCategory: (id: string) => `/products/categories/${id}/edit`,
  },
  orders: {
    orders: "/orders",
    orderDetails: (id: string) => `/orders/order-details?orderNumber=${id}`,
    deletedOrders: "/orders/deleted",
  },
  file: {
    manager: "/file-manager",
    upload: "/file-manager/upload",
    create: "/file-manager/create",
  },
  staticPages: {
    termsPage: "/static-pages/terms",
    privacyPolicy: "/static-pages/privacy-policy",
  },
  termsNconditions: "https://www.adaired.com/terms-and-conditions",
  privacyPolicy: "https://www.adaired.com/privacy-policy",
};
