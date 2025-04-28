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
