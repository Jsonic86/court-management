import z from 'zod';

export const SellerTemplateSchema = z.object({
  id: z.string(),
  publicId: z.string(),
  sourceDesignId: z.string(),
  createdByUserId: z.string(),
  name: z.string(),
  description: z.string(),
  productId: z.string().nullable(),
  widthIn: z.number(),
  heightIn: z.number(),
  ppi: z.number(),
  cutPathSvg: z.string().nullable(),
  layers: z.array(z.any()),
  layerCount: z.number(),
  totalBytes: z.number(),
  isActive: z.boolean(),
  publishedAt: z.date().nullable(),
  status: z.number(),
});

export const CreateSellerTemplateSchema = SellerTemplateSchema.omit({
  id: true,
});

export const UpdateSellerTemplateSchema = SellerTemplateSchema.partial();

export type SellerTemplate = z.infer<typeof SellerTemplateSchema>;
export type CreateSellerTemplate = z.infer<typeof CreateSellerTemplateSchema>;
export type UpdateSellerTemplate = z.infer<typeof UpdateSellerTemplateSchema>;
