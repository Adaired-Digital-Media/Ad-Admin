import { z } from "zod";
import { messages } from "@/config/messages";
import { seoFormSchema } from "@/validators/seo.schema";

export const caseStudyFormSchema = z.object({
  _id: z.string().optional(),
  category: z
    .string()
    .optional()
    .transform((val) => (val === "" ? null : val)),
  name: z.string().min(1, { message: messages.required }),
  slug: z.string().optional(),
  colorScheme: z.string().min(1, { message: messages.required }),
  status: z.enum(["active", "inactive"]).default("inactive"),
  bodyData: z.array(z.unknown()).optional(),
  seo: seoFormSchema,
});

export type CaseStudyFormInput = z.infer<typeof caseStudyFormSchema>;
