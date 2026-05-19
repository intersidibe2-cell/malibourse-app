import { NextRequest } from "next/server";
import { createEntityHandler } from "@/lib/entity-handler";

const handler = createEntityHandler({
  table: "visiteurs",
  allowedFields: [
    "nom", "prenom", "date_naissance", "sexe", "numero_passeport",
    "telephone", "email", "motif_visite", "duree_sejour_jours",
    "date_arrivee", "date_depart_prevue", "hebergement",
    "statut", "observations",
  ],
  searchFields: ["nom", "prenom", "numero_passeport"],
  orderField: "date_arrivee",
  orderDir: "DESC",
});

export async function GET(request: NextRequest) { return handler.GET(request); }
export async function POST(request: NextRequest) { return handler.POST(request); }
