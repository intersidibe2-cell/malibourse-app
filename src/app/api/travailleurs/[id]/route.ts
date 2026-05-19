import { NextRequest } from "next/server";
import { createEntityHandler } from "@/lib/entity-handler";

const handler = createEntityHandler({
  table: "travailleurs",
  allowedFields: [
    "nom", "prenom", "date_naissance", "sexe", "numero_passeport",
    "telephone", "email", "profession", "employeur", "ville",
    "adresse_residence", "type_visa", "date_expiration_visa",
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
