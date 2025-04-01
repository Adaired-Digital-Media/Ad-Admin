import { z } from "zod";
import { messages } from "@/config/messages";
import {  validateEmail } from "./common-rules";

export const profileFormSchema = z.object({
  first_name: z.string().min(1, { message: messages.firstNameRequired }),
  last_name: z.string().min(1, { message: messages.lastNameRequired }),
  email: validateEmail,
  image: z.string().optional(),
  username: z.string().min(1, { message: messages.required }),
  password: z.string().optional(),
});

export type ProfileFormTypes = z.infer<typeof profileFormSchema>;

export const defaultValues = {
  image: "",
  username: "",
  first_name: "",
  last_name: "",
  email: "",
};
