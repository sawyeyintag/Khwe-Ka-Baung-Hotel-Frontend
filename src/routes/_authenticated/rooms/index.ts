import { createFileRoute } from "@tanstack/react-router";
import { roomService } from "@/services/room.service";
import Rooms from "@/features/rooms";

export const Route = createFileRoute("/_authenticated/rooms/")({
  component: Rooms,
  loader: async () => {
    const response = await roomService.getAll();
    return response;
  },
});
