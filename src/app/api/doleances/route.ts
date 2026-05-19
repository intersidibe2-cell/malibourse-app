import { NextRequest } from "next/server";
import { createEntityHandler } from "@/lib/entity-handler";

const handler = createEntityHandler({
  table: "doleances",
  allowedFields: [
    "etudiant_nom", "etudiant_prenom", "telephone", "email",
    "type", "titre", "description", "priorite", "statut",
    "reponse_admin", "observations",
  ],
  searchFields: ["titre", "etudiant_nom", "description"],
  orderField: "date_soumission",
  orderDir: "DESC",
});

export async function GET(request: NextRequest) { return handler.GET(request); }
export async function POST(request: NextRequest) { return handler.POST(request); }
