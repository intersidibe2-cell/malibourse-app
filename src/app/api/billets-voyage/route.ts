import { NextRequest } from "next/server";
import { createEntityHandler } from "@/lib/entity-handler";

const handler = createEntityHandler({
  table: "billets_voyage",
  allowedFields: [
    "etudiant_id", "etudiant_nom", "etudiant_prenom", "numero_passeport",
    "universite", "ville", "type_billet", "annee_academique",
    "date_depart_prevu", "date_retour_prevu", "compagnie_aerienne",
    "numero_vol", "itineraire", "cout_billet", "devise",
    "statut", "motif_demande", "observations", "pieces_jointes", "email",
  ],
  searchFields: ["etudiant_nom", "etudiant_prenom", "numero_passeport"],
  orderField: "date_demande",
  orderDir: "DESC",
});

export async function GET(request: NextRequest) { return handler.GET(request); }
export async function POST(request: NextRequest) { return handler.POST(request); }
