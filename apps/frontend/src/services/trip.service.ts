import api from "./api";
import { TripResponse, TripFilter } from "@utoto/shared";

export const getMyLendingTrips = async (ownerId: string) => {
  const response = await api.get<{
    success: boolean;
    trips: TripResponse[];
    total: number;
  }>("/trip", {
    params: {
      owner_id: ownerId,
    },
  });
  return response as any;
};
