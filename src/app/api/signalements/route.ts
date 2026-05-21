import { NextRequest } from "next/server";
import { createEntityHandler } from "@/lib/entity-handler";

const handler = createEntityHandler({
  table: "signalements",
  allowedFields: [
    "nom_complet", "telephone", "email", "type_signalement",
    "titre", "description", "lieu", "urgence", "statut",
    "reponse_admin", "observations",
  ],
  searchFields: ["titre", "nom_complet", "description"],
  orderField: "date_soumission",
  orderDir: "DESC",
});

export async function GET(request: NextRequest) { return handler.GET(request); }
export async function POST(request: NextRequest) { return handler.POST(request); }
