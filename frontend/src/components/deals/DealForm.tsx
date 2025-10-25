import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import type { DealCreate } from "../../types";
import { DealStage } from "../../types";
import { getStageLabel } from "../../utils/format";

interface DealFormProps {
  onSubmit: (data: DealCreate) => void;
  onClose: () => void;
  isLoading?: boolean;
}

export const DealForm = ({ onSubmit, onClose, isLoading }: DealFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DealCreate>({
    defaultValues: {
      stage: DealStage.LEAD,
    },
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Neuer Deal</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="label">Deal-Titel *</label>
            <input
              type="text"
              {...register("title", { required: "Titel ist erforderlich" })}
              className="input"
              placeholder="z.B. CRM-Software für Vertriebsabteilung"
            />
            {errors.title && (
              <p className="text-sm text-red-600 mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Company Name */}
          <div>
            <label className="label">Firma *</label>
            <input
              type="text"
              {...register("company_name", {
                required: "Firma ist erforderlich",
              })}
              className="input"
              placeholder="z.B. Mustermann GmbH"
            />
            {errors.company_name && (
              <p className="text-sm text-red-600 mt-1">
                {errors.company_name.message}
              </p>
            )}
          </div>

          {/* Contact Person */}
          <div>
            <label className="label">Ansprechpartner</label>
            <input
              type="text"
              {...register("contact_person")}
              className="input"
              placeholder="z.B. Max Mustermann"
            />
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">E-Mail</label>
              <input
                type="email"
                {...register("contact_email")}
                className="input"
                placeholder="max@firma.de"
              />
            </div>
            <div>
              <label className="label">Telefon</label>
              <input
                type="tel"
                {...register("contact_phone")}
                className="input"
                placeholder="+49 123 456789"
              />
            </div>
          </div>

          {/* Value */}
          <div>
            <label className="label">Deal-Wert (EUR) *</label>
            <input
              type="number"
              step="0.01"
              {...register("value", {
                required: "Wert ist erforderlich",
                min: { value: 0, message: "Wert muss positiv sein" },
              })}
              className="input"
              placeholder="10000.00"
            />
            {errors.value && (
              <p className="text-sm text-red-600 mt-1">
                {errors.value.message}
              </p>
            )}
          </div>

          {/* Stage */}
          <div>
            <label className="label">Stage</label>
            <select {...register("stage")} className="input">
              {Object.values(DealStage)
                .filter(
                  (s) =>
                    s !== DealStage.CLOSED_WON && s !== DealStage.CLOSED_LOST,
                )
                .map((stage) => (
                  <option key={stage} value={stage}>
                    {getStageLabel(stage)}
                  </option>
                ))}
            </select>
          </div>

          {/* Expected Close Date */}
          <div>
            <label className="label">Erwartetes Abschlussdatum</label>
            <input
              type="date"
              {...register("expected_close_date")}
              className="input"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="label">Notizen</label>
            <textarea
              {...register("notes")}
              className="input"
              rows={3}
              placeholder="Zusätzliche Informationen..."
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              disabled={isLoading}
            >
              Abbrechen
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? "Speichert..." : "Deal erstellen"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
