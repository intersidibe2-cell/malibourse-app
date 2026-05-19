"use client";

import CrudPage from "@/components/shared/CrudPage";
import StatusBadge from "@/components/shared/StatusBadge";
import { formatDate } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";

export default function DoleancesPage() {
  const t = useTranslations();

  return (
    <CrudPage
      title={t("nav.doleances")}
      apiEndpoint="/api/doleances"
      statusField="statut"
      fields={[
        { key: "etudiant_nom", label: t("form.nom"), type: "text" },
        { key: "etudiant_prenom", label: t("form.prenom"), type: "text" },
        { key: "telephone", label: t("form.telephone"), type: "tel" },
        { key: "email", label: t("form.email"), type: "email" },
        { key: "type", label: t("form.type"), type: "select", options: [
          { value: "Problème de logement", label: "Problème de logement" },
          { value: "Problème académique", label: "Problème académique" },
          { value: "Problème de santé", label: "Problème de santé" },
          { value: "Demande administrative", label: "Demande administrative" },
          { value: "Problème financier", label: "Problème financier" },
          { value: "Autre", label: "Autre" },
        ]},
        { key: "titre", label: t("form.titre"), type: "text", required: true },
        { key: "description", label: t("form.description"), type: "textarea", required: true },
        { key: "priorite", label: t("form.priorite"), type: "select", options: [
          { value: "Faible", label: "Faible" },
          { value: "Normale", label: "Normale" },
          { value: "Urgente", label: "Urgente" },
        ]},
        { key: "statut", label: t("common.status"), type: "select", options: [
          { value: "Nouveau", label: "Nouveau" },
          { value: "En cours", label: "En cours" },
          { value: "Résolu", label: "Résolu" },
          { value: "Rejeté", label: "Rejeté" },
          { value: "Traitée", label: "Traitée" },
        ]},
        { key: "reponse_admin", label: t("form.reponseOfficielle"), type: "textarea" },
      ]}
      columns={[
        { key: "priorite", label: "Priorité", render: (v) => {
          const colors: Record<string, string> = { Faible: "bg-gray-100 text-gray-700", Normale: "bg-blue-100 text-blue-700", Urgente: "bg-red-100 text-red-700" };
          return <Badge className={colors[v as string] || ""}>{v as string}</Badge>;
        }},
        { key: "titre", label: "Titre", render: (v) => <span className="font-medium">{v as string}</span> },
        { key: "type", label: "Type" },
        { key: "statut", label: "Statut", render: (v) => <StatusBadge status={v as string} /> },
        { key: "date_soumission", label: "Date", render: (v) => formatDate(v as string) },
      ]}
    />
  );
}
