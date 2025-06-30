import { z } from "zod";
import { messages } from "@/config/messages";
import { validateEmail, validatePassword } from "./common-rules";

// form zod validation schema
export const createUserSchema = z.object({
  image: z.string().optional(),
  name: z.string().min(1, { message: messages.fullNameIsRequired }),
  email: validateEmail,
  password: validatePassword,
  contact: z.string().min(1, { message: messages.phoneNumberIsRequired }),
  role: z.string().optional(),
  status: z.string().min(1, { message: messages.statusIsRequired }),
});

// generate form types from zod validation schema
export type CreateUserInput = z.infer<typeof createUserSchema>;
