import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

const TABLES = [
  { table: "conges_academiques", label: "Congé Académique" },
  { table: "billets_voyage", label: "Billet de Voyage" },
  { table: "signalements", label: "Signalement" },
  { table: "rendez_vous", label: "Rendez-vous" },
  { table: "renouvellements_passeport", label: "Renouvellement Passeport" },
] as const;

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const reference = url.searchParams.get("reference");

    if (!reference) {
      return NextResponse.json({ error: "Paramètre reference requis" }, { status: 400 });
    }

    for (const { table, label } of TABLES) {
      const result = await query(`SELECT * FROM ${table} WHERE reference = $1`, [reference]);
      if (result.rows.length > 0) {
        return NextResponse.json({
          data: result.rows[0],
          table,
          label,
        });
      }
    }

    return NextResponse.json({ error: "Aucun dossier trouvé avec cette référence" }, { status: 404 });
  } catch (error) {
    console.error("GET suivi error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
