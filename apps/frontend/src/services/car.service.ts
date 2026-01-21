import api from "./api";
import { CarResponse, CarFilter } from "@utoto/shared";

export const getMyCars = async (ownerId: string) => {
  const response = await api.get<{ success: boolean; items: CarResponse[] }>(
    "/car",
    {
      params: {
        owner_id: ownerId,
      },
    },
  );
  return response as any; // The interceptor returns data directly, but typescript might be confused.
  // Actually, wait.
  // car.controller searchCars returns { success: true, items: ..., total: ... }
  // My api interceptor returns response.data.
  // So standard axios response structure is gone.
};
