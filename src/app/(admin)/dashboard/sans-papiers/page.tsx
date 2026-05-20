"use client";

import { useState, useEffect } from "react";
import CrudPage from "@/components/shared/CrudPage";

export default function SansPapiersPage() {
  return (
    <CrudPage
      title="Sans Papiers"
      apiEndpoint="/api/etudiants"
      statusField="statut_bourse"
      fields={[
        { key: "nom", label: "Nom", type: "text", required: true },
        { key: "prenom", label: "Prénom", type: "text", required: true },
        { key: "numero_passeport", label: "Passeport", type: "text" },
        { key: "telephone", label: "Téléphone", type: "tel" },
        { key: "email", label: "Email", type: "email" },
        { key: "ville", label: "Ville", type: "text" },
        { key: "observations", label: "Situation / Notes", type: "textarea" },
      ]}
      columns={[
        { key: "nom", label: "Nom", render: (v, r) => <span className="font-medium">{r.prenom} {v}</span> },
        { key: "numero_passeport", label: "Passeport" },
        { key: "telephone", label: "Téléphone" },
        { key: "observations", label: "Situation", render: (v) => <span className="text-xs text-gray-500">{(v as string)?.substring(0, 80) || "-"}</span> },
      ]}
    />
  );
}
