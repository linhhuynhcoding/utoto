import api from "./api";
import { CarResponse, CarCalendarResponse, CreateCar } from "@utoto/shared";

export const getMyCars = async (ownerId: string): Promise<CarResponse[]> => {
  const response = await api.get<{ success: boolean; items: CarResponse[] }>(
    "/car/search",
    {
      params: {
        owner_id: ownerId,
      },
    },
  );
  return (response as any).items;
};

export const createCar = async (data: CreateCar): Promise<CarResponse> => {
  const response = await api.post<{ data: CarResponse }>("/car", data);
  return (response as any).data;
};

export const getFeaturedCars = async (): Promise<CarResponse[]> => {
  const response = await api.get<{
    success: boolean;
    items: CarResponse[];
    total: number;
  }>("/car/search", {
    params: {
      limit: 8,
      page: 1,
    },
  });
  return (response as any).items;
};

export const searchCars = async (
  params: Record<string, any>,
): Promise<{ items: CarResponse[]; total: number }> => {
  const response = await api.get<{
    success: boolean;
    items: CarResponse[];
    total: number;
  }>("/car/search", {
    params,
  });
  return {
    items: (response as any).items,
    total: (response as any).total,
  };
};

export const getCarById = async (id: string): Promise<CarResponse | null> => {
  const response = await api.get<{ success: boolean; data: CarResponse }>(
    `/car/${id}`,
  );
  return (response as any).data;
};

export const getCarCalendar = async (
  carId: string,
): Promise<CarCalendarResponse> => {
  return await api.get(`/car/${carId}/calendar`);
};

export const updateCar = async (
  id: string,
  data: Partial<CreateCar>,
): Promise<CarResponse> => {
  const response = await api.put<{ data: CarResponse }>(`/car/${id}`, data);
  return (response as any).data;
};

export const deleteCar = async (id: string): Promise<void> => {
  await api.delete(`/car/${id}`);
};
