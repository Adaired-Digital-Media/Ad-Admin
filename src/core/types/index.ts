/* eslint-disable @typescript-eslint/no-explicit-any */
export interface UserType {
  _id?: string;
  image: string | null;
  name: string;
  userName: string;
  email: string;
  password?: string;
  contact?: string;
  isAdmin?: boolean;
  role: string | null;
  cart?: string;
  refreshToken?: string;
  orderHistory?: OrderHistoryItem[];
  wishlist?: WishlistItem[];
  isVerifiedUser?: boolean;
  status?: "Active" | "Inactive";
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
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
  name?: string;
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
  _id: string;
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
  userId?: UserType;
  orderNumber?: string;
  products?: ProductType[];
  totalQuantity?: number;
  totalPrice?: number;
  discountedPrice?: number;
  couponId?: string;
  couponDiscount?: number;
  paymentId?: string;
  invoiceId?: string;
  zohoInvoiceId?: string;
  paymentUrl?: string;
  status: "Pending" | "Processing" | "Confirmed" | "Completed" | "Cancelled";
  paymentStatus: "Unpaid" | "Paid" | "Refunded" | "Failed";
  paymentMethod: "Razorpay" | "Stripe";
  paymentDate?: string;
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
