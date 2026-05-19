import { NextRequest } from "next/server";
import { createEntityHandler } from "@/lib/entity-handler";

const handler = createEntityHandler({
  table: "residents",
  allowedFields: [
    "nom", "prenom", "date_naissance", "sexe", "numero_passeport",
    "telephone", "email", "profession", "employeur", "ville",
    "adresse_residence", "type_permis", "date_expiration_permis",
    "statut", "observations",
  ],
  searchFields: ["nom", "prenom", "profession"],
  orderField: "nom",
  orderDir: "ASC",
});

export async function GET(request: NextRequest) { return handler.GET(request); }
export async function POST(request: NextRequest) { return handler.POST(request); }
