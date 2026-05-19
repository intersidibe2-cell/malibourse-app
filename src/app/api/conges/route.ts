import { NextRequest } from "next/server";
import { createEntityHandler } from "@/lib/entity-handler";

const handler = createEntityHandler({
  table: "conges_academiques",
  allowedFields: [
    "etudiant_id", "etudiant_nom", "type_conge", "motif",
    "date_debut", "date_fin", "statut", "observations",
  ],
  searchFields: ["etudiant_nom", "type_conge"],
  orderField: "date_demande",
  orderDir: "DESC",
});

export async function GET(request: NextRequest) { return handler.GET(request); }
export async function POST(request: NextRequest) { return handler.POST(request); }
