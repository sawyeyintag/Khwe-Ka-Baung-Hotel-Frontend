import { createFileRoute } from "@tanstack/react-router";
import Guests from "@/features/guests";

export const Route = createFileRoute("/_authenticated/guests/")({
  component: Guests,
});
