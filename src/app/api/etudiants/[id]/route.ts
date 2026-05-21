import { NextRequest } from "next/server";
import { createEntityHandler } from "@/lib/entity-handler";

const handler = createEntityHandler({
  table: "etudiants",
  allowedFields: [
    "nom", "prenom", "date_naissance", "sexe", "numero_passeport",
    "telephone", "email", "ville", "adresse_residence", "universite",
    "filiere", "niveau", "annee_etude", "date_arrivee", "date_fin_cycle",
    "date_depart", "montant_mensuel", "devise", "statut_bourse",
    "type_bourse", "observations", "source", "propose_par", "statut_ministere",
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
