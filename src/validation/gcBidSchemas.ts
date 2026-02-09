import { z } from "zod";

// GC bid & proposal schemas

export const bidItemSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  description: z.string().optional(),
  price: z.number().nonnegative("Price cannot be negative"),
});

export type BidItemInput = z.infer<typeof bidItemSchema>;

export const bidFormSchema = z.object({
  items: z
    .array(bidItemSchema)
    .min(1, "At least one line item is required")
    .refine((items) => items.some((item) => item.price > 0), {
      message: "At least one line item must have a price greater than 0",
    }),
  notes: z.string().optional(),
  estimatedStartDate: z.string().optional(),
  estimatedEndDate: z.string().optional(),
  companyHighlights: z.string().optional(),
  relevantExperience: z.string().optional(),
  credentials: z.string().optional(),
});

export type BidFormInput = z.infer<typeof bidFormSchema>;

// Editing individual bid items uses the same shape as bidItemSchema
export const bidItemEditSchema = bidItemSchema;

export type BidItemEditInput = z.infer<typeof bidItemEditSchema>;
