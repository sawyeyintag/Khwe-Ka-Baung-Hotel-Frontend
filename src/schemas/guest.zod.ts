import { z } from "zod";

export const GuestSchema = z.object({
  uid: z.string().min(1, "Guest ID is required"),
  name: z.string().min(1, "Guest name is required"),
  phone: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email format"),
  address: z.string().min(1, "Address is required"),
  nicCardNum: z.string().min(1, "NIC card number is required"),
});

export const guestFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  email: z
    .string()
    .min(1, { message: "Email is required." })
    .email({ message: "Email is invalid." }),
  phone: z.string().min(1, { message: "Phone is required." }),
  address: z.string().min(1, { message: "Address is required." }),
  nicCardNum: z.string().min(1, { message: "NIC is required." }),
  isEdit: z.boolean(),
});
