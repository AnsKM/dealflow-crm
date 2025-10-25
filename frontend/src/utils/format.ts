import { format as dateFnsFormat } from "date-fns";
import { de } from "date-fns/locale";

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
};

export const formatDate = (date: string | Date): string => {
  return dateFnsFormat(new Date(date), "dd.MM.yyyy", { locale: de });
};

export const formatDateTime = (date: string | Date): string => {
  return dateFnsFormat(new Date(date), "dd.MM.yyyy HH:mm", { locale: de });
};

export const formatRelativeTime = (date: string | Date): string => {
  const now = new Date();
  const then = new Date(date);
  const diffInDays = Math.floor(
    (now.getTime() - then.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffInDays === 0) return "Heute";
  if (diffInDays === 1) return "Gestern";
  if (diffInDays < 7) return `vor ${diffInDays} Tagen`;
  if (diffInDays < 30) return `vor ${Math.floor(diffInDays / 7)} Wochen`;
  if (diffInDays < 365) return `vor ${Math.floor(diffInDays / 30)} Monaten`;
  return `vor ${Math.floor(diffInDays / 365)} Jahren`;
};

export const getHealthScoreColor = (score: number): string => {
  if (score >= 70) return "text-green-600 bg-green-100";
  if (score >= 40) return "text-yellow-600 bg-yellow-100";
  return "text-red-600 bg-red-100";
};

export const getStageLabel = (stage: string): string => {
  const labels: Record<string, string> = {
    lead: "Lead",
    qualified: "Qualifiziert",
    proposal: "Angebot",
    negotiation: "Verhandlung",
    closed_won: "Gewonnen",
    closed_lost: "Verloren",
  };
  return labels[stage] || stage;
};

export const getStageColor = (stage: string): string => {
  const colors: Record<string, string> = {
    lead: "bg-gray-200 text-gray-800",
    qualified: "bg-blue-200 text-blue-800",
    proposal: "bg-purple-200 text-purple-800",
    negotiation: "bg-orange-200 text-orange-800",
    closed_won: "bg-green-200 text-green-800",
    closed_lost: "bg-red-200 text-red-800",
  };
  return colors[stage] || "bg-gray-200 text-gray-800";
};
