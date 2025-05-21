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
  statusId: z.number().nullable(),
  guestId: z.string().nullable(),
  numOfGuests: z.number().nullable(),
  numExtraBed: z.number().nullable(),
  actualCheckIn: z.string().datetime().nullable(),
  actualCheckOut: z.string().datetime().nullable(),
});

export const roomUpsertSchema = roomSchema.omit({
  statusId: true,
  guestId: true,
  numOfGuests: true,
  numExtraBed: true,
  actualCheckIn: true,
  actualCheckOut: true,
});

export type Room = z.infer<typeof roomSchema>;

export type RoomUpsert = z.infer<typeof roomUpsertSchema>;
