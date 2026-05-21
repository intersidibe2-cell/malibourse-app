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
    const search = url.searchParams.get("search") || "";
    const statusFilter = url.searchParams.get("status") || "";
    const categorieFilter = url.searchParams.get("categorie") || "";
    const limit = parseInt(url.searchParams.get("limit") || "100");
    const offset = parseInt(url.searchParams.get("offset") || "0");

    let sql = "SELECT * FROM telechargements";
    const params: unknown[] = [];
    const conditions: string[] = [];

    if (search) {
      params.push(`%${search}%`);
      conditions.push(`(LOWER(titre) LIKE LOWER($${params.length}) OR LOWER(description) LIKE LOWER($${params.length}))`);
    }

    if (statusFilter) {
      params.push(statusFilter);
      conditions.push(`statut = $${params.length}`);
    }

    if (categorieFilter) {
      params.push(categorieFilter);
      conditions.push(`categorie = $${params.length}`);
    }

    if (conditions.length > 0) {
      sql += " WHERE " + conditions.join(" AND ");
    }

    sql += ` ORDER BY ordre ASC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await query(sql, params);
    return NextResponse.json({ data: result.rows, total: result.rows.length });
  } catch (error) {
    console.error("GET telechargements error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authError = await checkAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { titre, description, categorie, fichier_url, taille_fichier, icone, ordre, statut } = body;

    if (!titre || !fichier_url) {
      return NextResponse.json({ error: "Titre et fichier requis" }, { status: 400 });
    }

    const result = await query(
      `INSERT INTO telechargements (titre, description, categorie, fichier_url, taille_fichier, icone, ordre, statut)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [titre, description || "", categorie || "Documents", fichier_url, taille_fichier || 0, icone || "file", ordre || 0, statut || "Brouillon"]
    );

    return NextResponse.json({ data: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error("POST telechargements error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
