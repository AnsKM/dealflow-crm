import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { Plus, Filter } from "lucide-react";
import { DealCard } from "../components/deals/DealCard";
import { DealForm } from "../components/deals/DealForm";
import { dealsApi } from "../services/api";
import type { DealCreate } from "../types";
import { DealStage } from "../types";
import { getStageLabel } from "../utils/format";

export const DealsList = () => {
  const [showForm, setShowForm] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const stageParam = (searchParams.get("stage") as DealStage) || "";
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["deals", stageParam],
    queryFn: () => dealsApi.list(stageParam || undefined),
  });

  const createMutation = useMutation({
    mutationFn: (data: DealCreate) => dealsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deals"] });
      setShowForm(false);
    },
  });

  const handleCreateDeal = (data: DealCreate) => {
    const cleanedData = {
      ...data,
      expected_close_date: data.expected_close_date ? data.expected_close_date : null,
      notes: data.notes || null,
      contact_person: data.contact_person || null,
      contact_email: data.contact_email || null,
      contact_phone: data.contact_phone || null,
    };
    createMutation.mutate(cleanedData as DealCreate);
  };

  const handleStageChange = (value: string) => {
    if (value) setSearchParams({ stage: value });
    else setSearchParams({});
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Deal Pipeline</h1>
          <p className="text-gray-600 mt-1">{data?.total || 0} Deals insgesamt</p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <select
              value={stageParam}
              onChange={(e) => handleStageChange(e.target.value)}
              className="input py-2"
            >
              <option value="">Alle Stages</option>
              {Object.values(DealStage).map((stage) => (
                <option key={stage} value={stage}>
                  {getStageLabel(stage)}
                </option>
              ))}
            </select>
          </div>

          <button onClick={() => setShowForm(true)} className="btn btn-primary flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Neuer Deal</span>
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="text-gray-600 mt-4">Deals werden geladen...</p>
        </div>
      )}

      {!isLoading && data && (
        <>
          {data.deals.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Keine Deals gefunden. Erstellen Sie Ihren ersten Deal!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.deals.map((deal) => (
                <DealCard key={deal.id} deal={deal} />
              ))}
            </div>
          )}
        </>
      )}

      {showForm && (
        <DealForm
          onSubmit={handleCreateDeal}
          onClose={() => setShowForm(false)}
          isLoading={createMutation.isPending}
        />
      )}
    </div>
  );
};
