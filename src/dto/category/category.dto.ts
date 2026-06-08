import z from 'zod';

/** Field client được phép gửi khi tạo. breadcrumb/ancestors/productCount do BE tự tính. */
export const CreateCategorySchema = z.object({
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, 'Slug chỉ gồm chữ thường, số và dấu gạch ngang'),
  name: z.string().min(1).max(255),
  description: z.string().max(5000).optional(),
  parentId: z.string().nullable().optional(),
  image: z.string().optional(),
  icon: z.string().max(64).optional(),
  sortOrder: z.number().int().min(0).optional(),
  isPublished: z.boolean().default(true),
});

export const UpdateCategorySchema = CreateCategorySchema.partial();

/** Đổi parent + vị trí (drag-drop reorder). */
export const MoveCategorySchema = z.object({
  parentId: z.string().nullable(),
  position: z.number().int().min(0),
});

/** Query cho flat list. publishedOnly mặc định true (storefront). */
export const ListCategoryQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  parentId: z.string().nullable().optional(),
  q: z.string().optional(),
  publishedOnly: z.coerce.boolean().default(true),
  sort: z.enum(['sortOrder', 'name', 'createdAt']).default('sortOrder'),
});

export type CreateCategory = z.infer<typeof CreateCategorySchema>;
export type UpdateCategory = z.infer<typeof UpdateCategorySchema>;
export type MoveCategory = z.infer<typeof MoveCategorySchema>;
export type ListCategoryQuery = z.infer<typeof ListCategoryQuerySchema>;
