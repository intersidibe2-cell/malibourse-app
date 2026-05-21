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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await checkAuth(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    const body = await request.json();
    const allowedFields = ["question", "reponse", "categorie", "ordre", "statut"];
    const sets: string[] = [];
    const values: unknown[] = [];
    let idx = 1;

    for (const key of allowedFields) {
      if (body[key] !== undefined) {
        sets.push(`${key} = $${idx++}`);
        values.push(body[key]);
      }
    }

    if (sets.length === 0) {
      return NextResponse.json({ error: "Aucune donnée fournie" }, { status: 400 });
    }

    values.push(id);
    const sql = `UPDATE faq SET ${sets.join(", ")}, updated_at = NOW() WHERE id = $${idx} RETURNING *`;
    const result = await query(sql, values);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "FAQ introuvable" }, { status: 404 });
    }

    return NextResponse.json({ data: result.rows[0] });
  } catch (error) {
    console.error("PUT faq error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await checkAuth(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    const result = await query("DELETE FROM faq WHERE id = $1 RETURNING *", [id]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "FAQ introuvable" }, { status: 404 });
    }

    return NextResponse.json({ message: "FAQ supprimée avec succès" });
  } catch (error) {
    console.error("DELETE faq error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
