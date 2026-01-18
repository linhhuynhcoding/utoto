import envConfig from "@/config";
import { CarSettingsResponse } from "@utoto/shared";

export const fetchCarSettings = async (): Promise<CarSettingsResponse> => {
  const response = await fetch(`${envConfig.API_URL}/car/car-settings`);
  if (!response.ok) {
    throw new Error("Failed to fetch car settings");
  }
  return response.json();
};
