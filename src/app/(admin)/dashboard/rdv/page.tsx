"use client";

import CrudPage from "@/components/shared/CrudPage";
import StatusBadge from "@/components/shared/StatusBadge";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

const rdvStatusMap: Record<string, "default" | "secondary" | "destructive" | "warning" | "info"> = {
  "En attente": "warning",
  "Confirmé": "info",
  "Annulé": "destructive",
  "Effectué": "default",
};

export default function RdvPage() {
  return (
    <CrudPage
      title="Rendez-vous consulaires"
      apiEndpoint="/api/rdv"
      statusField="statut"
      fields={[
        { key: "nom_complet", label: "Nom complet", type: "text", required: true },
        { key: "telephone", label: "Téléphone", type: "tel" },
        { key: "email", label: "Email", type: "email" },
        { key: "motif", label: "Motif", type: "select", options: [
          { value: "Visa", label: "Visa" },
          { value: "Passeport", label: "Passeport" },
          { value: "Légalisation", label: "Légalisation" },
          { value: "Bourse", label: "Bourse" },
          { value: "Notariat", label: "Notariat" },
          { value: "État civil", label: "État civil" },
          { value: "Information", label: "Information" },
          { value: "Autre", label: "Autre" },
        ]},
        { key: "description", label: "Description", type: "textarea" },
        { key: "date_souhaitee", label: "Date souhaitée", type: "date", required: true },
        { key: "creneau_horaire", label: "Créneau horaire", type: "text" },
        { key: "statut", label: "Statut", type: "select", options: [
          { value: "En attente", label: "En attente" },
          { value: "Confirmé", label: "Confirmé" },
          { value: "Annulé", label: "Annulé" },
          { value: "Effectué", label: "Effectué" },
        ]},
        { key: "notes_admin", label: "Notes admin", type: "textarea" },
      ]}
      columns={[
        { key: "reference", label: "Référence" },
        { key: "nom_complet", label: "Nom", render: (v) => <span className="font-medium">{v as string}</span> },
        { key: "motif", label: "Motif" },
        { key: "date_souhaitee", label: "Date souhaitée", render: (v) => formatDate(v as string) },
        { key: "creneau_horaire", label: "Créneau" },
        { key: "statut", label: "Statut", render: (v) => <StatusBadge status={v as string} customMap={rdvStatusMap} /> },
        { key: "created_at", label: "Créé le", render: (v) => formatDate(v as string) },
      ]}
      extraButtons={
        <Link href="/rdv">
          <Button variant="outline" size="sm">
            <ExternalLink className="w-4 h-4 mr-1" />
            Lien public
          </Button>
        </Link>
      }
    />
  );
}
