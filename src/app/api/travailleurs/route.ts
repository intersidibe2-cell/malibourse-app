import { NextRequest } from "next/server";
import { createEntityHandler } from "@/lib/entity-handler";

const handler = createEntityHandler({
  table: "travailleurs",
  allowedFields: [
    "nom", "prenom", "date_naissance", "sexe", "numero_passeport",
    "telephone", "email", "profession", "employeur", "ville",
    "adresse_residence", "type_visa", "date_expiration_visa",
    "statut", "observations",
  ],
  searchFields: ["nom", "prenom", "profession", "employeur"],
  orderField: "nom",
  orderDir: "ASC",
});

export async function GET(request: NextRequest) { return handler.GET(request); }
export async function POST(request: NextRequest) { return handler.POST(request); }
