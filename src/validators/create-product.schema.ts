import { z } from "zod";

export const productFormSchema = z.object({
  _id: z.string().optional(),

  featuredImage: z
    .string()
    .min(1, { message: "Featured image is required." })
    .url({ message: "Featured image must be a valid URL." }),

  name: z.string().min(1, { message: "Product name is required." }),

  description: z.string().optional(),

  category: z.string().min(1, { message: "Category is required." }),

  subCategory: z.array(z.string()).optional(),

  minimumQuantity: z
    .number({ message: "Minimum quantity is required." })
    .min(1, { message: "Minimum quantity must be at least 1." }),

  minimumWords: z
    .number({ message: "Minimum word count is required." })
    .min(1, { message: "Minimum word count must be at least 1." }),

  slug: z.string().min(1, { message: "Slug is required." }),

  pricePerUnit: z
    .number({ message: "Price per unit is required." })
    .min(0, { message: "Price per unit must be 0 or greater." }),

  pricingType: z.enum(
    ["perWord", "perPost", "perReview", "perMonth", "perQuantity"],
    { message: "Pricing type is required." }
  ),

  stock: z.preprocess(
    (val) => {
      const num = Number(val);
      return isNaN(num) ? undefined : num;
    },
    z.number({ message: "Stock must be a valid number." }).optional()
  ),

  images: z.array(z.string()).optional(),

  tags: z.array(z.string()).optional(),

  priority: z.preprocess(
    (val) => {
      const num = Number(val);
      return isNaN(num) ? undefined : num;
    },
    z.number({ message: "Priority must be a valid number." }).optional()
  ),

  keywords: z.array(z.string()).optional(),

  formId: z.string().min(1, { message: "Form ID is required." }),

  metaTitle: z.string().optional(),

  metaDescription: z.string().optional(),

  canonicalLink: z
    .string()
    .url({ message: "Canonical link must be a valid URL." })
    .optional(),

  status: z.enum(["active", "inactive", "archived", "out of stock"], {
    message: "Status is required.",
  }),

  isFreeProduct: z.boolean().optional(),

  createdBy: z.string().optional(),
  updatedBy: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  __v: z.number().optional(),
});


// Infer TypeScript type from the Zod schema
export type ProductFormValues = z.infer<typeof productFormSchema>;
