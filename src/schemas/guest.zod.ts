import { z } from "zod";

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
