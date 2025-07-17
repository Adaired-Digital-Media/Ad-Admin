import { z } from "zod";

// form zod validation schema
export const createTicketSchema = z.object({
  _id: z.string().optional(),
  subject: z.string().min(1, { message: "Subject is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  status: z
    .enum(["open", "in progress", "resolved", "closed", "reopened"])
    .optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
  assignedTo: z.string().optional(),
  customer: z.string().optional(),
  attachments: z.any().optional(),
});

// generate form types from zod validation schema
export type CreateTicketInput = z.infer<typeof createTicketSchema>;
