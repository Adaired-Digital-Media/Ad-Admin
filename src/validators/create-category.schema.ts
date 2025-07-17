import { z } from "zod";
import { messages } from "@/config/messages";

// form zod validation schema
export const categoryFormSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(1, { message: messages.catNameIsRequired }),
  slug: z.string().min(1, { message: messages.slugIsRequired }),
  parentCategory: z
    .string()
    .optional()
    .transform((val) => (val === "" ? null : val)),
  description: z.string().optional(),
  image: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  canonicalLink: z.string().optional(),
  status: z.string().optional(),
});

// generate form types from zod validation schema
export type CategoryFormInput = z.infer<typeof categoryFormSchema>;
