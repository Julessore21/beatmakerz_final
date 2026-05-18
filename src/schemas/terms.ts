import { z } from "zod";

export const termsSchema = z.object({
  streamsMax: z.number().optional(),
  commercialUse: z.boolean().optional(),
  exclusiveRights: z.boolean().optional(),
  distributionPlatforms: z.array(z.string()).optional(),
  label: z.string().optional(),
  description: z.string().optional(),
});

export type Terms = z.infer<typeof termsSchema>;
