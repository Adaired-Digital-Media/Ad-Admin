import { z } from "zod";
import { messages } from "@/config/messages";

export const createPermissionModule = z.object({
  name: z.string().min(2, { message: messages.nameIsRequired }),
  value: z.string().min(2, { message: "Value is required" }),
  status: z.boolean().optional(),
});



// generate form types from zod validation schema
export type CreatePermissionModuleInput = z.infer<typeof createPermissionModule>;