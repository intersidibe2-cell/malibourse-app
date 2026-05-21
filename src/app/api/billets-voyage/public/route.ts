import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { etudiant_nom, etudiant_prenom, email, telephone, numero_passeport, universite, ville, type_billet, annee_academique, date_depart_prevu, date_retour_prevu, itineraire, motif_demande, pieces_jointes } = body;

    if (!type_billet || !date_depart_prevu) {
      return NextResponse.json({ error: "Type de billet et date départ requis" }, { status: 400 });
    }

    const pj = pieces_jointes && Array.isArray(pieces_jointes) ? JSON.stringify(pieces_jointes) : "[]";

    const result = await query(
      `INSERT INTO billets_voyage (etudiant_nom, etudiant_prenom, email, numero_passeport, universite, ville, type_billet, annee_academique, date_depart_prevu, date_retour_prevu, itineraire, motif_demande, pieces_jointes, statut)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, 'Demande soumise') RETURNING *`,
      [etudiant_nom || "", etudiant_prenom || "", email || telephone || "", numero_passeport || "", universite || "", ville || "", type_billet, annee_academique || "", date_depart_prevu, date_retour_prevu || null, itineraire || "", motif_demande || "", pj]
    );

    return NextResponse.json({ data: result.rows[0], message: "Demande de billet soumise avec succès" }, { status: 201 });
  } catch (error) {
    console.error("Public billet error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
