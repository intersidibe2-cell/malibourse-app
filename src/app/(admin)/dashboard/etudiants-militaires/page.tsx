"use client";

import CrudPage from "@/components/shared/CrudPage";
import StatusBadge from "@/components/shared/StatusBadge";
import { formatDate, formatCurrency } from "@/lib/utils";
import { useTranslations } from "next-intl";

export default function EtudiantsMilitairesPage() {
  const t = useTranslations();

  return (
    <CrudPage
      title={t("nav.etudiantsMilitaires")}
      apiEndpoint="/api/etudiants-militaires"
      statusField="statut"
      fields={[
        { key: "nom", label: t("form.nom"), type: "text", required: true },
        { key: "prenom", label: t("form.prenom"), type: "text", required: true },
        { key: "grade", label: t("form.grade"), type: "select", options: [
          { value: "Élève Officier", label: "Élève Officier" }, { value: "Sous-Lieutenant", label: "Sous-Lieutenant" },
          { value: "Lieutenant", label: "Lieutenant" }, { value: "Capitaine", label: "Capitaine" },
          { value: "Commandant", label: "Commandant" }, { value: "Lieutenant-Colonel", label: "Lieutenant-Colonel" },
          { value: "Colonel", label: "Colonel" }, { value: "Autre", label: "Autre" },
        ]},
        { key: "matricule", label: t("form.matricule"), type: "text" },
        { key: "numero_passeport", label: t("form.numeroPasseport"), type: "text" },
        { key: "date_naissance", label: t("form.dateNaissance"), type: "date" },
        { key: "sexe", label: t("form.sexe"), type: "select", options: [{ value: "M", label: "Masculin" }, { value: "F", label: "Féminin" }] },
        { key: "telephone", label: t("form.telephone"), type: "tel" },
        { key: "email", label: t("form.email"), type: "email" },
        { key: "arme_service", label: t("form.armeService"), type: "select", options: [
          { value: "Armée de Terre", label: "Armée de Terre" }, { value: "Armée de l'Air", label: "Armée de l'Air" },
          { value: "Marine", label: "Marine" }, { value: "Gendarmerie", label: "Gendarmerie" },
          { value: "Garde Nationale", label: "Garde Nationale" }, { value: "Autre", label: "Autre" },
        ]},
        { key: "etablissement_formation", label: "Établissement", type: "text" },
        { key: "ville", label: t("form.ville"), type: "text" },
        { key: "specialite", label: t("form.specialite"), type: "text" },
        { key: "type_formation", label: t("form.typeFormation"), type: "select", options: [
          { value: "Formation initiale d'officier", label: "Formation initiale d'officier" },
          { value: "Formation spécialisée", label: "Formation spécialisée" },
          { value: "Stage de perfectionnement", label: "Stage de perfectionnement" },
          { value: "Doctorat militaire", label: "Doctorat militaire" },
          { value: "Autre", label: "Autre" },
        ]},
        { key: "duree_formation_annees", label: t("form.dureeFormation"), type: "number" },
        { key: "montant_bourse_mensuelle", label: t("form.montantMensuel"), type: "number" },
        { key: "devise", label: t("form.devise"), type: "select", options: [
          { value: "RUB", label: "RUB" }, { value: "USD", label: "USD" },
        ]},
        { key: "date_arrivee", label: t("form.dateArrivee"), type: "date" },
        { key: "date_fin_formation", label: t("form.dateFinCycle"), type: "date" },
        { key: "statut", label: t("common.status"), type: "select", options: [
          { value: "En formation", label: "En formation" }, { value: "Diplômé", label: "Diplômé" },
          { value: "Rapatrié", label: "Rapatrié" }, { value: "Suspendu", label: "Suspendu" },
          { value: "Décédé", label: "Décédé" },
        ]},
        { key: "observations", label: t("form.observations"), type: "textarea" },
      ]}
      columns={[
        { key: "grade", label: t("form.grade"), render: (v) => <span className="text-xs font-medium">{v as string}</span> },
        { key: "nom", label: t("form.nom"), render: (v, r) => <span className="font-medium">{r.prenom} {v}</span> },
        { key: "matricule", label: t("form.matricule") },
        { key: "arme_service", label: t("form.armeService") },
        { key: "etablissement_formation", label: "Établissement" },
        { key: "montant_bourse_mensuelle", label: t("form.montantMensuel"), render: (v) => formatCurrency(v as number) },
        { key: "statut", label: t("common.status"), render: (v) => <StatusBadge status={v as string} /> },
      ]}
    />
  );
}
