"use client";

import { useState } from "react";
import CrudPage from "@/components/shared/CrudPage";
import StatusBadge from "@/components/shared/StatusBadge";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";

export default function AudiencesPage() {
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState("");

  return (
    <div>
      <CrudPage
        title="Demandes d'audience"
        apiEndpoint="/api/doleances"
        statusField="statut"
        fields={[
          { key: "etudiant_nom", label: "Nom", type: "text" },
          { key: "etudiant_prenom", label: "Prénom", type: "text" },
          { key: "telephone", label: "Téléphone", type: "tel" },
          { key: "email", label: "Email", type: "email" },
          { key: "titre", label: "Motif", type: "text", required: true },
          { key: "description", label: "Description", type: "textarea" },
          { key: "statut", label: "Statut", type: "select", options: [
            { value: "Nouveau", label: "Nouveau" }, { value: "En cours", label: "En cours" },
            { value: "Résolu", label: "Résolu" }, { value: "Rejeté", label: "Rejeté" },
          ]},
          { key: "reponse_admin", label: "Réponse", type: "textarea" },
        ]}
        columns={[
          { key: "titre", label: "Motif", render: (v) => <span className="font-medium">{v as string}</span> },
          { key: "etudiant_nom", label: "Demandeur", render: (v, r) => `${r.etudiant_prenom} ${v}` },
          { key: "telephone", label: "Téléphone" },
          { key: "statut", label: "Statut", render: (v) => <StatusBadge status={v as string} /> },
          { key: "date_soumission", label: "Date", render: (v) => formatDate(v as string) },
        ]}
      />
    </div>
  );
}
