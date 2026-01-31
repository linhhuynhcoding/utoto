import { z } from "zod";
import { GpsPointSchema } from "../types/gps.type";

export const GpsEventSchema = z.object({
  id: z.string().optional(),
  type: z.string().optional(), // 'update_position', 'change_state'
  licenseNumber: z.string().optional(),
  carId: z.string().optional(),
  state: z.string().optional(), // 'running', 'stopped'
  last_time_running: z.number().optional(),
  last_time_stopped: z.number().optional(),
  last_position: GpsPointSchema,
  timestamp: z.number().optional(),
  speed: z.number().optional(),
  distance: z.number().optional(),
  total_distance: z.number().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  behavior: z.string().optional(), // 'NORMAL', 'SPEEDING', etc.
});

export type GpsEvent = z.infer<typeof GpsEventSchema>;
