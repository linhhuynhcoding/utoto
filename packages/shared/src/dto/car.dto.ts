import { z } from "zod";

export const TransmissionEnum = z.enum(["MANUAL", "AUTOMATIC"]);
export const EngineTypeEnum = z.enum([
  "GASOLINE",
  "DIESEL",
  "ELECTRIC",
  "HYBRID",
]);

export const CarModelSchema = z.object({
  id: z.string(),
  name: z.string(),
});
export type CarModel = z.infer<typeof CarModelSchema>;

export const CarBrandSchema = z.object({
  id: z.string(),
  name: z.string(),
  logo: z.string(),
  models: z.array(CarModelSchema).optional(),
});
export type CarBrand = z.infer<typeof CarBrandSchema>;

export const FeatureSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  logo: z.string().nullable(),
});
export type Feature = z.infer<typeof FeatureSchema>;

export const CarSettingsResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    brands: z.array(CarBrandSchema),
    features: z.array(FeatureSchema),
  }),
});
export type CarSettingsResponse = z.infer<typeof CarSettingsResponseSchema>;

export const CarBaseSchema = z.object({
  name: z.string().min(1).max(100),
  desc: z.string(),
  model_id: z.string(), // BigInt as string for JSON
  transmission: TransmissionEnum,
  seat: z.number().int().positive(),
  engine_type: EngineTypeEnum,
  price: z.number().positive(),
  deliveryFee: z.number().nonnegative().optional().default(0),
  deliveryRadius: z.number().int().nonnegative().optional().default(20),
  location_id: z.string().optional(),
  batteryChargingPerPercentPrice: z
    .number()
    .nonnegative()
    .optional()
    .default(0),
  batteryChargingPrice: z.number().nonnegative().optional().default(0),
  deodorisePrice: z.number().nonnegative().optional().default(0),
  washingPrice: z.number().nonnegative().optional().default(0),
  overTimePrice: z.number().nonnegative().optional().default(0),
  maxOverTimeHour: z.number().int().nonnegative().optional().default(5),
  is_self_driving: z.boolean().optional().default(true),
  is_with_driver: z.boolean().optional().default(false),
  is_long_term: z.boolean().optional().default(false),
});

export const CreateCarSchema = CarBaseSchema.extend({
  feature_ids: z.array(z.string()).optional(),
  image_urls: z.array(z.string()).optional(),
  address: z
    .object({
      province: z.string(),
      district: z.string(),
      ward: z.string(),
      street: z.string(),
    })
    .optional(),
});

export const UpdateCarSchema = CarBaseSchema.partial().extend({
  feature_ids: z.array(z.string()).optional(),
  image_urls: z.array(z.string()).optional(),
});

export const CarFilterSchema = z.object({
  owner_id: z.string().optional(),
  brand_id: z.string().optional(),
  model_id: z.string().optional(),
  min_price: z.coerce.number().optional(),
  max_price: z.coerce.number().optional(),
  transmission: TransmissionEnum.optional(),
  seat: z.coerce.number().optional(),
  engine_type: EngineTypeEnum.optional(),
  features: z.array(z.string()).optional(),
  location_id: z.string().optional(),
  province: z.string().optional(),
  district: z.string().optional(),
  ward: z.string().optional(),
  type: z.enum(["self-driving", "with-driver", "long-term"]).optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().optional().default(10),
});

export type CreateCar = z.infer<typeof CreateCarSchema>;
export type UpdateCar = z.infer<typeof UpdateCarSchema>;
export type CarFilter = z.infer<typeof CarFilterSchema>;

// Detailed Car Response
export const CarResponseSchema = CarBaseSchema.extend({
  id: z.string(),
  owner_id: z.string(),
  owner_info: z
    .object({
      name: z.string(),
      avatar: z.string().nullable().optional(),
      isVerified: z.boolean().optional(),
    })
    .optional(),
  priceWithPlatformFee: z.number(),
  brand: CarBrandSchema.omit({ models: true }),
  model: CarModelSchema,
  features: z.array(FeatureSchema),
  images: z.array(z.string()),
  location: z
    .object({
      id: z.string(),
      lat: z.number().nullable(),
      lon: z.number().nullable(),
      street: z.string(),
      province: z.string(),
      district: z.string(),
      ward: z.string(),
      province_id: z.string().optional(),
      district_id: z.string().optional(),
      ward_id: z.string().optional(),
    })
    .nullable(),
});

export type CarResponse = z.infer<typeof CarResponseSchema>;

// Car Calendar
export const CarCalendarSchema = z.object({
  from_date: z.coerce.date(),
  to_date: z.coerce.date(),
  status: z.string(),
});
export type CarCalendar = z.infer<typeof CarCalendarSchema>;

export const CarCalendarResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(CarCalendarSchema),
});
export type CarCalendarResponse = z.infer<typeof CarCalendarResponseSchema>;
