import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  Calendar,
  TrendingUp,
  Trash2,
  Edit,
  Sparkles,
} from "lucide-react";
import { Layout } from "../components/layout/Layout";
import { ActivityTimeline } from "../components/deals/ActivityTimeline";
import { dealsApi } from "../services/api";
import {
  formatCurrency,
  formatDate,
  getHealthScoreColor,
  getStageLabel,
  getStageColor,
} from "../utils/format";
import clsx from "clsx";
import type { DealUpdate } from "../types";
import { DealStage } from "../types";

export const DealDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editedStage, setEditedStage] = useState<DealStage | null>(null);

  // Fetch deal
  const {
    data: deal,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["deal", id],
    queryFn: () => dealsApi.get(Number(id)),
    enabled: !!id,
  });

  // Update deal mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: DealUpdate }) =>
      dealsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deal", id] });
      queryClient.invalidateQueries({ queryKey: ["deals"] });
      setIsEditing(false);
      setEditedStage(null);
    },
  });

  // Delete deal mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => dealsApi.delete(id),
    onSuccess: () => {
      navigate("/dashboard");
    },
  });

  const handleStageChange = (newStage: DealStage) => {
    if (id) {
      updateMutation.mutate({
        id: Number(id),
        data: { stage: newStage },
      });
    }
  };

  const handleDelete = () => {
    if (
      id &&
      window.confirm("Sind Sie sicher, dass Sie diesen Deal löschen möchten?")
    ) {
      deleteMutation.mutate(Number(id));
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  if (error || !deal) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-red-600">Deal nicht gefunden.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Back Button */}
      <button
        onClick={() => navigate("/dashboard")}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Zurück zur Übersicht
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Deal Header */}
          <div className="card">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {deal.title}
                </h1>
                <div className="flex items-center text-gray-600 mb-4">
                  <Building2 className="w-5 h-5 mr-2" />
                  <span className="text-lg">{deal.company_name}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  title="Bearbeiten"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  title="Löschen"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-2 mb-4">
              {deal.contact_person && (
                <p className="text-gray-700">
                  <span className="font-medium">Ansprechpartner:</span>{" "}
                  {deal.contact_person}
                </p>
              )}
              {deal.contact_email && (
                <div className="flex items-center text-gray-700">
                  <Mail className="w-4 h-4 mr-2" />
                  <a
                    href={`mailto:${deal.contact_email}`}
                    className="hover:text-primary-600"
                  >
                    {deal.contact_email}
                  </a>
                </div>
              )}
              {deal.contact_phone && (
                <div className="flex items-center text-gray-700">
                  <Phone className="w-4 h-4 mr-2" />
                  <a
                    href={`tel:${deal.contact_phone}`}
                    className="hover:text-primary-600"
                  >
                    {deal.contact_phone}
                  </a>
                </div>
              )}
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600 mb-1">Deal-Wert</p>
                <div className="flex items-center text-lg font-semibold text-gray-900">
                  <TrendingUp className="w-5 h-5 mr-1 text-green-600" />
                  {formatCurrency(Number(deal.value))}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Health Score</p>
                <div
                  className={clsx(
                    "inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold",
                    getHealthScoreColor(deal.health_score),
                  )}
                >
                  {deal.health_score}%
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  Erwarteter Abschluss
                </p>
                <div className="flex items-center text-sm font-medium text-gray-900">
                  <Calendar className="w-4 h-4 mr-1" />
                  {deal.expected_close_date
                    ? formatDate(deal.expected_close_date)
                    : "Nicht festgelegt"}
                </div>
              </div>
            </div>

            {/* Stage Selection */}
            <div className="mt-4">
              <label className="label">Stage</label>
              <select
                value={editedStage || deal.stage}
                onChange={(e) => handleStageChange(e.target.value as DealStage)}
                className="input"
                disabled={updateMutation.isPending}
              >
                {Object.values(DealStage).map((stage) => (
                  <option key={stage} value={stage}>
                    {getStageLabel(stage)}
                  </option>
                ))}
              </select>
            </div>

            {/* Notes */}
            {deal.notes && (
              <div className="mt-4">
                <p className="label">Notizen</p>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {deal.notes}
                </p>
              </div>
            )}
          </div>

          {/* Activity Timeline */}
          <ActivityTimeline dealId={deal.id} />
        </div>

        {/* Sidebar - AI Recommendations */}
        <div className="lg:col-span-1">
          <div className="card bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200">
            <div className="flex items-center space-x-2 mb-4">
              <Sparkles className="w-6 h-6 text-primary-600" />
              <h3 className="text-lg font-bold text-gray-900">
                KI-Empfehlungen
              </h3>
            </div>

            {deal.next_actions && deal.next_actions.length > 0 ? (
              <div className="space-y-3">
                <p className="text-sm text-gray-700">
                  Vorgeschlagene nächste Schritte:
                </p>
                <ul className="space-y-2">
                  {deal.next_actions.map((action, idx) => (
                    <li
                      key={idx}
                      className="flex items-start p-3 bg-white rounded-lg shadow-sm"
                    >
                      <span className="flex-shrink-0 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs font-semibold mr-3">
                        {idx + 1}
                      </span>
                      <span className="text-sm text-gray-900">{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-sm text-gray-600">
                Keine Empfehlungen verfügbar.
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};
