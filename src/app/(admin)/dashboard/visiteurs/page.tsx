"use client";

import CrudPage from "@/components/shared/CrudPage";
import StatusBadge from "@/components/shared/StatusBadge";
import { formatDate } from "@/lib/utils";
import { useTranslations } from "next-intl";

export default function VisiteursPage() {
  const t = useTranslations();

  return (
    <CrudPage
      title={t("nav.visiteurs")}
      apiEndpoint="/api/visiteurs"
      statusField="statut"
      fields={[
        { key: "nom", label: t("form.nom"), type: "text", required: true },
        { key: "prenom", label: t("form.prenom"), type: "text", required: true },
        { key: "date_naissance", label: t("form.dateNaissance"), type: "date" },
        { key: "sexe", label: t("form.sexe"), type: "select", options: [{ value: "M", label: "Masculin" }, { value: "F", label: "Féminin" }] },
        { key: "numero_passeport", label: t("form.numeroPasseport"), type: "text" },
        { key: "telephone", label: t("form.telephone"), type: "tel" },
        { key: "email", label: t("form.email"), type: "email" },
        { key: "motif_visite", label: t("form.motifVisite"), type: "textarea" },
        { key: "duree_sejour_jours", label: t("form.dureeSejour"), type: "number" },
        { key: "date_arrivee", label: t("form.dateArrivee"), type: "date" },
        { key: "date_depart_prevue", label: "Départ prévu", type: "date" },
        { key: "hebergement", label: "Hébergement", type: "text" },
        { key: "statut", label: t("common.status"), type: "select", options: [
          { value: "En séjour", label: "En séjour" },
          { value: "Terminé", label: "Terminé" },
        ]},
        { key: "observations", label: t("form.observations"), type: "textarea" },
      ]}
      columns={[
        { key: "nom", label: t("form.nom"), render: (v, r) => <span className="font-medium">{r.prenom} {v}</span> },
        { key: "numero_passeport", label: t("form.numeroPasseport") },
        { key: "motif_visite", label: t("form.motifVisite") },
        { key: "date_arrivee", label: t("form.dateArrivee"), render: (v) => formatDate(v as string) },
        { key: "date_depart_prevue", label: "Départ prévu", render: (v) => formatDate(v as string) },
        { key: "statut", label: t("common.status"), render: (v) => <StatusBadge status={v as string} /> },
      ]}
    />
  );
}
