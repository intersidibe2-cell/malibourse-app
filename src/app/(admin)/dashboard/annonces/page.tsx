"use client";

import CrudPage from "@/components/shared/CrudPage";
import StatusBadge from "@/components/shared/StatusBadge";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const categorieColors: Record<string, string> = {
  "Note officielle": "bg-blue-100 text-blue-700",
  "Communiqué": "bg-purple-100 text-purple-700",
  "Information": "bg-green-100 text-green-700",
  "Avis": "bg-yellow-100 text-yellow-700",
  "Urgent": "bg-red-100 text-red-700",
};

export default function AnnoncesPage() {
  return (
    <CrudPage
      title="Annonces & Communiqués"
      apiEndpoint="/api/annonces"
      statusField="statut"
      fields={[
        { key: "titre", label: "Titre", type: "text", required: true },
        { key: "contenu", label: "Contenu", type: "textarea", required: true },
        { key: "categorie", label: "Catégorie", type: "select", options: [
          { value: "Note officielle", label: "Note officielle" },
          { value: "Communiqué", label: "Communiqué" },
          { value: "Information", label: "Information" },
          { value: "Avis", label: "Avis" },
          { value: "Urgent", label: "Urgent" },
        ]},
        { key: "date_publication", label: "Date publication", type: "date" },
        { key: "statut", label: "Statut", type: "select", options: [
          { value: "Brouillon", label: "Brouillon" },
          { value: "Publié", label: "Publié" },
        ]},
      ]}
      columns={[
        { key: "titre", label: "Titre", render: (v) => <span className="font-medium">{v as string}</span> },
        { key: "categorie", label: "Catégorie", render: (v) => (
          <Badge className={categorieColors[v as string] || ""}>{v as string}</Badge>
        )},
        { key: "contenu", label: "Contenu", render: (v) => (
          <span className="text-xs text-gray-500 line-clamp-2 max-w-xs">{v as string}</span>
        )},
        { key: "statut", label: "Statut", render: (v) => <StatusBadge status={v as string} /> },
        { key: "date_publication", label: "Date", render: (v) => formatDate(v as string) },
      ]}
    />
  );
}
