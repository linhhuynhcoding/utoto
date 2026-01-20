import apiClient from "@/lib/axios";
import { CarSettingsResponse } from "@utoto/shared";

export const fetchCarSettings = async (): Promise<CarSettingsResponse> => {
  const response =
    await apiClient.get<CarSettingsResponse>("/car/car-settings");
  return response.data;
};
