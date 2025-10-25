import { useMemo } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
} from "recharts";
import type { Deal } from "../../types";
import { DealStage } from "../../types";
import { getStageLabel } from "../../utils/format";
import { format, subDays, eachDayOfInterval } from "date-fns";
import { de } from "date-fns/locale";

interface DashboardChartsProps {
  deals: Deal[];
}

const STAGE_COLORS: Record<DealStage, string> = {
  [DealStage.LEAD]: "#94a3b8",
  [DealStage.QUALIFIED]: "#60a5fa",
  [DealStage.PROPOSAL]: "#fbbf24",
  [DealStage.NEGOTIATION]: "#f97316",
  [DealStage.CLOSED_WON]: "#22c55e",
  [DealStage.CLOSED_LOST]: "#ef4444",
};

const HEALTH_COLORS = {
  critical: "#ef4444",
  warning: "#f97316",
  good: "#fbbf24",
  excellent: "#22c55e",
};

export const DashboardCharts = ({ deals }: DashboardChartsProps) => {
  // Revenue Pipeline Data (by stage)
  const pipelineData = useMemo(() => {
    const stageMap = new Map<DealStage, number>();

    deals.forEach((deal) => {
      const current = stageMap.get(deal.stage) || 0;
      stageMap.set(deal.stage, current + Number(deal.value));
    });

    return Object.values(DealStage).map((stage) => ({
      stage: getStageLabel(stage),
      value: stageMap.get(stage) || 0,
      color: STAGE_COLORS[stage],
    }));
  }, [deals]);

  // Health Score Distribution
  const healthData = useMemo(() => {
    const distribution = {
      critical: 0,
      warning: 0,
      good: 0,
      excellent: 0,
    };

    deals.forEach((deal) => {
      if (deal.health_score < 40) distribution.critical++;
      else if (deal.health_score < 60) distribution.warning++;
      else if (deal.health_score < 80) distribution.good++;
      else distribution.excellent++;
    });

    return [
      {
        name: "Kritisch (<40%)",
        value: distribution.critical,
        color: HEALTH_COLORS.critical,
      },
      {
        name: "Warnung (40-60%)",
        value: distribution.warning,
        color: HEALTH_COLORS.warning,
      },
      {
        name: "Gut (60-80%)",
        value: distribution.good,
        color: HEALTH_COLORS.good,
      },
      {
        name: "Exzellent (>80%)",
        value: distribution.excellent,
        color: HEALTH_COLORS.excellent,
      },
    ].filter((item) => item.value > 0);
  }, [deals]);

  // Deal Velocity (deals created over last 30 days)
  const velocityData = useMemo(() => {
    const last30Days = eachDayOfInterval({
      start: subDays(new Date(), 29),
      end: new Date(),
    });

    const dealsPerDay = new Map<string, number>();

    deals.forEach((deal) => {
      const dateKey = format(new Date(deal.created_at), "yyyy-MM-dd");
      dealsPerDay.set(dateKey, (dealsPerDay.get(dateKey) || 0) + 1);
    });

    return last30Days.map((day) => {
      const dateKey = format(day, "yyyy-MM-dd");
      return {
        date: format(day, "dd.MM", { locale: de }),
        deals: dealsPerDay.get(dateKey) || 0,
      };
    });
  }, [deals]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Revenue Pipeline Chart */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Pipeline nach Stage
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={pipelineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="stage"
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => formatCurrency(value)}
            />
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              labelStyle={{ color: "#000" }}
            />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              {pipelineData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Health Score Distribution */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Deal Health Verteilung
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={healthData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {healthData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Deal Velocity Trend */}
      <div className="card lg:col-span-2">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Deal Velocity (Letzte 30 Tage)
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={velocityData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
            <Tooltip
              labelStyle={{ color: "#000" }}
              formatter={(value: number) => [`${value} Deals`, "Anzahl"]}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="deals"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: "#3b82f6", r: 4 }}
              name="Neue Deals"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
