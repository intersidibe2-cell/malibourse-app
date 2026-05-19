import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { etudiant_nom, etudiant_prenom, telephone, email, type, titre, description } = body;

    if (!titre || !description) {
      return NextResponse.json({ error: "Titre et description requis" }, { status: 400 });
    }

    const result = await query(
      `INSERT INTO doleances (etudiant_nom, etudiant_prenom, telephone, email, type, titre, description, priorite, statut)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'Normale', 'Nouveau') RETURNING *`,
      [etudiant_nom || "", etudiant_prenom || "", telephone || "", email || "", type || "", titre, description]
    );

    return NextResponse.json({ data: result.rows[0], message: "Doléance soumise avec succès" }, { status: 201 });
  } catch (error) {
    console.error("Public doleance error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
