import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, TrendingUp, Calendar, Target } from "lucide-react";
import { dealsApi } from "../../services/api";
import { formatCurrency } from "../../utils/format";
import { useNavigate } from "react-router-dom";

export const InsightsPanel = () => {
  const navigate = useNavigate();

  const {
    data: insights,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["insights"],
    queryFn: () => dealsApi.getInsights(),
    refetchInterval: 60000, // Refresh every minute
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
        <div className="card animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !insights) {
    return null;
  }

  const { summary, weekly_summary, at_risk_deals } = insights;

  return (
    <div className="space-y-6 mb-8">
      {/* Weekly Summary Banner */}
      {weekly_summary && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md">
          <div className="flex items-center">
            <Target className="w-5 h-5 text-blue-500 mr-3" />
            <p className="text-sm font-medium text-blue-900">
              {weekly_summary}
            </p>
          </div>
        </div>
      )}

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Deals */}
        <div className="card bg-gradient-to-br from-blue-50 to-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Aktive Deals</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {summary.active_deals}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        {/* Pipeline Value */}
        <div className="card bg-gradient-to-br from-green-50 to-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pipeline Wert</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {formatCurrency(summary.pipeline_value)}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </div>

        {/* At Risk */}
        <div className="card bg-gradient-to-br from-orange-50 to-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Deals gefährdet
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {summary.at_risk_count}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {formatCurrency(summary.revenue_at_risk)} at risk
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-orange-600" />
          </div>
        </div>

        {/* Closing Soon */}
        <div className="card bg-gradient-to-br from-purple-50 to-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Schließen bald
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {summary.closing_soon_count}
              </p>
              <p className="text-xs text-gray-500 mt-1">Nächste 14 Tage</p>
            </div>
            <Calendar className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* At-Risk Deals Alert */}
      {at_risk_deals.length > 0 && (
        <div className="card border-l-4 border-red-500">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">
                Deals benötigen Aufmerksamkeit
              </h3>
            </div>
            <span className="text-sm text-gray-600">
              Top {at_risk_deals.length} gefährdete Deals
            </span>
          </div>

          <div className="space-y-3">
            {at_risk_deals.map((deal) => (
              <div
                key={deal.id}
                onClick={() => navigate(`/app/deals/${deal.id}`)}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{deal.title}</p>
                  <p className="text-sm text-gray-600">{deal.company_name}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {formatCurrency(Number(deal.value))}
                  </p>
                  <div className="flex items-center justify-end mt-1">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        deal.health_score < 30
                          ? "bg-red-100 text-red-800"
                          : "bg-orange-100 text-orange-800"
                      }`}
                    >
                      {deal.health_score}% Health
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {at_risk_deals.length === 0 && (
            <p className="text-sm text-gray-600 text-center py-4">
              Keine gefährdeten Deals - Ihre Pipeline ist gesund!
            </p>
          )}
        </div>
      )}

      {/* Average Health Score */}
      <div className="card">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-600">
            Durchschnittlicher Health Score
          </h3>
          <span className="text-2xl font-bold text-gray-900">
            {summary.average_health_score}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all ${
              summary.average_health_score >= 70
                ? "bg-green-500"
                : summary.average_health_score >= 50
                  ? "bg-yellow-500"
                  : "bg-red-500"
            }`}
            style={{ width: `${summary.average_health_score}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};
