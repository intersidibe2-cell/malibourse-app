import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { verifyPassword, createToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Login et mot de passe requis" }, { status: 400 });
    }

    // Try login by username first, then by email
    const result = await query(
      "SELECT id, email, login, password_hash, nom, prenom, role, role_specifique FROM profiles WHERE login = $1 OR email = $1",
      [email.toLowerCase()]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Login ou mot de passe incorrect" }, { status: 401 });
    }

    const user = result.rows[0];
    const valid = await verifyPassword(password, user.password_hash);

    if (!valid) {
      return NextResponse.json({ error: "Login ou mot de passe incorrect" }, { status: 401 });
    }

    const role = user.role_specifique || user.role;
    const token = await createToken({ id: user.id, email: user.email, role });

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        login: user.login,
        nom: user.nom,
        prenom: user.prenom,
        role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
