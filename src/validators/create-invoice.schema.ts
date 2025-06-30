import { z } from 'zod';
import { messages } from '@/config/messages';

export const invoiceFormSchema = z.object({
  fromName: z.string().min(1, { message: messages.nameIsRequired }),
  toName: z.string().min(1, { message: messages.nameIsRequired }),
  invoiceNumber: z.string({
    required_error: 'This field is required',
  }),
  createDate: z.date({
    required_error: messages.createDateIsRequired,
  }),
  dueDate: z.date({
    required_error: messages.dueDateIsRequired,
  }),
  status: z.string({
    required_error: messages.statusIsRequired,
  }),
  discount: z.coerce.number().min(1, { message: messages.discountIsRequired }),
  products: z.array(
    z.object({
      item: z.string().min(1, { message: messages.itemNameIsRequired }),
      wordCount: z.coerce
        .number()
        .min(1, { message: messages.itemQtyIsRequired }),
      quantity: z.coerce
        .number()
        .min(1, { message: messages.itemQtyIsRequired }),
      price: z.coerce
        .number()
        .min(1, { message: messages.itemPriceIsRequired }),
    })
  ),
});

// generate form types from zod validation schema
export type InvoiceFormInput = z.infer<typeof invoiceFormSchema>;
