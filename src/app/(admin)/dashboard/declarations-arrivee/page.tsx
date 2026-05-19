"use client";

import CrudPage from "@/components/shared/CrudPage";
import StatusBadge from "@/components/shared/StatusBadge";
import { formatDate } from "@/lib/utils";
import { useTranslations } from "next-intl";

export default function DeclarationsArriveePage() {
  const t = useTranslations();

  return (
    <CrudPage
      title={t("nav.declarationsArrivee")}
      apiEndpoint="/api/declarations-arrivee"
      statusField="statut"
      fields={[
        { key: "nom", label: t("form.nom"), type: "text", required: true },
        { key: "prenom", label: t("form.prenom"), type: "text", required: true },
        { key: "date_naissance", label: t("form.dateNaissance"), type: "date" },
        { key: "numero_passeport", label: t("form.numeroPasseport"), type: "text", required: true },
        { key: "nationalite", label: "Nationalité", type: "text" },
        { key: "date_arrivee", label: t("form.dateArrivee"), type: "date" },
        { key: "ville_arrivee", label: t("form.ville"), type: "text" },
        { key: "motif_sejour", label: t("form.motifVisite"), type: "textarea" },
        { key: "adresse_sejour", label: t("form.adresseResidence"), type: "textarea" },
        { key: "telephone", label: t("form.telephone"), type: "tel" },
        { key: "email", label: t("form.email"), type: "email" },
        { key: "statut", label: t("common.status"), type: "select", options: [
          { value: "En attente", label: "En attente" },
          { value: "Arrivé", label: "Arrivé" },
          { value: "Absent", label: "Absent" },
        ]},
      ]}
      columns={[
        { key: "nom", label: t("form.nom"), render: (v, r) => <span className="font-medium">{r.prenom} {v}</span> },
        { key: "numero_passeport", label: t("form.numeroPasseport") },
        { key: "date_arrivee", label: t("form.dateArrivee"), render: (v) => formatDate(v as string) },
        { key: "ville_arrivee", label: t("form.ville") },
        { key: "statut", label: t("common.status"), render: (v) => <StatusBadge status={v as string} /> },
        { key: "created_at", label: "Soumis le", render: (v) => formatDate(v as string) },
      ]}
    />
  );
}
