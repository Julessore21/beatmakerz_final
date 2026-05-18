import { z } from "zod";

export const briefSchema = z.object({
  genre: z.string().min(1, "Choisissez un genre"),
  style: z.string().min(1, "Choisissez un style"),
  details: z.string().min(10, "Minimum 10 caractères").max(2000, "Maximum 2000 caractères"),
  bpm: z.number().min(60, "BPM minimum 60").max(200, "BPM maximum 200"),
  key: z.string().optional(),
});

export type BriefInput = z.infer<typeof briefSchema>;
