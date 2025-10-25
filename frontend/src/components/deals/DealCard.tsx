import { useNavigate } from "react-router-dom";
import { Building2, Calendar, TrendingUp, Circle } from "lucide-react";
import type { Deal } from "../../types";
import {
  formatCurrency,
  formatRelativeTime,
  getHealthScoreColor,
  getStageLabel,
  getStageColor,
} from "../../utils/format";
import clsx from "clsx";

interface DealCardProps {
  deal: Deal;
}

export const DealCard = ({ deal }: DealCardProps) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/deals/${deal.id}`)}
      className="card hover:shadow-md cursor-pointer transition-shadow"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {deal.title}
          </h3>
          <div className="flex items-center text-sm text-gray-600">
            <Building2 className="w-4 h-4 mr-1" />
            {deal.company_name}
          </div>
        </div>

        {/* Health Score */}
        <div
          className={clsx(
            "px-3 py-1 rounded-full text-xs font-semibold",
            getHealthScoreColor(deal.health_score),
          )}
        >
          {deal.health_score}%
        </div>
      </div>

      {/* Value and Stage */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center text-gray-900 font-semibold">
          <TrendingUp className="w-4 h-4 mr-1 text-green-600" />
          {formatCurrency(Number(deal.value))}
        </div>

        <span
          className={clsx(
            "px-3 py-1 rounded-full text-xs font-medium",
            getStageColor(deal.stage),
          )}
        >
          {getStageLabel(deal.stage)}
        </span>
      </div>

      {/* Last Contact */}
      {deal.last_contact_at && (
        <div className="flex items-center text-sm text-gray-600 mb-3">
          <Calendar className="w-4 h-4 mr-1" />
          Letzter Kontakt: {formatRelativeTime(deal.last_contact_at)}
        </div>
      )}

      {/* AI Next Actions Preview */}
      {deal.next_actions && deal.next_actions.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs font-medium text-gray-700 mb-2">
            Nächste Schritte:
          </p>
          <div className="space-y-1">
            {deal.next_actions.slice(0, 2).map((action, idx) => (
              <div key={idx} className="flex items-start text-xs text-gray-600">
                <Circle className="w-2 h-2 mr-2 mt-1 flex-shrink-0" />
                <span className="line-clamp-1">{action}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
