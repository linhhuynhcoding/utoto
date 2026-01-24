import { useQuery } from "@tanstack/react-query";
import { getCarById } from "@/services/car.service";

export function useCarDetail(id: string | undefined) {
  return useQuery({
    queryKey: ["car-detail", id],
    queryFn: () => (id ? getCarById(id) : Promise.resolve(null)),
    enabled: !!id,
  });
}
