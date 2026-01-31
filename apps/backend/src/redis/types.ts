import { z } from "zod";

export const LocationMessage = z.object({
  licenseNumber: z.string(),
  lat: z.number(),
  lng: z.number(),
  state: z.string().optional(),
  speed: z.number().optional(),
  total_distance: z.number().optional(),
  timestamp: z.number().optional(),
  behavior: z.string().optional(),
});

export type LocationMessageType = z.infer<typeof LocationMessage>;
