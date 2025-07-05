import { z } from "zod";
import { guestFormSchema, GuestSchema } from "./guest.zod";

export const SessionCreateSchema = z.object({
  selectedRoomTypeId: z.string().min(1, "Please select a room type"),
  selectedFloor: z.string().min(1, "Please select a floor"),
  selectedRoomStatusId: z.string().min(1, "Please select a room status"),
  roomNumber: z.string().min(1, "Room number is required"),
  selectedGuests: z
    .array(GuestSchema)
    .min(1, "At least one guest must be selected"),
  guestSearches: z.array(z.string()).optional(),
  newGuestForms: z.record(z.number(), guestFormSchema).optional(),
  extraBeds: z
    .number()
    .min(0, "Extra beds cannot be negative")
    .max(10, "Maximum 10 extra beds allowed"),
  actualCheckIn: z.date(),
});

export const SessionEndSchema = z.object({
  actualCheckOut: z.date(),
});
