"use client";

import CrudPage from "@/components/shared/CrudPage";
import StatusBadge from "@/components/shared/StatusBadge";
import { formatDate, formatCurrency } from "@/lib/utils";
import { useTranslations } from "next-intl";

export default function EtudiantsContractuelsPage() {
  const t = useTranslations();

  return (
    <CrudPage
      title={t("nav.etudiantsContractuels")}
      apiEndpoint="/api/etudiants-contractuels"
      statusField="statut"
      fields={[
        { key: "nom", label: t("form.nom"), type: "text", required: true },
        { key: "prenom", label: t("form.prenom"), type: "text", required: true },
        { key: "date_naissance", label: t("form.dateNaissance"), type: "date" },
        { key: "sexe", label: t("form.sexe"), type: "select", options: [{ value: "M", label: "Masculin" }, { value: "F", label: "Féminin" }] },
        { key: "numero_passeport", label: t("form.numeroPasseport"), type: "text" },
        { key: "telephone", label: t("form.telephone"), type: "tel" },
        { key: "email", label: t("form.email"), type: "email" },
        { key: "ville", label: t("form.ville"), type: "text" },
        { key: "universite", label: t("form.universite"), type: "text" },
        { key: "filiere", label: t("form.filiere"), type: "text" },
        { key: "niveau", label: t("form.niveau"), type: "select", options: [
          { value: "Licence", label: "Licence" }, { value: "Master", label: "Master" },
          { value: "Doctorat", label: "Doctorat" }, { value: "Spécialiste", label: "Spécialiste" },
        ]},
        { key: "frais_scolarite_annuels", label: t("form.fraisScolarite"), type: "number" },
        { key: "contact_urgence_nom", label: t("form.contactUrgence"), type: "text" },
        { key: "contact_urgence_telephone", label: "Tél. urgence", type: "tel" },
        { key: "type_visa", label: t("form.typeVisa"), type: "text" },
        { key: "date_expiration_visa", label: t("form.dateExpirationVisa"), type: "date" },
        { key: "statut", label: t("common.status"), type: "select", options: [
          { value: "Actif", label: "Actif" }, { value: "Suspendu", label: "Suspendu" }, { value: "Terminé", label: "Terminé" },
        ]},
        { key: "observations", label: t("form.observations"), type: "textarea" },
      ]}
      columns={[
        { key: "nom", label: t("form.nom"), render: (v, r) => <span className="font-medium">{r.prenom} {v}</span> },
        { key: "numero_passeport", label: t("form.numeroPasseport") },
        { key: "universite", label: t("form.universite") },
        { key: "ville", label: t("form.ville") },
        { key: "frais_scolarite_annuels", label: t("form.fraisScolarite"), render: (v) => formatCurrency(v as number) },
        { key: "statut", label: t("common.status"), render: (v) => <StatusBadge status={v as string} /> },
        { key: "date_expiration_visa", label: t("form.dateExpirationVisa"), render: (v) => formatDate(v as string) },
      ]}
    />
  );
}
