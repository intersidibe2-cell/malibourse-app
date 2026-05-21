import { NextRequest } from "next/server";
import { createEntityHandler } from "@/lib/entity-handler";

const handler = createEntityHandler({
  table: "rendez_vous",
  allowedFields: [
    "reference", "nom_complet", "telephone", "email", "motif",
    "description", "date_souhaitee", "creneau_horaire", "statut",
    "notes_admin",
  ],
  searchFields: ["nom_complet", "email", "motif", "reference"],
  orderField: "created_at",
  orderDir: "DESC",
});

export async function GET(request: NextRequest) { return handler.GET(request); }
export async function POST(request: NextRequest) { return handler.POST(request); }
