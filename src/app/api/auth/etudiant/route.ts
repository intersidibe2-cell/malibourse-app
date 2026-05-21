import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { createToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { nom, prenom, telephone } = await request.json();

    if (!nom || !prenom || !telephone) {
      return NextResponse.json({ error: "Nom, prénom et téléphone requis" }, { status: 400 });
    }

    const result = await query(
      `SELECT id, nom, prenom, telephone, email, universite, niveau, filiere FROM inscriptions
       WHERE LOWER(nom) = LOWER($1) AND LOWER(prenom) = LOWER($2) AND telephone = $3`,
      [nom, prenom, telephone]
    );

    if (result.rows.length === 0) {
      const etudiantResult = await query(
        `SELECT id, nom, prenom, telephone, email, universite, niveau, filiere FROM etudiants
         WHERE LOWER(nom) = LOWER($1) AND LOWER(prenom) = LOWER($2) AND telephone = $3`,
        [nom, prenom, telephone]
      );

      if (etudiantResult.rows.length === 0) {
        return NextResponse.json({ error: "Étudiant non trouvé" }, { status: 401 });
      }

      const etudiant = etudiantResult.rows[0];
      const token = await createToken({ id: etudiant.id, email: etudiant.email || "", role: "etudiant" });

      return NextResponse.json({ token, user: etudiant });
    }

    const etudiant = result.rows[0];
    const token = await createToken({ id: etudiant.id, email: etudiant.email || "", role: "etudiant" });

    return NextResponse.json({ token, user: etudiant });
  } catch (error) {
    console.error("Etudiant login error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
