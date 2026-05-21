"use client";

import CrudPage from "@/components/shared/CrudPage";
import StatusBadge from "@/components/shared/StatusBadge";
import { formatDate } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { FileText, Download } from "lucide-react";

export default function CongesPage() {
  const t = useTranslations();

  return (
    <CrudPage
      title={t("nav.conges")}
      apiEndpoint="/api/conges"
      statusField="statut"
      fields={[
        { key: "etudiant_nom", label: "Étudiant", type: "text", required: true },
        { key: "email", label: "Email", type: "email" },
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
        { key: "pieces_jointes", label: "Pièces jointes (JSON)", type: "textarea" },
      ]}
      columns={[
        { key: "etudiant_nom", label: "Étudiant", render: (v) => <span className="font-medium">{v as string}</span> },
        { key: "type_conge", label: "Type" },
        { key: "date_debut", label: "Début", render: (v) => formatDate(v as string) },
        { key: "date_fin", label: "Fin", render: (v) => formatDate(v as string) },
        { key: "pieces_jointes", label: "Documents", render: (v) => {
          if (!v) return <span className="text-gray-400">-</span>;
          const files = typeof v === "string" ? (() => { try { return JSON.parse(v); } catch { return []; } })() : v;
          if (files.length === 0) return <span className="text-gray-400">-</span>;
          return <div className="flex flex-wrap gap-1">{files.map((f: any) => <a key={f.id} href={f.url} target="_blank" className="flex items-center gap-0.5 text-xs bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded hover:bg-blue-100"><FileText className="w-3 h-3" /> Voir</a>)}</div>;
        }},
        { key: "statut", label: "Statut", render: (v) => <StatusBadge status={v as string} /> },
        { key: "date_demande", label: "Date demande", render: (v) => formatDate(v as string) },
      ]}
    />
  );
}
