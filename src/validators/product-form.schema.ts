import { z } from "zod";
import { messages } from "@/config/messages";

export const productFormSchema = z.object({
  _id: z.string().optional(),
  productType: z.string().min(1, {
    message: messages.productTypeIsRequired,
  }),
  fields: z.array(
    z.object({
      name: z.string().min(1, {
        message: messages.required,
      }),
      label: z.string().min(1, {
        message: messages.required,
      }),
      placeholder: z.string().min(1, {
        message: messages.required,
      }),
      type: z.string().min(1, {
        message: messages.required,
      }),
      required: z.boolean().optional(),
      options: z.array(z.string()).optional(),
      _id: z.string().optional(),
    })
  ),
  createdBy: z.string().optional(),
  updatedBy: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  __v: z.string().optional(),
});

export type ProductFormInput = z.infer<typeof productFormSchema>;
