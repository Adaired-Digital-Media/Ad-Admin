import { z } from "zod";
import { messages } from "@/config/messages";
import { seoFormSchema } from "@/validators/seo.schema";

export const blogFormSchema = z
  .object({
    _id: z.string().optional(),
    postTitle: z.string().min(1, { message: messages.required }),
    postDescription: z.string().min(1, { message: messages.required }),
    slug: z.string().optional(),
    featuredImage: z.string().min(1, { message: messages.required }),
    category: z
      .string()
      .optional()
      .transform((val) => (val === "" ? undefined : val)),
    tags: z.array(z.string()).default([]),
    status: z
      .enum(["publish", "draft", "scheduled"], {
        errorMap: () => ({
          message: messages.invalidStatus,
        }),
      })
      .default("draft"),
    scheduledPublishDate: z
      .union([z.coerce.date(), z.string()])
      .nullable()
      .optional()
      .transform((val) => (val ? new Date(val) : null))
      .refine((val) => !val || !isNaN(val.getTime()), {
        message: messages.invalidDate,
      }),
    seo: seoFormSchema,
  })
  .superRefine((data, ctx) => {
    // Validate that scheduledPublishDate is required when status is "scheduled"
    if (data.status === "scheduled" && !data.scheduledPublishDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: messages.scheduledDateRequired,
        path: ["scheduledPublishDate"],
      });
    }

    // Validate that scheduledPublishDate, if provided, is in the future
    if (
      data.scheduledPublishDate &&
      new Date(data.scheduledPublishDate) <= new Date()
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: messages.futureDate,
        path: ["scheduledPublishDate"],
      });
    }
  });

export type BlogFormInput = z.infer<typeof blogFormSchema>;
