import { useQuery } from "@tanstack/react-query";
import { dealsApi } from "../services/api";
import { DashboardCharts } from "../components/dashboard/DashboardCharts";

export const Analytics = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["deals", "analytics"],
    queryFn: () => dealsApi.list(),
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
      </div>

      {isLoading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="text-gray-600 mt-4">Daten werden geladen...</p>
        </div>
      )}

      {!isLoading && data && data.deals.length > 0 && (
        <DashboardCharts deals={data.deals} />
      )}
    </div>
  );
};
