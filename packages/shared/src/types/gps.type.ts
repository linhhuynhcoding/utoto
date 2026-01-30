import { z } from "zod";

export const GpsPointSchema = z.tuple([z.number(), z.number()]);
export type GpsPoint = z.infer<typeof GpsPointSchema>;

export const RouteSchema = z.object({
  licenseNumber: z.string(),
  points: z.array(GpsPointSchema),
  cur_pos: GpsPointSchema,
  next_target: z.number(),
});
export type Route = z.infer<typeof RouteSchema>;

export const CarSchema = z.object({
  id: z.string(),
  licenseNumber: z.string(),
  model: z.string(),
  brand: z.string(),
  speed: z.number(),
});
export type Car = z.infer<typeof CarSchema>;
