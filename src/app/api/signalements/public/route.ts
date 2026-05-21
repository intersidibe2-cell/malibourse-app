import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nom_complet, telephone, email, type_signalement, titre, description, lieu, urgence } = body;

    if (!titre) {
      return NextResponse.json({ error: "Titre requis" }, { status: 400 });
    }

    const result = await query(
      `INSERT INTO signalements (nom_complet, telephone, email, type_signalement, titre, description, lieu, urgence, statut)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'Nouveau') RETURNING *`,
      [nom_complet || "", telephone || "", email || "", type_signalement || "Incident", titre, description || "", lieu || "", urgence || "Normale"]
    );

    return NextResponse.json({ data: result.rows[0], message: "Signalement soumis avec succès" }, { status: 201 });
  } catch (error) {
    console.error("Public signalement error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
