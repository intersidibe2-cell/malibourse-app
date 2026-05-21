"use client";

import CrudPage from "@/components/shared/CrudPage";
import StatusBadge from "@/components/shared/StatusBadge";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

export default function FaqPage() {
  return (
    <CrudPage
      title="FAQ"
      apiEndpoint="/api/faq"
      statusField="statut"
      fields={[
        { key: "question", label: "Question", type: "textarea", required: true },
        { key: "reponse", label: "Réponse", type: "textarea", required: true },
        { key: "categorie", label: "Catégorie", type: "select", options: [
          { value: "Général", label: "Général" },
          { value: "Visa", label: "Visa" },
          { value: "Passeport", label: "Passeport" },
          { value: "Bourse", label: "Bourse" },
          { value: "Légalisation", label: "Légalisation" },
          { value: "Consulaire", label: "Consulaire" },
          { value: "Inscription", label: "Inscription" },
        ]},
        { key: "ordre", label: "Ordre", type: "number" },
        { key: "statut", label: "Statut", type: "select", options: [
          { value: "Publié", label: "Publié" },
          { value: "Brouillon", label: "Brouillon" },
        ]},
      ]}
      columns={[
        { key: "question", label: "Question", render: (v) => (
          <span className="line-clamp-2 max-w-xs text-sm">{v as string}</span>
        )},
        { key: "categorie", label: "Catégorie", render: (v) => <Badge variant="outline">{v as string}</Badge> },
        { key: "ordre", label: "Ordre" },
        { key: "statut", label: "Statut", render: (v) => <StatusBadge status={v as string} /> },
      ]}
      extraButtons={
        <Link href="/faq">
          <Button variant="outline" size="sm">
            <ExternalLink className="w-4 h-4 mr-1" />
            Lien public
          </Button>
        </Link>
      }
    />
  );
}
