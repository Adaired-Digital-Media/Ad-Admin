import { z } from "zod";
import { messages } from "@/config/messages";

export const couponFormSchema = z
  .object({
    _id: z.string().optional(),
    code: z
      .string()
      .min(1, { message: messages.required })
      .transform((val) => val.toUpperCase().trim()),

    couponApplicableOn: z.enum(
      ["allProducts", "specificProducts", "productCategories"],
      {
        errorMap: () => ({ message: "Please select where the coupon applies" }),
      }
    ),

    couponType: z.enum(["amountBased", "quantityBased"], {
      errorMap: () => ({ message: "Please select the coupon type" }),
    }),

    discountType: z.enum(["percentage", "flat"], {
      errorMap: () => ({ message: "Please select the discount type" }),
    }),

    discountValue: z.coerce
      .number()
      .min(0, { message: messages.invalidDiscountValue }),

    minOrderAmount: z.coerce
      .number()
      .min(1, { message: "Minimum order amount must be at least 1" })
      .default(1),

    maxDiscountAmount: z.coerce
      .number({ invalid_type_error: "Enter a valid number" })
      .default(Infinity),

    specificProducts: z.array(z.string()).default([]),
    productCategories: z.array(z.string()).default([]),

    minQuantity: z.coerce
      .number()
      .min(1, { message: "Minimum quantity must be at least 1" })
      .default(1),
    maxQuantity: z.coerce
      .number({ invalid_type_error: "Enter a valid number" })
      .nullable()
      .optional(),

    maxWordCount: z.coerce
      .number({ invalid_type_error: "Enter a valid number" })
      .nullable()
      .optional(),

    usageLimitPerUser: z.coerce
      .number()
      .min(1, { message: "Usage limit must be at least 1" })
      .default(Infinity),
    totalUsageLimit: z.coerce
      .number()
      .min(1, { message: "Total usage limit must be at least 1" })
      .default(Infinity),

    usedCount: z.number().default(0),

    userUsage: z
      .array(
        z.object({
          userId: z.string(),
          usageCount: z.number().default(0),
        })
      )
      .optional(),

    status: z.string().default("Active"),

    expiresAt: z
      .union([z.coerce.date(), z.string()])
      .nullable()
      .optional()
      .transform((val) => (val ? new Date(val) : null)),

    createdBy: z.string().optional(),
    updatedBy: z.string().nullable().optional(),

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
        message:
          "At least one product is required for specific products applicability",
        path: ["specificProducts"],
      });
    }

    if (
      data.couponApplicableOn === "productCategories" &&
      (!data.productCategories || data.productCategories.length === 0)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "At least one category is required for product categories applicability",
        path: ["productCategories"],
      });
    }

    if (data.couponType === "quantityBased" && data.minQuantity <= 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Minimum quantity must be at least 1 for quantity-based coupons",
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

    // New validation: Ensure discountValue does not exceed minOrderAmount for flat discounts
    if (
      data.discountType === "flat" &&
      data.minOrderAmount &&
      data.discountValue > data.minOrderAmount
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Discount value ($${data.discountValue}) cannot exceed the minimum order amount ($${data.minOrderAmount}) for a flat discount coupon`,
        path: ["discountValue"],
      });
    }
  });

export type CouponFormValues = z.infer<typeof couponFormSchema>;
