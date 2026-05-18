import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Minimum 2 caractères").max(100, "Maximum 100 caractères"),
  email: z.string().min(1, "Email requis").email("Email invalide"),
  subject: z.string().max(200, "Maximum 200 caractères").optional(),
  message: z.string().min(10, "Minimum 10 caractères").max(5000, "Maximum 5000 caractères"),
});

export type ContactInput = z.infer<typeof contactSchema>;
