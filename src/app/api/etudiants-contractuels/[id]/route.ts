import { NextRequest } from "next/server";
import { createEntityHandler } from "@/lib/entity-handler";

const handler = createEntityHandler({
  table: "etudiants_contractuels",
  allowedFields: [
    "nom", "prenom", "date_naissance", "sexe", "numero_passeport",
    "telephone", "email", "ville", "adresse_residence", "universite",
    "filiere", "niveau", "annee_etude", "date_arrivee", "date_fin_cycle",
    "frais_scolarite_annuels", "devise_frais", "contact_urgence_nom",
    "contact_urgence_telephone", "type_visa", "date_expiration_visa",
    "statut", "observations",
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
