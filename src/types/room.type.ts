import { z } from "zod";
import { roomUpsertSchema } from "@/features/schema/room.zod";

export type Room = {
  roomNumber: string;
  floorNumber: number;
  roomType: {
    id: number;
    name: string;
    price: number;
    pax: number;
  };
  status: {
    id: number;
    label: string;
  };
};

export type RoomCreate = Omit<z.infer<typeof roomUpsertSchema>, "isEdit">;

export type RoomUpdate = Omit<RoomCreate, "roomNumber">;
