import { CreateCar, CarResponse } from "@utoto/shared";
import apiClient from "@/lib/axios";

export const createCar = async (data: CreateCar): Promise<CarResponse> => {
  const response = await apiClient.post<{ data: CarResponse }>("/car", data);
  return response.data.data;
};
