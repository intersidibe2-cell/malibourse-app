import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get("limit") || "50");
    const offset = parseInt(url.searchParams.get("offset") || "0");
    const categorie = url.searchParams.get("categorie") || "";

    let sql = `SELECT * FROM annonces WHERE statut = 'Publié'`;
    const params: unknown[] = [];

    if (categorie) {
      params.push(categorie);
      sql += ` AND categorie = $${params.length}`;
    }

    sql += ` ORDER BY date_publication DESC, created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await query(sql, params);
    return NextResponse.json({ data: result.rows });
  } catch (error) {
    console.error("GET annonces public error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
