import { z } from "zod";

export const TripStatusSchema = z.enum([
  "PENDING",
  "APPROVED",
  "REJECTED",
  "CANCELLED",
  "COMPLETED",
]);

export const CreateTripSchema = z.object({
  renter_id: z.string().max(20),
  car_id: z.string().max(20),
  from_date: z.string().datetime(),
  to_date: z.string().datetime(),
  ship_method: z.number().int().default(1),
  ship_fee: z.number().optional(),
  rent_amount: z.number(),
  payment_id: z.number().int().optional(),
});

export const UpdateTripSchema = z.object({
  status: TripStatusSchema.optional(),
  ship_method: z.number().int().optional(),
  ship_fee: z.number().optional(),
  rent_amount: z.number().optional(),
  payment_id: z.number().int().optional(),
});

export const TripFilterSchema = z.object({
  renter_id: z.string().optional(),
  car_id: z.string().optional(),
  owner_id: z.string().optional(),
  status: TripStatusSchema.optional(),
  from_date_start: z.string().datetime().optional(),
  from_date_end: z.string().datetime().optional(),
  page: z.string().transform(Number).default("1"),
  limit: z.string().transform(Number).default("10"),
});

export const TripResponseSchema = z.object({
  trip_id: z.string(),
  renter_id: z.string(),
  car_id: z.string(),
  status: z.string(),
  from_date: z.date(),
  to_date: z.date(),
  ship_method: z.number(),
  ship_fee: z.string().nullable().optional(), // Decimal handles as string in serialized JSON usually or number
  rent_amount: z.string(), // Decimal
  payment_id: z.string().nullable().optional(), // BigInt
  cars: z.any().optional(),
  users: z.any().optional(),
});

export type TripStatus = z.infer<typeof TripStatusSchema>;
export type CreateTrip = z.infer<typeof CreateTripSchema>;
export type UpdateTrip = z.infer<typeof UpdateTripSchema>;
export type TripFilter = z.infer<typeof TripFilterSchema>;
export type TripResponse = z.infer<typeof TripResponseSchema>;
