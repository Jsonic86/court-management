import z from 'zod';

export const bookingSchema = z.object({
  court: z.string(),
  bookingDate: z.string().date(),
  startTime: z.string(),
  endTime: z.string(),
  status: z.string().default('pending'),
});

export type CreateUpdateBooking = z.infer<typeof bookingSchema>;
