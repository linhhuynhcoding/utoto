import { CreateCar, CarResponse } from "@utoto/shared";
import apiClient from "@/lib/axios";

export const createCar = async (data: CreateCar): Promise<CarResponse> => {
  const response = await apiClient.post<{ data: CarResponse }>("/car", data);
  return response.data.data;
};

export const getFeaturedCars = async (): Promise<CarResponse[]> => {
  const response = await apiClient.get<{
    success: boolean;
    items: CarResponse[];
    total: number;
  }>("/car/search", {
    params: {
      limit: 8,
      page: 1,
    },
  });
  return response.data.items;
};

export const searchCars = async (params: Record<string, any>): Promise<{ items: CarResponse[]; total: number }> => {
  const response = await apiClient.get<{
    success: boolean;
    items: CarResponse[];
    total: number;
  }>("/car/search", {
    params
  });
  return {
    items: response.data.items,
    total: response.data.total
  };
};

export const getCarById = async (id: string): Promise<CarResponse | null> => {
  const response = await apiClient.get<{ success: boolean; data: CarResponse }>(`/car/${id}`);
  return response.data.data;
};
