import { createFileRoute } from "@tanstack/react-router";
import Rooms from "@/features/rooms";

export const Route = createFileRoute("/_authenticated/rooms/")({
  component: Rooms,
  //   loader: async () => {
  //     const response = await guestService.getAll();
  //     return response;
  //   },
});
