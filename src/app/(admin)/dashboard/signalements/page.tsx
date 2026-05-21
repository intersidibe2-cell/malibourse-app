"use client";

import CrudPage from "@/components/shared/CrudPage";
import StatusBadge from "@/components/shared/StatusBadge";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const urgenceColors: Record<string, string> = {
  Normale: "bg-gray-100 text-gray-700",
  Urgente: "bg-orange-100 text-orange-700",
  Critique: "bg-red-100 text-red-700",
};

const typeColors: Record<string, string> = {
  Incident: "bg-blue-100 text-blue-700",
  Urgence: "bg-red-100 text-red-700",
  Critique: "bg-purple-100 text-purple-700",
  Suggestion: "bg-green-100 text-green-700",
};

export default function SignalementsPage() {
  return (
    <CrudPage
      title="Signalements"
      apiEndpoint="/api/signalements"
      statusField="statut"
      fields={[
        { key: "nom_complet", label: "Nom complet", type: "text" },
        { key: "telephone", label: "Téléphone", type: "tel" },
        { key: "email", label: "Email", type: "email" },
        { key: "type_signalement", label: "Type", type: "select", options: [
          { value: "Incident", label: "Incident" },
          { value: "Urgence", label: "Urgence" },
          { value: "Critique", label: "Critique" },
          { value: "Suggestion", label: "Suggestion" },
        ]},
        { key: "titre", label: "Titre", type: "text", required: true },
        { key: "description", label: "Description", type: "textarea", required: true },
        { key: "lieu", label: "Lieu", type: "text" },
        { key: "urgence", label: "Niveau urgence", type: "select", options: [
          { value: "Normale", label: "Normale" },
          { value: "Urgente", label: "Urgente" },
          { value: "Critique", label: "Critique" },
        ]},
        { key: "statut", label: "Statut", type: "select", options: [
          { value: "Nouveau", label: "Nouveau" },
          { value: "En cours", label: "En cours" },
          { value: "Traité", label: "Traité" },
          { value: "Rejeté", label: "Rejeté" },
        ]},
        { key: "reponse_admin", label: "Réponse", type: "textarea" },
        { key: "observations", label: "Observations", type: "textarea" },
      ]}
      columns={[
        { key: "urgence", label: "Urgence", render: (v) => (
          <Badge className={urgenceColors[v as string] || ""}>{v as string}</Badge>
        )},
        { key: "type_signalement", label: "Type", render: (v) => (
          <Badge className={typeColors[v as string] || ""}>{v as string}</Badge>
        )},
        { key: "titre", label: "Titre", render: (v) => <span className="font-medium">{v as string}</span> },
        { key: "nom_complet", label: "Signalé par" },
        { key: "statut", label: "Statut", render: (v) => <StatusBadge status={v as string} /> },
        { key: "date_soumission", label: "Date", render: (v) => formatDate(v as string) },
      ]}
    />
  );
}
