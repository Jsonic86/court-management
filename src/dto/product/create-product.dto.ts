import z from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(2).max(100),
  category: z.string().min(1),
  price: z.coerce.number().min(0),
  stock: z.coerce.number().int().min(0).default(0),
});

export type CreateProductDto = z.infer<typeof createProductSchema>;
