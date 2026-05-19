import { NextRequest } from "next/server";
import { createEntityHandler } from "@/lib/entity-handler";

const handler = createEntityHandler({
  table: "etudiants_militaires",
  allowedFields: [
    "nom", "prenom", "grade", "matricule", "numero_passeport",
    "date_naissance", "sexe", "telephone", "email",
    "etablissement_formation", "ville", "specialite", "type_formation",
    "duree_formation_annees", "annee_etude", "date_arrivee",
    "date_fin_formation", "arme_service", "montant_bourse_mensuelle",
    "devise", "contact_urgence_nom", "contact_urgence_telephone",
    "type_visa", "date_expiration_visa", "statut", "observations",
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
