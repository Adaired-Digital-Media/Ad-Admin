import { z } from "zod";
import { messages } from "@/config/messages";

export const productCategoryFormSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(1, { message: messages.catNameIsRequired }).trim(),
  slug: z.string().min(1, { message: messages.slugIsRequired }).trim(),
  image: z.string().optional(),
  status: z.string().optional(),
  parentCategory: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val === "" ? null : val)),
});
export type ProductCategoryFormInput = z.infer<typeof productCategoryFormSchema>;
