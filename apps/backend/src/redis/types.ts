import { z } from "zod";

export const LocationMessage = z.object({
    licenseNumber: z.string(),
    lat: z.number(),
    lng: z.number(),
});

export type LocationMessageType = z.infer<typeof LocationMessage>;