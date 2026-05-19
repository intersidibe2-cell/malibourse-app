"use client";

import CrudPage from "@/components/shared/CrudPage";
import StatusBadge from "@/components/shared/StatusBadge";
import { formatDate } from "@/lib/utils";
import { useTranslations } from "next-intl";

export default function ResidentsPage() {
  const t = useTranslations();

  return (
    <CrudPage
      title={t("nav.residents")}
      apiEndpoint="/api/residents"
      statusField="statut"
      fields={[
        { key: "nom", label: t("form.nom"), type: "text", required: true },
        { key: "prenom", label: t("form.prenom"), type: "text", required: true },
        { key: "date_naissance", label: t("form.dateNaissance"), type: "date" },
        { key: "sexe", label: t("form.sexe"), type: "select", options: [{ value: "M", label: "Masculin" }, { value: "F", label: "Féminin" }] },
        { key: "numero_passeport", label: t("form.numeroPasseport"), type: "text" },
        { key: "telephone", label: t("form.telephone"), type: "tel" },
        { key: "email", label: t("form.email"), type: "email" },
        { key: "profession", label: t("form.profession"), type: "text" },
        { key: "employeur", label: t("form.employeur"), type: "text" },
        { key: "ville", label: t("form.ville"), type: "text" },
        { key: "adresse_residence", label: t("form.adresseResidence"), type: "text" },
        { key: "type_permis", label: t("form.typePermis"), type: "text" },
        { key: "date_expiration_permis", label: t("form.dateExpirationPermis"), type: "date" },
        { key: "statut", label: t("common.status"), type: "select", options: [
          { value: "Actif", label: "Actif" }, { value: "Suspendu", label: "Suspendu" }, { value: "Terminé", label: "Terminé" },
        ]},
        { key: "observations", label: t("form.observations"), type: "textarea" },
      ]}
      columns={[
        { key: "nom", label: t("form.nom"), render: (v, r) => <span className="font-medium">{r.prenom} {v}</span> },
        { key: "profession", label: t("form.profession") },
        { key: "ville", label: t("form.ville") },
        { key: "type_permis", label: t("form.typePermis") },
        { key: "date_expiration_permis", label: t("form.dateExpirationPermis"), render: (v) => formatDate(v as string) },
        { key: "statut", label: t("common.status"), render: (v) => <StatusBadge status={v as string} /> },
      ]}
    />
  );
}
