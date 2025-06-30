export const routes = {
  auth: {
    signIn: "/auth/sign-in",
    signUp: "/auth/sign-up",
    forgotPassword: "/auth/forgot-password",
    "access-denied": "/access-denied",
  },
  root: {
    website: "",
    dashboard: "/",
    unauthorized: "/unauthorized",
  },
  rolesNpermissions: {
    roles: "/roles-permissions",
  },
  profileSettings: {
    myDetails: "/profile-settings",
    password: "/profile-settings/password",
  },
  products: {
    products: "/products",
    createProduct: "/products/create",
    editProduct: (slug: string) => `/products/${slug}/edit`,
    categories: "/products/categories",
    createCategory: "/products/categories/create",
    editCategory: (id: string) => `/products/categories/${id}/edit`,
  },
  customForms: {
    all: "/custom-forms",
    create: "/custom-forms/create",
    edit: (id: string) => `/custom-forms/edit?id=${id}`,
    fields: "/custom-forms/fields",
  },
  orders: {
    orders: "/orders",
    orderDetails: (id: string) => `/orders/order-details?orderNumber=${id}`,
    deletedOrders: "/orders/deleted",
  },
  invoice : {
    list: "/invoices",
    details: (id: string) => `/invoices/details?invoiceNumber=${id}`,
    edit: (id: string) => `/invoices/edit?invoiceNumber=${id}`,
  },
  coupons: {
    allCoupons: "/coupons",
    createCoupon: "/coupons/create",
    editCoupon: (id: string) => `/coupons/edit?couponId=${id}`,
  },
  support: {
    support: "/support",
    inbox: (id: string) => `/support/inbox?tkt=${id}`,
  },
  file: {
    manager: "/media-manager",
    upload: "/media-manager/upload",
    create: "/media-manager/create",
  },
  blog: {
    list: "/blog",
    create: "/blog/create",
    edit: (id: string) => `/blog/edit?id=${id}`,
    categoryList: "/blog/categories",
  },
  caseStudies : {
    list: "/case-studies",
    create: "/case-studies/create",
    edit: (id: string) => `/case-studies/edit?id=${id}`,
    categoryList: "/case-studies/categories",
  },
  staticPages: {
    termsPage: "/static-pages/terms",
    privacyPolicy: "/static-pages/privacy-policy",
  },
  termsNconditions: "https://www.adaired.com/terms-and-conditions",
  privacyPolicy: "https://www.adaired.com/privacy-policy",
};
