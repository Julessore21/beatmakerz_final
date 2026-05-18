import { z } from "zod";

export const adminLoginSchema = z.object({
  email: z.string().min(1, "Email requis").email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

export type AdminLoginInput = z.infer<typeof adminLoginSchema>;
