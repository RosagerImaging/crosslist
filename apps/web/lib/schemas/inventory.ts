import { z } from "zod";

export const insertItemSchema = z.object({
  title: z.string().min(1, "Title is required").max(80, "Title must be 80 characters or less"),
  price: z.coerce.number().positive("Price must be a positive number"),
  condition: z.enum(["new", "like_new", "used", "for_parts"]),
  sku: z.string().optional(),
  description: z.string().optional(),
});

export type InsertItemValues = z.infer<typeof insertItemSchema>;
