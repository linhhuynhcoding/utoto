import { Province, District, Ward } from "@utoto/shared";
import apiClient from "@/lib/axios";

export const fetchProvinces = async (): Promise<Province[]> => {
  const response = await apiClient.get<{ data: Province[] }>(
    "/location/provinces",
  );
  return response.data.data;
};

export const fetchDistricts = async (
  provinceCode: string,
): Promise<District[]> => {
  const response = await apiClient.get<{ data: District[] }>(
    `/location/districts/${provinceCode}`,
  );
  return response.data.data;
};

export const fetchWards = async (districtCode: string): Promise<Ward[]> => {
  const response = await apiClient.get<{ data: Ward[] }>(
    `/location/wards/${districtCode}`,
  );
  return response.data.data;
};
