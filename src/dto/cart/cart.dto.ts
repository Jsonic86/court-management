import z from 'zod';

export const CartSchema = z.object({
  id: z.string(),
  publicId: z.string(),
  customerUserId: z.string().nullable(),
  currency: z.string(),
  status: z.number(),
  expiresAt: z.date(),
});

export const CartItemSchema = z.object({
  id: z.string(),
  cartId: z.string(),
  sellerTemplateId: z.string(),
  templateSnapshot: z.any(),
  overrides: z.any(),
  thumbnailStorageKey: z.string().nullable(),
  quantity: z.number(),
  unitPriceCents: z.number(),
  currency: z.string(),
  addedAt: z.date(),
});

export const CreateCartSchema = CartSchema.omit({ id: true });
export const UpdateCartSchema = CartSchema.partial();

export type Cart = z.infer<typeof CartSchema>;
export type CartItem = z.infer<typeof CartItemSchema>;
