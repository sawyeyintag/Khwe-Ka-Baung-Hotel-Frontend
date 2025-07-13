import { z } from "zod";

export const SessionCreateSchema = z
  .object({
    selectedRoomTypeId: z.string().min(1, "Please select a room type"),
    selectedFloor: z.string().min(1, "Please select a floor"),
    roomNumber: z.string().min(1, "Room number is required"),
    guestIds: z.array(z.string()),
    note: z.string().optional(),
    isBreakfastIncluded: z.boolean(),
    numberOfExtraBeds: z.number().min(0).max(10),
    actualCheckIn: z.date(),
  })
  .refine((data) => data.guestIds.length > 0, {
    message: "At least one guest is required",
    path: ["guestIds"],
  });

export const SessionEndSchema = z.object({
  actualCheckOut: z.date(),
});
