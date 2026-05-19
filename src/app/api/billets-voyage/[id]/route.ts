import { NextRequest } from "next/server";
import { createEntityHandler } from "@/lib/entity-handler";

const handler = createEntityHandler({
  table: "billets_voyage",
  allowedFields: [
    "etudiant_id", "etudiant_nom", "etudiant_prenom", "numero_passeport",
    "universite", "ville", "type_billet", "annee_academique",
    "date_depart_prevu", "date_retour_prevu", "compagnie_aerienne",
    "numero_vol", "itineraire", "cout_billet", "devise",
    "statut", "motif_demande", "observations",
  ],
});

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return handler.PUT(request, id);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return handler.DELETE(request, id);
}
