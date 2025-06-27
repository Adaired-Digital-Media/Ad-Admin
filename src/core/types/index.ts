/* eslint-disable @typescript-eslint/no-explicit-any */

import { RoleTypes } from "../../data/roles-permissions";
export interface UserTypes {
  _id?: string;
  image?: string | null;
  name: string;
  userName?: string;
  email: string;
  password?: string | null;
  contact?: string | null;
  isAdmin?: boolean;
  role: string | RoleTypes;
  googleId?: string;
  orderHistory?: OrderHistoryItem[];
  cart?: string;
  wishlist?: WishlistItem[];
  status?: string;
  isVerifiedUser?: boolean;
  refreshToken?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface OrderHistoryItem {
  orderId: string;
  date?: string | Date;
}

export interface WishlistItem {
  productId: string;
  dateAdded?: string | Date;
}

export interface ProductCategoryType {
  _id?: string;
  name: string;
  description?: string;
  parentCategory?: string | null;
  children?: string[];
  products?: string[];
  slug?: string;
  image?: string;
  metaTitle?: string;
  metaDescription?: string;
  canonicalLink?: string;
  status?: "Active" | "Inactive";
  createdBy?: string;
  updatedBy?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
}

export type ProductType = {
  _id?: string;
  featuredImage: string;
  name: string;
  description: string;
  category: ProductCategoryType;
  subCategory: any;
  minimumQuantity?: number;
  minimumWords?: number;
  slug: string;
  pricePerUnit: number;
  pricingType: string;
  stock: number;
  images: string[];
  tags?: string[];
  priority?: number;
  keywords?: string[];
  formId?: string;
  metaTitle?: string;
  metaDescription?: string;
  canonicalLink?: string;
  status: string;
  isFreeProduct: boolean;
  createBy?: string;
  updateBy?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export interface OrderType {
  _id?: string;
  userId?: UserTypes;
  orderNumber?: string;
  products: ProductType[];
  totalQuantity: number;
  totalPrice: number;
  couponDiscount: number;
  finalPrice: number;
  couponId?: string | null;
  paymentId: string;
  invoiceId: string;
  zohoInvoiceId: string;
  paymentUrl: string;
  status: "Pending" | "Processing" | "Confirmed" | "Cancelled" | "Completed";
  paymentStatus: "Unpaid" | "Paid" | "Refunded" | "Failed";
  paymentMethod: "Razorpay" | "Stripe";
  paymentDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
}

export interface OrderItemType {
  _id: string;
  wordCount: number;
  quantity: number;
  totalPrice: number;
  additionalInfo: string;
  product: ProductType;
  addedAt: Date;
}

interface newOrders {
  day: string;
  orders: number;
}
interface totalSales {
  day: string;
  sales: number;
}
interface totalSales {
  day: string;
  revenue: number;
}

export interface OrderStats {
  newOrders: { count: number; percentageChange: number; trend: string };
  sales: { total: number; percentageChange: number; trend: string };
  revenue: { total: number; percentageChange: number; trend: string };
  allOrders: number;
  paidOrders: number;
  dailyOrders: number;
  completedOrders: number;
  chartData: {
    newOrders: newOrders[];
    sales: totalSales[];
    revenue: totalSales[];
  };
}

export interface SalesReport {
  month: string;
  sales: number;
  revenue: number;
}

export interface SalesReportProps {
  className?: string;
  salesReport: SalesReport[];
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  accessToken: string;
  setSalesReport: any;
}

export interface InvoiceTypes {
  _id: string;
  invoiceNumber: string;
  orderId: OrderType;
  userId?: UserTypes;
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  status: "Unpaid" | "Paid" | "Overdue" | "Cancelled";
  dueDate: Date;
  issuedDate: Date;
  paymentMethod: "Razorpay" | "Stripe" | "Manual";
  paymentId: string | null;
  zohoInvoiceId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface InvoiceStats {
  newInvoices: {
    count: number;
    percentageChange: number;
    trend: "increased" | "decreased" | "unchanged";
  };
  totalAmount: {
    total: number;
    percentageChange: number;
    trend: "increased" | "decreased" | "unchanged";
  };
  finalAmount: {
    total: number;
    percentageChange: number;
    trend: "increased" | "decreased" | "unchanged";
  };
  allInvoices: number;
  paidInvoices: number;
  overdueInvoices: number;
  dailyInvoices: number;
  chartData: {
    newInvoices: { day: string; invoices: number; date: string }[];
    totalAmount: { day: string; total: number; date: string }[];
    finalAmount: { day: string; final: number; date: string }[];
  };
}

// ************** Blog Types **************

export type BlogCategoryType = {
  _id: string;
  parentCategory: BlogCategoryType | null;
  subCategories: string[];
  image: string;
  name: string;
  slug: string;
  status: string;
  blogs: string[];
  createdBy?: string | null;
  updatedBy?: string | null;
};

export interface BlogTypes extends Document {
  _id: string;
  category?: BlogCategoryType | string | null;
  featuredImage: string;
  postTitle: string;
  postDescription: string;
  slug: string | null;
  tags: string[];
  seo: SEO;
  blogAuthor?: UserTypes | string | null;
  updatedBy?: UserTypes | string | null;
  status: "publish" | "draft";
  createdAt?: Date;
  updatedAt?: Date;
}

// ************** Case Study Types **************

export type CaseStudyCategoryType = {
  _id: string;
  parentCategory: CaseStudyCategoryType | null;
  subCategories: string[];
  image: string;
  name: string;
  slug: string;
  status: "active" | "inactive";
  caseStudies: string[];
  createdBy?: string | null;
  updatedBy?: string | null;
};

export type CaseStudyType = {
  _id: string;
  category?: string | null | CaseStudyCategoryType;
  name: string;
  slug?: string | null;
  colorScheme: string;
  status: "active" | "inactive";
  bodyData?: unknown[];
  seo: SEO;
  createdBy?: string | null;
  updatedBy?: string | null;
};

// ************** SEO Schema Types Starts **************

export interface OpenGraph {
  title?: string;
  description?: string;
  image?: string | null;
  type?: string;
  url?: string;
  siteName?: string;
}

export interface TwitterCard {
  cardType?: string;
  site?: string;
  creator?: string;
  title?: string;
  description?: string;
  image?: string | null;
}

export interface Redirect {
  type?: "301" | "302" | null;
  url?: string | null;
}

export interface SEO {
  metaTitle: string;
  metaDescription: string;
  canonicalLink: string;
  focusKeyword: string;
  keywords?: string[];
  openGraph?: OpenGraph;
  twitterCard?: TwitterCard;
  robotsText: string;
  schemaOrg?: string | null;
  bodyScript?: string | null;
  headerScript?: string | null;
  footerScript?: string | null;
  priority?: number;
  changeFrequency?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  lastModified?: Date;
  redirect?: Redirect;
}

// ************** SEO Schema Types Ends **************

// ************** Cloudinary File Types **************
export interface CloudinaryFile {
  asset_id: string;
  public_id: string;
  folder: string;
  filename: string;
  format: string;
  version: number;
  resource_type: string;
  type: string;
  created_at: string;
  uploaded_at: string;
  bytes: number;
  backup_bytes: number;
  width: number;
  height: number;
  aspect_ratio: number;
  pixels: number;
  context?: {
    alt?: string;
    caption?: string;
  };
  url: string;
  secure_url: string;
  status: string;
  access_mode: string;
  access_control: any | null;
  etag: string;
  created_by: {
    access_key: string;
  };
  uploaded_by: {
    access_key: string;
  };
  last_updated: {
    context_updated_at: string;
    updated_at: string;
  };
}
