import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

function generateReference(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return "PAS-" + result;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nom_complet, telephone, email, numero_passeport, date_naissance, lieu_naissance, adresse_russie, motif_renouvellement, pieces_jointes } = body;

    if (!nom_complet || !telephone || !numero_passeport || !motif_renouvellement) {
      return NextResponse.json({ error: "Nom, téléphone, numéro passeport et motif requis" }, { status: 400 });
    }

    const reference = generateReference();
    const pj = pieces_jointes && Array.isArray(pieces_jointes) ? JSON.stringify(pieces_jointes) : "[]";

    const result = await query(
      `INSERT INTO renouvellements_passeport (reference, nom_complet, telephone, email, numero_passeport, date_naissance, lieu_naissance, adresse_russie, motif_renouvellement, pieces_jointes, statut)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'Demande') RETURNING *`,
      [reference, nom_complet, telephone, email || "", numero_passeport, date_naissance || "", lieu_naissance || "", adresse_russie || "", motif_renouvellement, pj]
    );

    return NextResponse.json({ data: result.rows[0], reference, message: "Demande de renouvellement soumise avec succès" }, { status: 201 });
  } catch (error) {
    console.error("Public renouvellement error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
