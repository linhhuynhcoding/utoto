import { z } from "zod";
import { GpsPointSchema } from "../types/gps.type";

export const GpsEventSchema = z.object({
  id: z.string().optional(),
  licenseNumber: z.string().optional(),
  state: z.string().optional(), // 'running', 'stopped'
  last_time_running: z.number().optional(),
  last_time_stopped: z.number().optional(),
  last_position: GpsPointSchema,
  timestamp: z.number().optional(),
  speed: z.number().optional(),
});

export type GpsEvent = z.infer<typeof GpsEventSchema>;
