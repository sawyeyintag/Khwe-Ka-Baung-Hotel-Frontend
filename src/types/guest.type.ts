import { z } from "zod";
import { guestFormSchema, GuestSchema } from "@/schemas/guest.zod";

export type Guest = z.infer<typeof GuestSchema>;

export type GuestFormInput = z.infer<typeof guestFormSchema>;

export type GuestFormData = Omit<GuestFormInput, "isEdit">;
