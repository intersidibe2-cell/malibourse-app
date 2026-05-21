"use client";

import CrudPage from "@/components/shared/CrudPage";
import StatusBadge from "@/components/shared/StatusBadge";
import { formatDate, formatCurrency } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { FileText } from "lucide-react";

export default function BilletsVoyagePage() {
  const t = useTranslations();

  return (
    <CrudPage
      title={t("nav.billetsVoyage")}
      apiEndpoint="/api/billets-voyage"
      statusField="statut"
      fields={[
        { key: "etudiant_nom", label: t("form.nom"), type: "text" },
        { key: "etudiant_prenom", label: t("form.prenom"), type: "text" },
        { key: "email", label: t("form.email"), type: "email" },
        { key: "numero_passeport", label: t("form.numeroPasseport"), type: "text" },
        { key: "universite", label: t("form.universite"), type: "text" },
        { key: "ville", label: t("form.ville"), type: "text" },
        { key: "type_billet", label: t("form.typeBillet"), type: "select", options: [
          { value: "Vacances annuelles", label: "Vacances annuelles" },
          { value: "Rapatriement fin de cycle", label: "Rapatriement fin de cycle" },
          { value: "Rapatriement médical", label: "Rapatriement médical" },
          { value: "Rapatriement décès", label: "Rapatriement décès" },
        ]},
        { key: "annee_academique", label: "Année académique", type: "text" },
        { key: "date_depart_prevu", label: t("form.dateDepart"), type: "date" },
        { key: "date_retour_prevu", label: t("form.dateRetour"), type: "date" },
        { key: "compagnie_aerienne", label: t("form.compagnieAerienne"), type: "text" },
        { key: "numero_vol", label: t("form.numeroVol"), type: "text" },
        { key: "itineraire", label: t("form.itineraire"), type: "text" },
        { key: "cout_billet", label: t("form.coutBillet"), type: "number" },
        { key: "devise", label: t("form.devise"), type: "select", options: [
          { value: "RUB", label: "RUB" }, { value: "USD", label: "USD" },
          { value: "EUR", label: "EUR" }, { value: "XOF", label: "XOF" },
        ]},
        { key: "statut", label: t("common.status"), type: "select", options: [
          { value: "Demande soumise", label: "Demande soumise" },
          { value: "Approuvé", label: "Approuvé" },
          { value: "Billet émis", label: "Billet émis" },
          { value: "Voyage effectué", label: "Voyage effectué" },
          { value: "Annulé", label: "Annulé" },
          { value: "Refusé", label: "Refusé" },
        ]},
        { key: "motif_demande", label: "Motif de la demande", type: "textarea" },
        { key: "observations", label: t("form.observations"), type: "textarea" },
        { key: "pieces_jointes", label: "Pièces jointes (JSON)", type: "textarea" },
      ]}
      columns={[
        { key: "etudiant_nom", label: t("form.nom"), render: (v, r) => <span className="font-medium">{r.etudiant_prenom} {v}</span> },
        { key: "type_billet", label: t("form.typeBillet") },
        { key: "date_depart_prevu", label: t("form.dateDepart"), render: (v) => formatDate(v as string) },
        { key: "itineraire", label: t("form.itineraire") },
        { key: "pieces_jointes", label: "Docs", render: (v) => {
          if (!v) return <span className="text-gray-400">-</span>;
          const files = typeof v === "string" ? (() => { try { return JSON.parse(v); } catch { return []; } })() : v;
          if (files.length === 0) return <span className="text-gray-400">-</span>;
          return <div className="flex flex-wrap gap-1">{files.map((f: any) => <a key={f.id} href={f.url} target="_blank" className="flex items-center gap-0.5 text-xs bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded hover:bg-purple-100"><FileText className="w-3 h-3" /> Voir</a>)}</div>;
        }},
        { key: "cout_billet", label: t("form.coutBillet"), render: (v, r) => formatCurrency(v as number, r.devise as string) },
        { key: "statut", label: t("common.status"), render: (v) => <StatusBadge status={v as string} /> },
      ]}
    />
  );
}
