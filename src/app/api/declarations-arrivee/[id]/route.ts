import { NextRequest } from "next/server";
import { createEntityHandler } from "@/lib/entity-handler";

const handler = createEntityHandler({
  table: "declarations_arrivee",
  allowedFields: [
    "nom", "prenom", "date_naissance", "numero_passeport",
    "nationalite", "date_arrivee", "ville_arrivee", "motif_sejour",
    "adresse_sejour", "telephone", "email", "statut",
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
