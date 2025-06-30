// import { ProductType } from "@/core/types";
import { UserRef } from "./tickets.types";

// No need for the old discountType enum anymore
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
