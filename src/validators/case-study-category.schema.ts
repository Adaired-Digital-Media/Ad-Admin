import { z } from "zod";
import { messages } from "@/config/messages";

export const caseStudyCategoryFormSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(1, { message: messages.catNameIsRequired }).trim(),
  slug: z.string().min(1, { message: messages.slugIsRequired }).trim(),
  image: z.string().optional(),
  status: z.string().optional(),
  parentCategory: z
    .string()
    .optional()
    .transform((val) => (val === "" ? null : val)),
  metaTitle: z.string().trim().optional(),
  metaDescription: z.string().trim().optional(),
  canonicalLink: z.string().optional(),
});
export type CaseStudyCategoryFormInput = z.infer<typeof caseStudyCategoryFormSchema>;
