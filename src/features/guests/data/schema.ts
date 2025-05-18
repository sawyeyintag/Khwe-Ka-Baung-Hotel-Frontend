import { z } from "zod";

const guestSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  address: z.string(),
  nicCardNum: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});
export type Guest = z.infer<typeof guestSchema>;

export const guestListSchema = z.array(guestSchema);
