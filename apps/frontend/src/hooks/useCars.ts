import { useMutation } from "@tanstack/react-query";
import { createCar } from "@/api/cars";
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
