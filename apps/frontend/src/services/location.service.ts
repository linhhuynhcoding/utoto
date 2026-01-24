import { Province, District, Ward } from "@utoto/shared";
import api from "./api";

export const fetchProvinces = async (): Promise<Province[]> => {
  const response = await api.get<{ data: Province[] }>("/location/provinces");
  return (response as any).data;
};

export const fetchDistricts = async (
  provinceCode: string,
): Promise<District[]> => {
  const response = await api.get<{ data: District[] }>(
    `/location/districts/${provinceCode}`,
  );
  return (response as any).data;
};

export const fetchWards = async (districtCode: string): Promise<Ward[]> => {
  const response = await api.get<{ data: Ward[] }>(
    `/location/wards/${districtCode}`,
  );
  return (response as any).data;
};
