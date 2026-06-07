import z from 'zod';

export const ProductVariantSchema = z.object({
  id: z.string(),
  label: z.string(),
});

export const ColorSwatchSchema = z.object({
  id: z.string(),
  label: z.string(),
  // CSS color, gradient, hoặc image-url(...) cho fabric pattern.
  swatch: z.string(),
  selected: z.boolean().optional(),
});

export const QuoteOptionSchema = z.object({
  id: z.string(),
  label: z.string(),
});

export const ProductSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.string(),
  breadcrumb: z.array(z.string()).optional(),
  rating: z.number(),
  reviews: z.number(),
  soldText: z.string().optional(),
  priceCents: z.number(),
  originalPriceCents: z.number().optional(),
  currency: z.string(),
  image: z.string(),
  thumbs: z.array(z.string()).optional(),
  variants: z.array(ProductVariantSchema),
  sizes: z.array(z.string()).optional(),
  colors: z.array(ColorSwatchSchema),
  quotes: z.array(QuoteOptionSchema),
  shipsTo: z.string(),
  arrivalRange: z.string(),
  isPublished: z.boolean().default(true),
  primaryTemplateId: z.string().nullable(),
  status: z.number().default(1),
});

export const CreateProductSchema = ProductSchema.omit({ id: true });
export const UpdateProductSchema = ProductSchema.partial();

export type Product = z.infer<typeof ProductSchema>;
export type ProductVariant = z.infer<typeof ProductVariantSchema>;
export type ColorSwatch = z.infer<typeof ColorSwatchSchema>;
export type QuoteOption = z.infer<typeof QuoteOptionSchema>;
export type CreateProduct = z.infer<typeof CreateProductSchema>;
export type UpdateProduct = z.infer<typeof UpdateProductSchema>;
