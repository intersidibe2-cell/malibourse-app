import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { etudiant_nom, etudiant_prenom, email, telephone, type_conge, motif, date_debut, date_fin, pieces_jointes } = body;

    if (!type_conge || !motif || !date_debut || !date_fin) {
      return NextResponse.json({ error: "Type, motif, date début et date fin requis" }, { status: 400 });
    }

    const pj = pieces_jointes && Array.isArray(pieces_jointes) ? JSON.stringify(pieces_jointes) : "[]";

    const result = await query(
      `INSERT INTO conges_academiques (etudiant_nom, email, type_conge, motif, date_debut, date_fin, pieces_jointes, statut)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'Demande') RETURNING *`,
      [`${etudiant_prenom || ""} ${etudiant_nom || ""}`.trim(), email || telephone || "", type_conge, motif, date_debut, date_fin, pj]
    );

    return NextResponse.json({ data: result.rows[0], message: "Demande de congé soumise avec succès" }, { status: 201 });
  } catch (error) {
    console.error("Public conge error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
