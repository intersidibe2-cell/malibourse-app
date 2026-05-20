import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { hashPassword, verifyToken } from "@/lib/auth";

async function checkAdmin(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  if (!token) return null;
  const payload = await verifyToken(token);
  if (!payload || payload.role !== "admin") return null;
  return payload;
}

export async function GET(request: NextRequest) {
  const admin = await checkAdmin(request);
  if (!admin) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  try {
    const result = await query("SELECT id, email, nom, prenom, role, role_specifique FROM profiles ORDER BY role, nom");
    return NextResponse.json({ data: result.rows });
  } catch { return NextResponse.json({ error: "Erreur" }, { status: 500 }); }
}

export async function POST(request: NextRequest) {
  const admin = await checkAdmin(request);
  if (!admin) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  try {
    const { email, nom, prenom, password, role } = await request.json();
    if (!email || !password) return NextResponse.json({ error: "Email et mot de passe requis" }, { status: 400 });
    const existing = await query("SELECT id FROM profiles WHERE email = $1", [email]);
    if (existing.rows.length > 0) return NextResponse.json({ error: "Email déjà utilisé" }, { status: 409 });
    const passwordHash = await hashPassword(password);
    await query(
      "INSERT INTO profiles (email, nom, prenom, password_hash, role, role_specifique) VALUES ($1, $2, $3, $4, $5, $5)",
      [email, nom || "", prenom || "", passwordHash, role || "secretariat"]
    );
    return NextResponse.json({ success: true }, { status: 201 });
  } catch { return NextResponse.json({ error: "Erreur" }, { status: 500 }); }
}

export async function DELETE(request: NextRequest) {
  const admin = await checkAdmin(request);
  if (!admin) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  try {
    const id = request.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID requis" }, { status: 400 });
    await query("DELETE FROM profiles WHERE id = $1 AND role != 'admin'", [id]);
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ error: "Erreur" }, { status: 500 }); }
}
