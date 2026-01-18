import { useQuery } from "@tanstack/react-query";
import { fetchCarSettings } from "@/api/carSettings";

export const useCarSettings = () => {
  return useQuery({
    queryKey: ["car-settings"],
    queryFn: fetchCarSettings,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};
