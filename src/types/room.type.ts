import { z } from "zod";
import { roomSearchSchema, roomUpsertSchema } from "@/schemas/room.zod";
import { RoomStatus } from "./room-status.type";
import { RoomType } from "./room-type.type";

export type Room = {
  roomNumber: string;
  floorNumber: number;
  roomType: RoomType;
  status: RoomStatus;
};

export type RoomCreate = Omit<z.infer<typeof roomUpsertSchema>, "isEdit">;

export type RoomUpdate = Omit<RoomCreate, "roomNumber">;

export type RoomSearchParams = z.infer<typeof roomSearchSchema>;
