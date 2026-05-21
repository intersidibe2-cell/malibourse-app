import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    const result = await query(
      `SELECT * FROM faq WHERE statut = 'Publié' ORDER BY ordre ASC`
    );

    const grouped: Record<string, typeof result.rows> = {};
    for (const row of result.rows) {
      const cat = row.categorie || "Général";
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(row);
    }

    return NextResponse.json({ data: grouped });
  } catch (error) {
    console.error("GET faq public error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
