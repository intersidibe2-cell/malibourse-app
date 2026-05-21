import { NextRequest } from "next/server";
import { createEntityHandler } from "@/lib/entity-handler";

const handler = createEntityHandler({
  table: "annonces",
  allowedFields: [
    "titre", "contenu", "categorie", "date_publication", "statut",
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
