import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

function generateReference(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return "RDV-" + result;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nom_complet, telephone, email, motif, description, date_souhaitee, creneau_horaire } = body;

    if (!nom_complet || !telephone || !motif || !date_souhaitee || !creneau_horaire) {
      return NextResponse.json({ error: "Nom, téléphone, motif, date souhaitée et créneau horaire requis" }, { status: 400 });
    }

    const reference = generateReference();

    const result = await query(
      `INSERT INTO rendez_vous (reference, nom_complet, telephone, email, motif, description, date_souhaitee, creneau_horaire, statut)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'En attente') RETURNING *`,
      [reference, nom_complet, telephone, email || "", motif, description || "", date_souhaitee, creneau_horaire]
    );

    return NextResponse.json({ data: result.rows[0], reference, message: "Rendez-vous enregistré avec succès. Votre référence est " + reference }, { status: 201 });
  } catch (error) {
    console.error("Public rdv error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
