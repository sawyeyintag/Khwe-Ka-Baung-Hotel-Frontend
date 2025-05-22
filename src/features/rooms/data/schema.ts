import { z } from "zod";

export const roomSchema = z.object({
  roomNumber: z.number(),
  floorNumber: z.number(),
  roomType: z.object({
    id: z.number(),
    name: z.string(),
    price: z.number(),
    pax: z.number(),
  }),
  status: z.object({
    id: z.number(),
    label: z.string(),
  }),
});

export const roomUpsertSchema = z.object({
  roomNumber: z
    .number()
    .int()
    .min(100, { message: "Room number must be a 3-digit number" })
    .max(999, { message: "Room number must be a 3-digit number" }),
  floorNumber: z
    .number()
    .int()
    .min(1, { message: "Floor number must be a one-digit number" })
    .max(9, { message: "Floor number must be a one-digit number" }),
  roomTypeId: z
    .number()
    .min(1, { message: "Room type is required" })
    .transform((val) => Number(val)),
});

export type Room = z.infer<typeof roomSchema>;

export type RoomUpsert = z.infer<typeof roomUpsertSchema>;
