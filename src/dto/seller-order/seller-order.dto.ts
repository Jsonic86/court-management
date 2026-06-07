import z from 'zod';

export const SellerOrderSchema = z.object({
  id: z.string(),
  orderNumber: z.string(),
  customerUserId: z.string().nullable(),
  customerEmail: z.string().nullable(),
  customerName: z.string().nullable(),
  shippingAddress: z.any().nullable(),
  billingAddress: z.any().nullable(),
  subtotalCents: z.number(),
  shippingCents: z.number(),
  taxCents: z.number(),
  totalCents: z.number(),
  currency: z.string(),
  paymentMethod: z.string(),
  paymentStatus: z.number(),
  fulfillmentStatus: z.number(),
  paidAt: z.date().nullable(),
  shippedAt: z.date().nullable(),
  trackingNumber: z.string().nullable(),
  notes: z.string().nullable(),
  status: z.number(),
});

export const SellerOrderItemSchema = z.object({
  id: z.string(),
  sellerOrderId: z.string(),
  sellerTemplateId: z.string(),
  templateSnapshot: z.any(),
  overrides: z.any(),
  quantity: z.number(),
  unitPriceCents: z.number(),
  lineTotalCents: z.number(),
  printPngToken: z.string().nullable(),
  cutSvgToken: z.string().nullable(),
  previewPngToken: z.string().nullable(),
  productionStatus: z.number(),
});

export const CreateSellerOrderSchema = SellerOrderSchema.omit({ id: true });
export const UpdateSellerOrderSchema = SellerOrderSchema.partial();

export type SellerOrder = z.infer<typeof SellerOrderSchema>;
export type SellerOrderItem = z.infer<typeof SellerOrderItemSchema>;
export type CreateSellerOrder = z.infer<typeof CreateSellerOrderSchema>;
export type UpdateSellerOrder = z.infer<typeof UpdateSellerOrderSchema>;
