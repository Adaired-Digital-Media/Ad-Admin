// import { ProductType } from "@/core/types";
import { UserRef } from "./tickets.types";

// No need for the old discountType enum anymore
export interface CouponTypes {
  _id?: string;
  code: string;
  couponApplicableOn: "allProducts" | "specificProducts" | "productCategories";
  couponType: "all" | "quantityBased";
  discountType: "percentage" | "flat";
  discountValue: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  specificProducts?: string[];
  productCategories?: string[];
  minQuantity?: number;
  maxQuantity?: number;
  maxWordCount?: number;
  usageLimitPerUser?: number;
  totalUsageLimit?: number;
  usedCount?: number;
  userUsage?: {
    userId: string;
    usageCount: number;
  }[];
  status?: string;
  expiresAt?: Date | string;
  createdBy?: string | UserRef;
  updatedBy?: string | UserRef;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}
