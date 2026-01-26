import { z } from "zod";

export const GpsEvent = z.object({
  licenseNumber: z.string(),
  lat: z.number(),
  lng: z.number(),
});

export type GpsEventType = z.infer<typeof GpsEvent>;
