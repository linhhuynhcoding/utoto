import envConfig from "@/config";
import { Province, District, Ward } from "@utoto/shared";

export const fetchProvinces = async (): Promise<Province[]> => {
  const response = await fetch(`${envConfig.API_URL}/location/provinces`);
  if (!response.ok) {
    throw new Error("Failed to fetch provinces");
  }
  const result = await response.json();
  return result.data;
};

export const fetchDistricts = async (
  provinceCode: string,
): Promise<District[]> => {
  const response = await fetch(
    `${envConfig.API_URL}/location/districts/${provinceCode}`,
  );
  if (!response.ok) {
    throw new Error("Failed to fetch districts");
  }
  const result = await response.json();
  return result.data;
};

export const fetchWards = async (districtCode: string): Promise<Ward[]> => {
  const response = await fetch(
    `${envConfig.API_URL}/location/wards/${districtCode}`,
  );
  if (!response.ok) {
    throw new Error("Failed to fetch wards");
  }
  const result = await response.json();
  return result.data;
};
