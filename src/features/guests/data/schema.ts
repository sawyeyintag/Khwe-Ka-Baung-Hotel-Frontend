import { z } from "zod";

export const guestSchema = z.object({
  uid: z.string(),
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  address: z.string(),
  nicCardNum: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const guestUpsertSchema = guestSchema.omit({
  uid: true,
  createdAt: true,
  updatedAt: true,
});

export type Guest = z.infer<typeof guestSchema>;

export type GuestUpsert = z.infer<typeof guestUpsertSchema>;
