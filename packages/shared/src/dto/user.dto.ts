import { z } from "zod";

// Response schemas
export const UserResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  phone_number: z.string(),
  phone_code: z.string(),
  dob: z.string().nullable(),
  avatar: z.string().nullable(),
  isVerified: z.boolean(),
  driver_license_code: z.string().nullable(),
  driver_license_name: z.string().nullable(),
  driver_license_dob: z.string().nullable(),
  address: z
    .object({
      id: z.string(),
      street: z.string(),
      short_address: z.string().nullable(),
      ward_id: z.number(),
      district_id: z.number(),
      province_id: z.number(),
      lat: z.number().nullable(),
      lon: z.number().nullable(),
    })
    .nullable(),
});
export type UserResponse = z.infer<typeof UserResponseSchema>;

// Public user info (for displaying car owner info, etc.)
export const PublicUserInfoSchema = z.object({
  id: z.string(),
  name: z.string(),
  avatar: z.string().nullable(),
  isVerified: z.boolean(),
});
export type PublicUserInfo = z.infer<typeof PublicUserInfoSchema>;

// Update profile schema
export const UpdateProfileSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  dob: z.string().optional(), // ISO date string
  phone_number: z.string().max(20).optional(),
  phone_code: z.string().max(20).optional(),
  avatar: z.string().optional(),
});
export type UpdateProfile = z.infer<typeof UpdateProfileSchema>;

// Trip statistics schema
export const TripStatsSchema = z.object({
  totalTrips: z.number(),
  completedTrips: z.number(),
  ongoingTrips: z.number(),
  cancelledTrips: z.number(),
});
export type TripStats = z.infer<typeof TripStatsSchema>;

// Update driver license schema
export const UpdateDriverLicenseSchema = z.object({
  driver_license_code: z.string().min(1).max(50),
  driver_license_name: z.string().min(1).max(100),
  driver_license_dob: z.string(), // Date string
});
export type UpdateDriverLicense = z.infer<typeof UpdateDriverLicenseSchema>;

// Update address schema
export const UpdateAddressSchema = z.object({
  street: z.string().min(1).max(100),
  short_address: z.string().max(100).optional(),
  ward_id: z.number().int(),
  district_id: z.number().int(),
  province_id: z.number().int(),
  lat: z.number().optional(),
  lon: z.number().optional(),
});
export type UpdateAddress = z.infer<typeof UpdateAddressSchema>;
