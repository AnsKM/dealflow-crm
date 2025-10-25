import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import {
  MessageSquare,
  Phone,
  Mail,
  Calendar,
  RefreshCw,
  Plus,
} from "lucide-react";
import { activitiesApi } from "../../services/api";
import type { ActivityCreate } from "../../types";
import { ActivityType } from "../../types";
import { formatDateTime } from "../../utils/format";

interface ActivityTimelineProps {
  dealId: number;
}

const activityIcons = {
  [ActivityType.NOTE]: MessageSquare,
  [ActivityType.CALL]: Phone,
  [ActivityType.EMAIL]: Mail,
  [ActivityType.MEETING]: Calendar,
  [ActivityType.STAGE_CHANGE]: RefreshCw,
  [ActivityType.SYSTEM]: RefreshCw,
};

export const ActivityTimeline = ({ dealId }: ActivityTimelineProps) => {
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{
    activity_type: ActivityType;
    title: string;
    description?: string;
  }>();

  // Fetch activities
  const { data: activities, isLoading } = useQuery({
    queryKey: ["activities", dealId],
    queryFn: () => activitiesApi.list(dealId),
  });

  // Create activity mutation
  const createMutation = useMutation({
    mutationFn: (data: ActivityCreate) => activitiesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities", dealId] });
      queryClient.invalidateQueries({ queryKey: ["deal", String(dealId)] });
      reset();
      setShowForm(false);
    },
  });

  const onSubmit = (data: {
    activity_type: ActivityType;
    title: string;
    description?: string;
  }) => {
    createMutation.mutate({
      deal_id: dealId,
      ...data,
    });
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Aktivitäten</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-secondary flex items-center space-x-2 text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Aktivität hinzufügen</span>
        </button>
      </div>

      {/* Add Activity Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mb-6 p-4 bg-gray-50 rounded-lg space-y-3"
        >
          <div>
            <label className="label">Typ</label>
            <select
              {...register("activity_type", { required: true })}
              className="input"
            >
              <option value={ActivityType.NOTE}>Notiz</option>
              <option value={ActivityType.CALL}>Anruf</option>
              <option value={ActivityType.EMAIL}>E-Mail</option>
              <option value={ActivityType.MEETING}>Meeting</option>
            </select>
          </div>

          <div>
            <label className="label">Titel</label>
            <input
              type="text"
              {...register("title", { required: "Titel ist erforderlich" })}
              className="input"
              placeholder="z.B. Follow-up Anruf"
            />
            {errors.title && (
              <p className="text-sm text-red-600 mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label className="label">Beschreibung</label>
            <textarea
              {...register("description")}
              className="input"
              rows={2}
              placeholder="Details..."
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="btn btn-secondary text-sm"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              className="btn btn-primary text-sm"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? "Speichert..." : "Speichern"}
            </button>
          </div>
        </form>
      )}

      {/* Timeline */}
      {isLoading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : activities && activities.length > 0 ? (
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = activityIcons[activity.activity_type];
            return (
              <div
                key={activity.id}
                className="flex items-start space-x-3 pb-4 border-b border-gray-200 last:border-0"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-gray-900">
                      {activity.title}
                    </h4>
                    <span className="text-xs text-gray-500">
                      {formatDateTime(activity.created_at)}
                    </span>
                  </div>
                  {activity.description && (
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">
                      {activity.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-gray-600 py-8">
          Noch keine Aktivitäten vorhanden.
        </p>
      )}
    </div>
  );
};
