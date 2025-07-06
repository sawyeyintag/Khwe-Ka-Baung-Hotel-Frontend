import * as z from "zod";
import { SessionCreateSchema, SessionEndSchema } from "@/schemas/session.zod";

export type Session = {
  id: number;
  roomNumber: string;
  numberOfExtraBeds: number;
  actualCheckIn: Date;
  actualCheckOut: Date | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type SessionCreateFormInput = z.infer<typeof SessionCreateSchema>;

export type SessionCreateFormData = Omit<
  SessionCreateFormInput,
  "selectedRoomTypeId" | "selectedFloor"
>;

export type SessionEndFormInput = z.infer<typeof SessionEndSchema>;
