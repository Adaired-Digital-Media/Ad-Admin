import { z } from "zod";

// Update the schema to match the backend FieldSchema
export const createFieldSchema = z.object({
  name: z.string().min(1, "Name is required"),
  label: z.string().min(1, "Label is required"),
  inputType: z.string().min(1, "Input Type is required"),
  inputMinLength: z.number().nullable().optional(),
  inputMaxLength: z.number().nullable().optional(),
  inputPlaceholder: z.string().nullable().optional(),
  inputValidationPattern: z.string().nullable().optional(),
  inputRequired: z.boolean(),
  customClassName: z.string().nullable().optional(),
  multipleOptions: z
    .array(
      z.object({
        value: z.string().min(1, "Value is required"),
        name: z.string().min(1, "Name is required"),
      })
    )
    .optional(),
});

export type CreateFieldInput = z.infer<typeof createFieldSchema>;