import { NextRequest, NextResponse } from "next/server";
import { createEntityHandler } from "@/lib/entity-handler";
import { verifyToken } from "@/lib/auth";

const ALLOWED_ROLES = ["ambassadeur", "defense"];

async function checkRole(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  if (!token) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  const payload = await verifyToken(token);
  if (!payload || !ALLOWED_ROLES.includes(payload.role)) {
    return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 });
  }
  return null;
}

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
  const err = await checkRole(request);
  if (err) return err;
  const { id } = await params;
  return handler.PUT(request, id);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const err = await checkRole(request);
  if (err) return err;
  const { id } = await params;
  return handler.DELETE(request, id);
}
