import { CouponTypes } from "@/data/coupons.types";
import { CouponFormValues } from "@/validators/create-coupon.schema";

export function couponDefaultValues(coupon?: CouponTypes): CouponFormValues {
  return {
    _id: coupon?._id,
    code: coupon?.code || "",
    status: coupon?.status || "Active",
    expiresAt: coupon?.expiresAt ? new Date(coupon.expiresAt) : null,
    discountType: coupon?.discountType || "percentage",
    discountValue: coupon?.discountValue || 1,
    minOrderAmount: coupon?.minOrderAmount || 1,
    maxDiscountAmount: coupon?.maxDiscountAmount || Infinity,
    couponApplicableOn: coupon?.couponApplicableOn || "allProducts",
    specificProducts: coupon?.specificProducts || [],
    productCategories: coupon?.productCategories || [],
    couponType: coupon?.couponType || "amountBased",
    minQuantity: coupon?.minQuantity || 1,
    maxQuantity: coupon?.maxQuantity || undefined,
    maxWordCount: coupon?.maxWordCount || undefined,
    usageLimitPerUser: coupon?.usageLimitPerUser || Infinity,
    totalUsageLimit: coupon?.totalUsageLimit || Infinity,
    usedCount: coupon?.usedCount || 0, 
    userUsage: coupon?.userUsage || [],
  };
}