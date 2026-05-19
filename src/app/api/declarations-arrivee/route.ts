import { NextRequest } from "next/server";
import { createEntityHandler } from "@/lib/entity-handler";

const handler = createEntityHandler({
  table: "declarations_arrivee",
  allowedFields: [
    "nom", "prenom", "date_naissance", "numero_passeport",
    "nationalite", "date_arrivee", "ville_arrivee", "motif_sejour",
    "adresse_sejour", "telephone", "email", "statut",
  ],
  searchFields: ["nom", "prenom", "numero_passeport"],
  orderField: "created_at",
  orderDir: "DESC",
});

export async function GET(request: NextRequest) { return handler.GET(request); }
export async function POST(request: NextRequest) { return handler.POST(request); }
