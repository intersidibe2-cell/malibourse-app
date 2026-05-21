import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    const result = await query(
      `SELECT * FROM telechargements WHERE statut = 'Publié' ORDER BY ordre ASC`
    );
    return NextResponse.json({ data: result.rows });
  } catch (error) {
    console.error("GET telechargements public error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
