"use client";

import CrudPage from "@/components/shared/CrudPage";
import StatusBadge from "@/components/shared/StatusBadge";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

const categorieColors: Record<string, string> = {
  Formulaire: "bg-blue-100 text-blue-700",
  Guide: "bg-green-100 text-green-700",
  Modèle: "bg-purple-100 text-purple-700",
  Règlement: "bg-orange-100 text-orange-700",
  Autre: "bg-gray-100 text-gray-700",
};

export default function TelechargementsPage() {
  return (
    <CrudPage
      title="Téléchargements & Modèles"
      apiEndpoint="/api/telechargements"
      statusField="statut"
      fields={[
        { key: "titre", label: "Titre", type: "text", required: true },
        { key: "description", label: "Description", type: "textarea" },
        { key: "categorie", label: "Catégorie", type: "select", options: [
          { value: "Formulaire", label: "Formulaire" },
          { value: "Guide", label: "Guide" },
          { value: "Modèle", label: "Modèle" },
          { value: "Règlement", label: "Règlement" },
          { value: "Autre", label: "Autre" },
        ]},
        { key: "fichier_url", label: "URL du fichier", type: "text", required: true },
        { key: "fichier_nom", label: "Nom du fichier", type: "text" },
        { key: "fichier_taille", label: "Taille (Ko)", type: "number" },
        { key: "ordre", label: "Ordre", type: "number" },
        { key: "statut", label: "Statut", type: "select", options: [
          { value: "Publié", label: "Publié" },
          { value: "Brouillon", label: "Brouillon" },
        ]},
      ]}
      columns={[
        { key: "titre", label: "Titre", render: (v) => <span className="font-medium">{v as string}</span> },
        { key: "categorie", label: "Catégorie", render: (v) => (
          <Badge className={categorieColors[v as string] || ""}>{v as string}</Badge>
        )},
        { key: "ordre", label: "Ordre" },
        { key: "statut", label: "Statut", render: (v) => <StatusBadge status={v as string} /> },
      ]}
      extraButtons={
        <Link href="/telechargements">
          <Button variant="outline" size="sm">
            <ExternalLink className="w-4 h-4 mr-1" />
            Lien public
          </Button>
        </Link>
      }
    />
  );
}
