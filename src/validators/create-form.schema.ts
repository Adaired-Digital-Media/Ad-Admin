import { z } from "zod";

export const createFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  fields: z.array(
    z.object({
      field: z.string().min(1, "Field is required"),
      fieldOrder: z.number().min(1, "Field order must be at least 1"),
    })
  ),
});

export type CreateFormInput = z.infer<typeof createFormSchema>;
