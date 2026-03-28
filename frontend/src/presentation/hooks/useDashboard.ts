import { useQuery } from "@tanstack/react-query";
import { fetchDashboard } from "@/infrastructure/repositories/dashboardRepository";

export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboard,
    staleTime: 1000 * 60 * 2, // 2 minutos
  });
}
