import { createFileRoute } from "@tanstack/react-router";
import { guestService } from "@/services/guest.service";
import Guests from "@/features/guests";

export const Route = createFileRoute("/_authenticated/guests/")({
  component: Guests,
  loader: async () => {
    const response = await guestService.getAll();
    return response;
  },
});
