import { z } from "zod";
import { messages } from "@/config/messages";
export const productFormSchema = z.object({
  _id: z.string().optional(),
  featuredImage: z
    .string()
    .min(1, { message: messages.required })
    .url({ message: messages.invalidUrl }),
  name: z.string().min(1, { message: messages.nameIsRequired }),
  description: z.string().optional(),
  category: z.string().min(1, { message: messages.categoryIsRequired }),
  subCategory: z.array(z.string()).optional(),
  minimumQuantity: z
    .number({
      message: messages.required,
    })
    .min(1, { message: messages.invalidQuantity }),
  minimumWords: z
    .number({
      message: messages.required,
    })
    .min(1, { message: messages.invalidWordCount }),
  slug: z.string().min(1, { message: messages.slugIsRequired }),
  pricePerUnit: z
    .number({
      message: messages.required,
    })
    .min(0, { message: messages.priceIsRequired }),
  pricingType: z.enum([
    "perWord",
    "perPost",
    "perReview",
    "perMonth",
    "perQuantity",
  ]),
  stock: z.preprocess((val) => {
    const num = Number(val);
    return isNaN(num) ? undefined : num;
  }, z.number().optional()),
  images: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  priority: z.preprocess((val) => {
    const num = Number(val);
    return isNaN(num) ? undefined : num;
  }, z.number().optional()),
  keywords: z.array(z.string()).optional(),
  formId: z.string().min(1, { message: messages.required }),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  canonicalLink: z.string().optional(),
  status: z.enum(["Active", "Inactive", "Archived", "Out of Stock"]),
  isFreeProduct: z.boolean().optional(),
  createdBy: z.string().optional(),
  updatedBy: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  __v: z.number().optional(),
});

// Infer TypeScript type from the Zod schema
export type ProductFormValues = z.infer<typeof productFormSchema>;
