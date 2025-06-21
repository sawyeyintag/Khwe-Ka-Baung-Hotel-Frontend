import { z } from "zod";
import { guestFormSchema } from "@/schemas/guest.zod";

export type Guest = {
  uid: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  nicCardNum: string;
  createdAt: Date;
  updatedAt: Date;
};

export type GuestFormInput = z.infer<typeof guestFormSchema>;

export type GuestFormData = Omit<GuestFormInput, "isEdit">;
