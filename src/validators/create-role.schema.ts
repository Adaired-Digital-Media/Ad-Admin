import { z } from "zod";
import { messages } from "@/config/messages";

// form zod validation schema
export const createRoleSchema = z.object({
  _id: z.string().optional(),
  name: z
    .string()
    .min(1, { message: messages.roleNameIsRequired })
    .min(3, { message: messages.roleNameLengthMin }),
  description: z.string().optional(),
  status: z.boolean().optional(),
  permissions: z.array(z.string()).optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  __v: z.number().optional(),
});

// generate form types from zod validation schema
export type CreateRoleInput = z.infer<typeof createRoleSchema>;
