/* eslint-disable @typescript-eslint/no-explicit-any */
import { TableMeta } from "@tanstack/react-table";

// Define custom meta interface
export interface CustomTableMeta<T> extends TableMeta<T> {
  handleDeleteRow?: (row: T) => void;
  handleMultipleDelete?: (rows: T[]) => void;
  handleEditRow?: (row: T) => void;
}

export interface CloudinaryFileMeta extends TableMeta<CloudinaryFile> {
  handleDeleteRow: (row: { public_id: string }) => void;
  handleCopyLink: (row: { secure_url: string }) => void;
  handleMultipleDelete: (rows: CloudinaryFile[]) => void;
  handleEditFile: (row: CloudinaryFile) => void;
}

// **************************** Users, Roles, and Permissions Types ****************************
export interface UserTypes {
  _id: string;
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

export interface WishlistItem {
  productId: string;
  dateAdded: Date;
}

export interface RoleTypes {
  _id?: string;
  name: string;
  description: string;
  status: boolean;
  permissions: PermissionTypes[];
  users: UserTypes[];
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface PermissionTypes {
  module: string;
  permissions: number[];
}

export interface PermissionModule {
  _id?: string;
  name: string;
  value: string;
  status: boolean;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}
export const PERMISSIONS = {
  Create: 0,
  Read: 1,
  Update: 2,
  Delete: 3,
};

export const roleActions = [
  {
    id: 1,
    name: "Add User",
  },
  {
    id: 2,
    name: "Rename",
  },
  {
    id: 3,
    name: "Remove Role",
  },
];

export interface OrderHistoryItem {
  orderId: string;
  date?: string | Date;
}


// **************************** Product Types ****************************
export interface ProductCategoryType {
  _id: string;
  parentCategory: ProductCategoryType | null;
  subCategories: string[];
  image: string;
  name: string;
  slug: string;
  status: string;
  products: string[];
  createdBy?: string | null;
  updatedBy?: string | null;
}

export type ProductType = {
  _id?: string;
  featuredImage: string;
  name: string;
  description: string;
  category: string | ProductCategoryType;
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
  status: "active" | "inactive" | "archived" | "out of stock";
  isFreeProduct: boolean;
  createBy?: string;
  updateBy?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

// **************************** Order Types ****************************
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

// **************************** Invoice Types ****************************
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

// **************************** Blog Types ****************************

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
  status: "publish" | "draft" | "scheduled";
  scheduledPublishDate?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

// **************************** Case Study Types ****************************

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

// **************************** SEO Schema Types ****************************

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

// **************************** Cloudinary File Types ****************************
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


// **************************** Custom Form Types ****************************
export type FormType = {
  _id: string;
  productType: string;
  title: string;
  fields: Array<{
    field: {
      _id: string;
      name: string;
      label: string;
      inputType: string;
      inputValidationPattern?: string;
      inputRequired: boolean;
    };
    fieldOrder: number;
  }>;
  status: "active" | "inactive";
  createdBy: string;
  updatedBy: string | null;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};

export type FieldType = {
  _id: string;
  name: string;
  label: string;
  inputType:
    | "number"
    | "email"
    | "url"
    | "date"
    | "time"
    | "tel"
    | "search"
    | "month"
    | "week"
    | "datetime-local"
    | "text"
    | "checkbox"
    | "textarea"
    | undefined;
  inputMinLength?: number | null;
  inputMaxLength?: number | null;
  inputPlaceholder?: string | null;
  inputValidationPattern?: string | null;
  inputRequired: boolean;
  customClassName?: string | null;
  multipleOptions?: Array<{
    value: string;
    name: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};

export type FieldOption = {
  _id: string;
  name: string;
  label: string;
  inputType: string;
  inputValidationPattern?: "email" | "url" | null;
  inputRequired: boolean;
};

// **************************** Coupon Types ****************************
export interface CouponTypes {
  _id?: string;
  code: string;
  couponApplicableOn: "allProducts" | "specificProducts" | "productCategories";
  couponType: "amountBased" | "quantityBased";
  discountType: "percentage" | "flat";
  discountValue: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  specificProducts?: string[];
  productCategories?: string[];
  minQuantity?: number;
  maxQuantity?: number | null;
  maxWordCount?: number | null;
  usageLimitPerUser?: number;
  totalUsageLimit?: number;
  usedCount?: number;
  userUsage?: {
    userId: string;
    usageCount: number;
  }[];
  status: string;
  expiresAt?: Date | string | null;
  createdBy?: string | UserRef;
  updatedBy?: string | UserRef | null;
  createdAt?: Date | string;
  updatedAt?: Date | string | null;
}

// **************************** Ticket Types ****************************
export interface UserRef {
  _id: string;
  name: string;
  email: string;
  image?: string;
}

export interface TicketAttachment {
  url: string;
  publicId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadedAt: Date;
}

export interface TicketMessage {
  _id: string;
  sender: UserRef;
  message: string;
  attachments: TicketAttachment[];
  readBy?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export enum TicketStatus {
  OPEN = "open",
  IN_PROGRESS = "in progress",
  RESOLVED = "resolved",
  CLOSED = "closed",
  REOPENED = "reopened",
}

export enum TicketPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  URGENT = "urgent",
}

export interface TicketMetadata {
  createdBy: "customer" | "support" | "admin";
  createdForCustomer: boolean;
  supportCreatedAsCustomer?: boolean;
}

export interface Ticket {
  _id: string;
  ticketId: string;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdBy: UserRef;
  assignedTo: string | UserRef;
  customer: UserRef;
  participants?: string[];
  messages: TicketMessage[];
  metadata: TicketMetadata;
  createdAt: Date;
  updatedAt: Date;
  closedAt?: Date;
  closedBy?: UserRef;
}

export const chatType = {
  Chat: "Chat",
  Email: "Email",
} as const;

export interface TicketStatsResponse {
  role: "admin" | "support" | "customer";
  stats: {
    total: number;
    open: number;
    closed: number;
    resolved?: number;
    assignedToMe?: number;
    efficiency?: number;
    reopened?: number;
  };
}

export interface SupportStats {
  totalAssignedToMe: number;
  pendingTickets: number;
  deliveredTickets: number;
  myEfficiency: number;
}
