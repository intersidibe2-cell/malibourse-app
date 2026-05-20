import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nom, prenom, email, telephone, motif, description, date_souhaitee } = body;
    if (!nom || !prenom || !telephone) {
      return NextResponse.json({ error: "Nom, prénom et téléphone requis" }, { status: 400 });
    }
    await query(
      `INSERT INTO doleances (etudiant_nom, etudiant_prenom, telephone, email, type, titre, description, priorite, statut)
       VALUES ($1, $2, $3, $4, 'Demande administrative', $5, $6, 'Normale', 'Nouveau')`,
      [nom, prenom, telephone || "", email || "", `Demande d'audience - ${motif || "Non spécifié"}`, description || ""]
    );
    return NextResponse.json({ success: true, message: "Demande d'audience envoyée" }, { status: 201 });
  } catch (error) {
    console.error("Audience error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
