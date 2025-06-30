import { z } from "zod";

export const fileFormSchema = z.object({
  secure_url: z.string().optional(),
  caption: z.string().optional(),
  alt: z.string().optional(),
});

export type FileFormInput = z.infer<typeof fileFormSchema>;
