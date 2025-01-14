import z from "zod";
export const updateInventorySchema = z.object({
  item_count: z.number(),
  product_id: z.number(),
});
export const createDiscountSchema = z.object({
  discount: z.number(),
  product_id: z.number(),
});
