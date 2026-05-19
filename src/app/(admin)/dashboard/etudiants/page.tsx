"use client";

import CrudPage from "@/components/shared/CrudPage";
import StatusBadge from "@/components/shared/StatusBadge";
import { formatDate, formatCurrency } from "@/lib/utils";
import { useTranslations } from "next-intl";

export default function EtudiantsPage() {
  const t = useTranslations();

  return (
    <CrudPage
      title={t("nav.etudiants")}
      apiEndpoint="/api/etudiants"
      statusField="statut_bourse"
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
          { value: "Résidence médicale", label: "Résidence médicale" },
        ]},
        { key: "annee_etude", label: t("form.anneeEtude"), type: "text" },
        { key: "date_arrivee", label: t("form.dateArrivee"), type: "date" },
        { key: "date_fin_cycle", label: t("form.dateFinCycle"), type: "date" },
        { key: "montant_mensuel", label: t("form.montantMensuel"), type: "number" },
        { key: "devise", label: t("form.devise"), type: "select", options: [
          { value: "RUB", label: "RUB" }, { value: "USD", label: "USD" },
          { value: "EUR", label: "EUR" }, { value: "XOF", label: "XOF" },
        ]},
        { key: "statut_bourse", label: t("form.statutBourse"), type: "select", options: [
          { value: "Actif", label: "Actif" }, { value: "Suspendu", label: "Suspendu" },
          { value: "Terminé", label: "Terminé" }, { value: "En attente", label: "En attente" },
        ]},
        { key: "type_bourse", label: t("form.typeBourse"), type: "text" },
        { key: "observations", label: t("form.observations"), type: "textarea" },
      ]}
      columns={[
        { key: "nom", label: t("form.nom"), render: (v, r) => <span className="font-medium">{r.prenom} {v}</span> },
        { key: "numero_passeport", label: t("form.numeroPasseport") },
        { key: "universite", label: t("form.universite") },
        { key: "ville", label: t("form.ville") },
        { key: "niveau", label: t("form.niveau") },
        { key: "montant_mensuel", label: t("form.montantMensuel"), render: (v) => formatCurrency(v as number) },
        { key: "statut_bourse", label: t("form.statutBourse"), render: (v) => <StatusBadge status={v as string} /> },
        { key: "date_arrivee", label: t("form.dateArrivee"), render: (v) => formatDate(v as string) },
      ]}
    />
  );
}
