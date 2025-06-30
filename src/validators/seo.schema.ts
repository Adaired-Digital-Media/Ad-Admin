import { z } from "zod";
import { messages } from "@/config/messages";

export const seoFormSchema = z.object({
  metaTitle: z.string().min(1, { message: messages.required }),
  metaDescription: z.string().min(1, { message: messages.required }),
  canonicalLink: z.string().min(1, { message: messages.required }),
  focusKeyword: z.string().min(1, { message: messages.required }),
  keywords: z.array(z.string()).default([]),
  openGraph: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    image: z.string().optional(),
    type: z.string().default("website"),
    url: z.string().optional(),
    siteName: z.string().optional(),
  }),
  twitterCard: z.object({
    cardType: z.string().default("summary_large_image"),
    site: z.string().optional(),
    creator: z.string().optional(),
    title: z.string().optional(),
    description: z.string().optional(),
    image: z.string().optional(),
  }),
  robotsText: z.string().min(1, { message: messages.required }),
  schemaOrg: z.string().optional(),
  bodyScript: z.string().optional(),
  headerScript: z.string().optional(),
  footerScript: z.string().optional(),
  priority: z.number().min(0).max(1).default(0.5),
  changeFrequency: z
    .enum(["always", "hourly", "daily", "weekly", "monthly", "yearly", "never"])
    .default("monthly"),
  redirect: z
    .object({
      type: z.enum(["301", "302"]).nullable().default(null),
      url: z.string().optional(),
    })
    .optional(),
});

export type SeoFormInput = z.infer<typeof seoFormSchema>;