import { z } from "zod";

export const ProvinceSchema = z.object({
  code: z.string(),
  name: z.string(),
  full_name: z.string(),
});

export const DistrictSchema = z.object({
  code: z.string(),
  name: z.string(),
  full_name: z.string().nullable(),
  province_code: z.string().nullable(),
});

export const WardSchema = z.object({
  code: z.string(),
  name: z.string(),
  full_name: z.string().nullable(),
  district_code: z.string().nullable(),
});

export type Province = z.infer<typeof ProvinceSchema>;
export type District = z.infer<typeof DistrictSchema>;
export type Ward = z.infer<typeof WardSchema>;
