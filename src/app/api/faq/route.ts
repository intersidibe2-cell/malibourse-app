import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

async function checkAuth(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  if (!token) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  const payload = await verifyToken(token);
  if (!payload) return NextResponse.json({ error: "Token invalide" }, { status: 401 });
  return null;
}

export async function GET(request: NextRequest) {
  const authError = await checkAuth(request);
  if (authError) return authError;

  try {
    const url = new URL(request.url);
    const statusFilter = url.searchParams.get("status") || "";
    const search = url.searchParams.get("search") || "";
    const limit = parseInt(url.searchParams.get("limit") || "100");
    const offset = parseInt(url.searchParams.get("offset") || "0");

    let sql = "SELECT * FROM faq";
    const params: unknown[] = [];
    const conditions: string[] = [];

    if (statusFilter) {
      params.push(statusFilter);
      conditions.push(`statut = $${params.length}`);
    }

    if (search) {
      params.push(`%${search}%`);
      conditions.push(`(LOWER(question) LIKE LOWER($${params.length}) OR LOWER(reponse) LIKE LOWER($${params.length}))`);
    }

    if (conditions.length > 0) {
      sql += " WHERE " + conditions.join(" AND ");
    }

    sql += ` ORDER BY ordre ASC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await query(sql, params);
    return NextResponse.json({ data: result.rows, total: result.rows.length });
  } catch (error) {
    console.error("GET faq error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authError = await checkAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { question, reponse, categorie, ordre, statut } = body;

    if (!question || !reponse) {
      return NextResponse.json({ error: "Question et réponse requis" }, { status: 400 });
    }

    const result = await query(
      `INSERT INTO faq (question, reponse, categorie, ordre, statut) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [question, reponse, categorie || "Général", ordre || 0, statut || "Brouillon"]
    );

    return NextResponse.json({ data: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error("POST faq error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
