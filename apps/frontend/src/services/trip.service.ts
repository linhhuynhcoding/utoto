import api from "./api";
import { TripResponse, CreateTrip } from "@utoto/shared";

export const createTrip = async (
  data: CreateTrip,
): Promise<{ success: boolean; data: TripResponse }> => {
  return (await api.post("/trip", data)) as any;
};

export const getMyTrips = async (
  renterId: string,
): Promise<{ trips: TripResponse[]; total: number }> => {
  const response = await api.get<{
    success: boolean;
    trips: TripResponse[];
    total: number;
  }>("/trip", {
    params: {
      renter_id: renterId,
    },
  });
  return {
    trips: (response as any).trips,
    total: (response as any).total,
  };
};

export const getMyLendingTrips = async (
  ownerId: string,
): Promise<{ trips: TripResponse[]; total: number }> => {
  const response = await api.get<{
    success: boolean;
    trips: TripResponse[];
    total: number;
  }>("/trip", {
    params: {
      owner_id: ownerId,
    },
  });
  return {
    trips: (response as any).trips,
    total: (response as any).total,
  };
};

export const updateTrip = async (
  id: string,
  data: Partial<TripResponse>,
): Promise<{ success: boolean; data: TripResponse }> => {
  return (await api.patch(`/trip/${id}`, data)) as any;
};
