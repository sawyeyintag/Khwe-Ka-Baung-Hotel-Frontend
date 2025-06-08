import { z } from "zod";

export const roomUpsertSchema = z.object({
  roomNumber: z
    .string()
    .regex(/^\d{3}$/, "Room number must be a 3-digit number"),
  floorNumber: z.coerce
    .number()
    .int()
    .min(1, { message: "Floor number must be a one-digit number" })
    .max(9, { message: "Floor number must be a one-digit number" }),
  roomTypeId: z
    .number()
    .min(1, { message: "Room type is required" })
    .transform((val) => Number(val)),
  isEdit: z.boolean(),
});
