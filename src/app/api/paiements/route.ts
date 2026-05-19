import { NextRequest } from "next/server";
import { createEntityHandler } from "@/lib/entity-handler";

const handler = createEntityHandler({
  table: "paiements",
  allowedFields: [
    "etudiant_id", "etudiant_nom", "type_paiement", "montant",
    "devise", "mois_concerne", "annee_concerne", "date_paiement",
    "statut", "reference", "observations",
  ],
  searchFields: ["etudiant_nom", "reference"],
  orderField: "date_paiement",
  orderDir: "DESC",
});

export async function GET(request: NextRequest) { return handler.GET(request); }
export async function POST(request: NextRequest) { return handler.POST(request); }
