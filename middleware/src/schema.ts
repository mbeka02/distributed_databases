import z, { number } from "zod";
export const updateInventorySchema = z.object({
  item_count: z.number(),
  product_id: z.number(),
});

export const addEmployeeSchema = z.object({
  name: z.string(),
  dob: z.string(),
  work_email: z.string().email({ message: "Work email should be an email" }),
  phone_number: z.string(),
  salary: z.number(),
  job_title: z.string(),
  store_id: z.number(),
});

export const customerPurchase = z.object({
  product_id: z.number(),
  employee_id: z.number(),
  store_id: z.number(),
  price: z.number(),
  timestamp: z.number(),
});
export const createDiscountSchema = z.object({
  discount: z.number(),
  product_id: z.number(),
});
