import { z } from "zod";

export const socialsSchema = z.object({
  tiktok: z.string().url("URL invalide").optional(),
  instagram: z.string().url("URL invalide").optional(),
  youtube: z.string().url("URL invalide").optional(),
  twitter: z.string().url("URL invalide").optional(),
  spotify: z.string().url("URL invalide").optional(),
}).strict();

export type Socials = z.infer<typeof socialsSchema>;
