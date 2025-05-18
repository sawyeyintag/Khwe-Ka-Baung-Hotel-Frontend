import { z } from "zod";
import { GuestUpsertSchema } from "@/validation/schema/guest.schema";

export type GuestUpsert = z.infer<typeof GuestUpsertSchema>;
