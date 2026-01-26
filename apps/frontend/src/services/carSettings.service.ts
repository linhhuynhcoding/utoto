import api from "./api";
import { CarSettingsResponse } from "@utoto/shared";

export const fetchCarSettings = async (): Promise<CarSettingsResponse> => {
  const response = await api.get<CarSettingsResponse>("/car/car-settings");
  return response as any;
};
