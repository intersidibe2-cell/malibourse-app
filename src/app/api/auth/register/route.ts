import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { hashPassword, createToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email, password, nom, prenom } = await request.json();

    if (!email || !password || !nom || !prenom) {
      return NextResponse.json({ error: "Tous les champs sont requis" }, { status: 400 });
    }

    const existing = await query("SELECT id FROM profiles WHERE email = $1", [email]);
    if (existing.rows.length > 0) {
      return NextResponse.json({ error: "Cet email est déjà utilisé" }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const result = await query(
      `INSERT INTO profiles (email, nom, prenom, password_hash, role)
       VALUES ($1, $2, $3, $4, 'user') RETURNING id, email, nom, prenom, role`,
      [email, nom, prenom, passwordHash]
    );

    const user = result.rows[0];
    const token = await createToken({ id: user.id, email: user.email, role: user.role });

    return NextResponse.json({ token, user });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
