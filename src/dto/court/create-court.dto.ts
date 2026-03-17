import z from 'zod';

export const courtSchema = z.object({
  name: z.string().min(2).max(100),
  location: z.string(),
  pricePerHour: z.coerce.number(),
  active: z.boolean().default(true),
});

export type CreateCourtDto = z.infer<typeof courtSchema>;
