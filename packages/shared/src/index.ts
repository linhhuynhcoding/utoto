import { z } from "zod";

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(2),
});

export type User = z.infer<typeof UserSchema>;

export const CreateUserSchema = UserSchema.omit({ id: true });
export type CreateUser = z.infer<typeof CreateUserSchema>;

export * from "./dto/car.dto";
export * from "./dto/location.dto";
export * from "./dto/media.dto";
export * from "./dto/user.dto";
export * from "./dto/trip.dto";
export * from "./dto/payment.dto";

