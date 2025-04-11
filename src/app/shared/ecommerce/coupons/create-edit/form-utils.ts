import { CouponTypes } from "@/data/coupons.types";
import { CouponFormValues } from "@/validators/create-coupon.schema";

export function couponDefaultValues(coupon?: CouponTypes): CouponFormValues {
  return {
    _id: coupon?._id,
    code: coupon?.code || "",
    status: coupon?.status || "Active",
    expiresAt: coupon?.expiresAt ? new Date(coupon.expiresAt).toISOString().slice(0, 16) : undefined,
    discountType: coupon?.discountType || "percentage",
    discountValue: coupon?.discountValue || 0,
    minOrderAmount: coupon?.minOrderAmount || 0,
    maxDiscountAmount: coupon?.maxDiscountAmount || undefined,
    couponApplicableOn: coupon?.couponApplicableOn || "allProducts",
    specificProducts: coupon?.specificProducts || [],
    productCategories: coupon?.productCategories || [],
    couponType: coupon?.couponType || "all",
    minQuantity: coupon?.minQuantity || 1,
    maxQuantity: coupon?.maxQuantity || undefined,
    maxWordCount: coupon?.maxWordCount || undefined,
    usageLimitPerUser: coupon?.usageLimitPerUser || undefined,
    totalUsageLimit: coupon?.totalUsageLimit || undefined,
    usedCount: coupon?.usedCount || 0, 
    userUsage: coupon?.userUsage || [],
  };
}