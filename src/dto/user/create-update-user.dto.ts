import z from 'zod';

export const CreateUpdateUserSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().regex(/^\d{10}$/),
  password: z.string().min(6).optional(),
  role: z.enum(['customer', 'admin']).default('customer'),
});

export type CreateUpdateUserDto = z.infer<typeof CreateUpdateUserSchema>;
