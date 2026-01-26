import { useMutation } from "@tanstack/react-query";
import { createCar, updateCar, deleteCar } from "@/services/car.service";
import { CreateCar, CarResponse } from "@utoto/shared";

export const useRegisterCar = () => {
  return useMutation<CarResponse, Error, CreateCar>({
    mutationFn: createCar,
    onSuccess: (data) => {
      console.log("Car registered successfully:", data);
    },
    onError: (error) => {
      console.error("Failed to register car:", error);
    },
  });
};

export const useUpdateCar = () => {
  return useMutation<
    CarResponse,
    Error,
    { id: string; data: Partial<CreateCar> }
  >({
    mutationFn: ({ id, data }) => updateCar(id, data),
    onSuccess: (data) => {
      console.log("Car updated successfully:", data);
    },
    onError: (error) => {
      console.error("Failed to update car:", error);
    },
  });
};

export const useDeleteCar = () => {
  return useMutation<void, Error, string>({
    mutationFn: deleteCar,
    onSuccess: () => {
      console.log("Car deleted successfully");
    },
    onError: (error) => {
      console.error("Failed to delete car:", error);
    },
  });
};
