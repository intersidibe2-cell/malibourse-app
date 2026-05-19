import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nom, prenom, date_naissance, numero_passeport, date_arrivee, ville_arrivee, motif_sejour, adresse_sejour, telephone, email } = body;

    if (!nom || !prenom || !numero_passeport) {
      return NextResponse.json({ error: "Nom, prénom et passeport requis" }, { status: 400 });
    }

    const result = await query(
      `INSERT INTO declarations_arrivee (nom, prenom, date_naissance, numero_passeport, date_arrivee, ville_arrivee, motif_sejour, adresse_sejour, telephone, email, statut)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'En attente') RETURNING *`,
      [nom, prenom, date_naissance || null, numero_passeport, date_arrivee || null, ville_arrivee || "", motif_sejour || "", adresse_sejour || "", telephone || "", email || ""]
    );

    return NextResponse.json({ data: result.rows[0], message: "Déclaration soumise avec succès" }, { status: 201 });
  } catch (error) {
    console.error("Public declaration error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
