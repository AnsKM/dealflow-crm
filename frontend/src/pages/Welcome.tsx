import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { DealForm } from "../components/deals/DealForm";
import { dealsApi } from "../services/api";
import type { DealCreate } from "../types";

export const Welcome = () => {
  const navigate = useNavigate();

  const createMutation = useMutation({
    mutationFn: (data: DealCreate) => dealsApi.create(data),
    onSuccess: () => {
      navigate("/app/overview");
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

  return (
    <div>
      <div className="max-w-2xl mx-auto text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Willkommen bei DealFlow</h1>
        <p className="text-gray-600 mt-2">Erstellen Sie Ihren ersten Deal oder überspringen Sie diesen Schritt.</p>
        <div className="mt-4">
          <button onClick={() => navigate("/app/overview")} className="btn btn-secondary">Überspringen</button>
        </div>
      </div>
      <DealForm onSubmit={handleCreateDeal} onClose={() => navigate("/app/overview")} isLoading={createMutation.isPending} />
    </div>
  );
};
