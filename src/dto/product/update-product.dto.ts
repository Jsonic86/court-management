import z from 'zod';

export const updateProductSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  category: z.string().min(1).optional(),
  price: z.coerce.number().min(0).optional(),
  stock: z.coerce.number().int().min(0).optional(),
});

export type UpdateProductDto = z.infer<typeof updateProductSchema>;
