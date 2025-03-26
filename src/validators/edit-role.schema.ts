import { z } from "zod";

// Schema for the `permissions` array
const PermissionSchema = z.object({
  module: z.string(),
  permissions: z.array(z.number()),
});

// Schema for the `users` array
const UserSchema = z.object({
  type: z.string().refine((val) => /^[0-9a-fA-F]{24}$/.test(val), {
    message: "Invalid ObjectId",
  }),
});

export const rolePermissionSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(3, { message: "Role name is required" }),
  description: z.string().optional(),
  status: z.boolean().optional(),
  permissions: z.array(PermissionSchema).optional(),
  users: z.array(UserSchema).optional(),
});

// Type inference for the schema
export type RolePermissionInput = z.infer<typeof rolePermissionSchema>;
