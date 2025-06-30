import { z } from "zod";
import { messages } from "@/config/messages";
import { seoFormSchema } from "@/validators/seo.schema";

export const blogFormSchema = z.object({
  _id: z.string().optional(),
  postTitle: z.string().min(1, { message: messages.required }),
  postDescription: z.string().min(1, { message: messages.required }),
  slug: z.string().optional(),
  featuredImage: z.string().min(1, { message: messages.required }),
  category: z
    .string()
    .optional()
    .transform((val) => (val === "" ? null : val)),
  tags: z.array(z.string()).default([]),
  status: z.enum(["publish", "draft"]).default("draft"),
  seo: seoFormSchema,
});

export type BlogFormInput = z.infer<typeof blogFormSchema>;