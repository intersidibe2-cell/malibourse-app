"use client";

import CrudPage from "@/components/shared/CrudPage";
import StatusBadge from "@/components/shared/StatusBadge";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

const statutMap: Record<string, "default" | "secondary" | "destructive" | "warning" | "info"> = {
  Demande: "warning",
  "En cours": "info",
  Prêt: "default",
  Livré: "secondary",
  Rejeté: "destructive",
};

export default function RenouvellementsPage() {
  return (
    <CrudPage
      title="Renouvellements de passeport"
      apiEndpoint="/api/renouvellement-passeport"
      statusField="statut"
      fields={[
        { key: "nom_complet", label: "Nom complet", type: "text" },
        { key: "telephone", label: "Téléphone", type: "tel" },
        { key: "email", label: "Email", type: "email" },
        { key: "numero_passeport", label: "Numéro passeport", type: "text" },
        { key: "date_naissance", label: "Date naissance", type: "date" },
        { key: "lieu_naissance", label: "Lieu naissance", type: "text" },
        { key: "adresse_russie", label: "Adresse Russie", type: "textarea" },
        { key: "motif_renouvellement", label: "Motif", type: "select", options: [
          { value: "Expiré", label: "Expiré" },
          { value: "Plein", label: "Plein" },
          { value: "Perdu", label: "Perdu" },
          { value: "Volé", label: "Volé" },
          { value: "Détérioré", label: "Détérioré" },
          { value: "Autre", label: "Autre" },
        ]},
        { key: "statut", label: "Statut", type: "select", options: [
          { value: "Demande", label: "Demande" },
          { value: "En cours", label: "En cours" },
          { value: "Prêt", label: "Prêt" },
          { value: "Livré", label: "Livré" },
          { value: "Rejeté", label: "Rejeté" },
        ]},
        { key: "notes_admin", label: "Notes admin", type: "textarea" },
      ]}
      columns={[
        { key: "reference", label: "Référence" },
        { key: "nom_complet", label: "Nom", render: (v) => <span className="font-medium">{v as string}</span> },
        { key: "numero_passeport", label: "N° Passeport" },
        { key: "motif_renouvellement", label: "Motif" },
        { key: "statut", label: "Statut", render: (v) => <StatusBadge status={v as string} customMap={statutMap} /> },
        { key: "date_soumission", label: "Date", render: (v) => formatDate(v as string) },
      ]}
      extraButtons={
        <Link href="/renouvellement-passeport">
          <Button variant="outline" size="sm">
            <ExternalLink className="w-4 h-4 mr-1" />
            Lien public
          </Button>
        </Link>
      }
    />
  );
}
