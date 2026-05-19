import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { verifyPassword, createToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email et mot de passe requis" }, { status: 400 });
    }

    const result = await query(
      "SELECT id, email, password_hash, nom, prenom, role FROM profiles WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Email ou mot de passe incorrect" }, { status: 401 });
    }

    const user = result.rows[0];
    const valid = await verifyPassword(password, user.password_hash);

    if (!valid) {
      return NextResponse.json({ error: "Email ou mot de passe incorrect" }, { status: 401 });
    }

    const token = await createToken({ id: user.id, email: user.email, role: user.role });

    return NextResponse.json({
      token,
      user: { id: user.id, email: user.email, nom: user.nom, prenom: user.prenom, role: user.role },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
