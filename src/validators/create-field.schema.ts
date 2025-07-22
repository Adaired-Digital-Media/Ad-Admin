import { z } from "zod";

// Predefined valid input types for form fields
export const validInputTypes = [
  "text",
  "email",
  "password",
  "number",
  "tel",
  "url",
  "select",
  "checkbox",
  "radio",
  "textarea",
  "file",
  "date",
  "datetime-local",
  "time",
] as const;

// Update the schema to match the backend FieldSchema with explicit error messages
export const createFieldSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: "Field name is required" })
      .max(100, { message: "Field name cannot exceed 100 characters" })
      .regex(/^[a-zA-Z0-9_-]+$/, {
        message:
          "Field name can only contain letters, numbers, underscores, or hyphens",
      }),
    label: z
      .string()
      .min(1, { message: "Label is required" })
      .max(100, { message: "Label cannot exceed 100 characters" }),
    inputType: z.enum(validInputTypes, {
      message: `Input type must be one of: ${validInputTypes.join(", ")}`,
    }),
    inputMinLength: z
      .number({ invalid_type_error: "Minimum length must be a number" })
      .positive({ message: "Minimum length must be a positive number" })
      .nullable()
      .optional(),
    inputMaxLength: z
      .number({ invalid_type_error: "Maximum length must be a number" })
      .positive({ message: "Maximum length must be a positive number" })
      .nullable()
      .optional(),
    inputPlaceholder: z
      .string()
      .max(200, { message: "Placeholder cannot exceed 200 characters" })
      .nullable()
      .optional(),
    inputValidationPattern: z.string().nullable().optional(),
    inputRequired: z.boolean({ required_error: "Required status is required" }),
    customClassName: z
      .string()
      .max(100, { message: "Custom class name cannot exceed 100 characters" })
      .regex(/^[a-zA-Z0-9_-]*$/, {
        message:
          "Custom class name can only contain letters, numbers, underscores, or hyphens",
      })
      .nullable()
      .optional(),
    multipleOptions: z
      .array(
        z.object({
          value: z
            .string()
            .min(1, { message: "Option value is required" })
            .max(100, { message: "Option value cannot exceed 100 characters" }),
          name: z
            .string()
            .min(1, { message: "Option name is required" })
            .max(100, { message: "Option name cannot exceed 100 characters" }),
        })
      )
      .optional(),
  })
  // .refine(
  //   (data) => {
  //     // Ensure multipleOptions is provided for select, checkbox, or radio inputs
  //     if (
  //       ["select", "checkbox", "radio"].includes(data.inputType) &&
  //       !data.multipleOptions?.length
  //     ) {
  //       return false;
  //     }
  //     return true;
  //   },
  //   {
  //     message:
  //       "Options are required for select, checkbox, or radio input types",
  //     path: ["multipleOptions"],
  //   }
  // )
  .refine(
    (data) => {
      // Ensure inputMinLength is less than inputMaxLength if both are provided
      if (
        data.inputMinLength !== null &&
        data.inputMinLength !== undefined &&
        data.inputMaxLength !== null &&
        data.inputMaxLength !== undefined
      ) {
        return data.inputMinLength <= data.inputMaxLength;
      }
      return true;
    },
    {
      message: "Minimum length must not exceed maximum length",
      path: ["inputMinLength"],
    }
  );

export type CreateFieldInput = z.infer<typeof createFieldSchema>;
