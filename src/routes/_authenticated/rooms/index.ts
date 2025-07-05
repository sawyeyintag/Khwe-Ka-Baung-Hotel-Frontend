import { createFileRoute } from "@tanstack/react-router";
import { roomSearchSchema } from "@/schemas/room.zod";
import Rooms from "@/features/rooms";

export const Route = createFileRoute("/_authenticated/rooms/")({
  component: Rooms,
  validateSearch: roomSearchSchema,
});
