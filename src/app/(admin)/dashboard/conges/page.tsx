"use client";

import CrudPage from "@/components/shared/CrudPage";
import StatusBadge from "@/components/shared/StatusBadge";
import { formatDate } from "@/lib/utils";
import { useTranslations } from "next-intl";

export default function CongesPage() {
  const t = useTranslations();

  return (
    <CrudPage
      title={t("nav.conges")}
      apiEndpoint="/api/conges"
      statusField="statut"
      fields={[
        { key: "etudiant_nom", label: "Étudiant", type: "text", required: true },
        { key: "type_conge", label: "Type", type: "select", options: [
          { value: "Congé médical", label: "Congé médical" },
          { value: "Congé familial", label: "Congé familial" },
          { value: "Congé académique", label: "Congé académique" },
          { value: "Autre", label: "Autre" },
        ]},
        { key: "motif", label: "Motif", type: "textarea", required: true },
        { key: "date_debut", label: "Date début", type: "date", required: true },
        { key: "date_fin", label: "Date fin", type: "date", required: true },
        { key: "statut", label: "Statut", type: "select", options: [
          { value: "Demande", label: "Demande" },
          { value: "Approuvé", label: "Approuvé" },
          { value: "Refusé", label: "Refusé" },
          { value: "Terminé", label: "Terminé" },
        ]},
        { key: "observations", label: "Observations", type: "textarea" },
      ]}
      columns={[
        { key: "etudiant_nom", label: "Étudiant", render: (v) => <span className="font-medium">{v as string}</span> },
        { key: "type_conge", label: "Type" },
        { key: "date_debut", label: "Début", render: (v) => formatDate(v as string) },
        { key: "date_fin", label: "Fin", render: (v) => formatDate(v as string) },
        { key: "statut", label: "Statut", render: (v) => <StatusBadge status={v as string} /> },
        { key: "date_demande", label: "Date demande", render: (v) => formatDate(v as string) },
      ]}
    />
  );
}
