import { z } from "zod";
import { messages } from "@/config/messages";

export const couponFormSchema = z
  .object({
    _id: z.string().optional(),
    code: z
      .string()
      .min(1, { message: messages.required })
      .transform((val) => val.toUpperCase().trim()),
    couponApplicableOn: z.enum(["allProducts", "specificProducts", "productCategories"]),
    couponType: z.enum(["all", "quantityBased"]),
    discountType: z.enum(["percentage", "flat"]),
    discountValue: z
      .number()
      .min(0, { message: messages.invalidDiscountValue }),
    minOrderAmount: z
      .number()
      .min(0, { message: messages.invalidAmount })
      .optional()
      .default(0),
    maxDiscountAmount: z
      .number()
      .min(0, { message: messages.invalidAmount })
      .optional(),
    specificProducts: z.array(z.string()).optional().default([]),
    productCategories: z.array(z.string()).optional().default([]),
    minQuantity: z
      .number()
      .min(1, { message: messages.invalidQuantity })
      .optional()
      .default(1),
    maxQuantity: z
      .number()
      .min(1, { message: messages.invalidQuantity })
      .optional(),
    maxWordCount: z
      .number()
      .min(1, { message: messages.invalidWordCount })
      .optional(),
    usageLimitPerUser: z
      .number()
      .min(1, { message: messages.invalidLimit })
      .optional(),
    totalUsageLimit: z
      .number()
      .min(1, { message: messages.invalidLimit })
      .optional(),
    usedCount: z.number().optional().default(0),
    userUsage: z
      .array(
        z.object({
          userId: z.string(),
          usageCount: z.number().default(0),
        })
      )
      .optional(),
    status: z.string().optional().default("Active"),
    expiresAt: z.date().or(z.string()).optional(),
    createdBy: z.string().optional(),
    updatedBy: z.string().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
    __v: z.number().optional(),
  })
  .superRefine((data, ctx) => {
    // Additional validations
    if (data.discountType === "percentage" && data.discountValue > 100) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Percentage discount cannot be greater than 100%",
        path: ["discountValue"],
      });
    }

    if (
      data.couponApplicableOn === "specificProducts" &&
      (!data.specificProducts || data.specificProducts.length === 0)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "At least one product is required for specific products applicability",
        path: ["specificProducts"],
      });
    }

    if (
      data.couponApplicableOn === "productCategories" &&
      (!data.productCategories || data.productCategories.length === 0)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "At least one category is required for product categories applicability",
        path: ["productCategories"],
      });
    }

    if (data.couponType === "quantityBased" && data.minQuantity < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Minimum quantity must be greater than 1 for quantity-based coupons",
        path: ["minQuantity"],
      });
    }

    if (
      data.minQuantity &&
      data.maxQuantity &&
      data.minQuantity > data.maxQuantity
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Minimum quantity cannot be greater than maximum quantity",
        path: ["minQuantity"],
      });
    }

    if (data.expiresAt && new Date(data.expiresAt) < new Date()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Expiration date must be in the future",
        path: ["expiresAt"],
      });
    }
  });

export type CouponFormValues = z.infer<typeof couponFormSchema>;