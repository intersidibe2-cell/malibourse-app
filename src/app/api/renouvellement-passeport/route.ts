import { NextRequest } from "next/server";
import { createEntityHandler } from "@/lib/entity-handler";

const handler = createEntityHandler({
  table: "renouvellements_passeport",
  allowedFields: [
    "reference", "nom_complet", "telephone", "email", "numero_passeport",
    "date_naissance", "lieu_naissance", "adresse_russie",
    "motif_renouvellement", "pieces_jointes", "statut", "notes_admin",
  ],
  searchFields: ["nom_complet", "email", "numero_passeport", "reference"],
  orderField: "created_at",
  orderDir: "DESC",
});

export async function GET(request: NextRequest) { return handler.GET(request); }
export async function POST(request: NextRequest) { return handler.POST(request); }
