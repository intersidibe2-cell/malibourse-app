import { NextRequest } from "next/server";
import { createEntityHandler } from "@/lib/entity-handler";

const handler = createEntityHandler({
  table: "annonces",
  allowedFields: [
    "titre", "contenu", "categorie", "date_publication", "statut",
  ],
  searchFields: ["titre", "contenu"],
  orderField: "date_publication",
  orderDir: "DESC",
});

export async function GET(request: NextRequest) { return handler.GET(request); }
export async function POST(request: NextRequest) { return handler.POST(request); }
