import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { profil, nom, prenom, numero_passeport, email, telephone_rus, photo_id, passeport_id, ...rest } = body;

    if (!nom || !prenom || !numero_passeport) {
      return NextResponse.json({ error: "Nom, prénom et passeport obligatoires" }, { status: 400 });
    }

    const result = await query(
      `INSERT INTO etudiants (nom, prenom, date_naissance, sexe, numero_passeport, telephone, email, ville, universite, filiere, niveau, date_arrivee, date_fin_cycle, montant_mensuel, statut_bourse, observations)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, 'En attente', $15) RETURNING id`,
      [
        nom, prenom,
        rest.date_naissance || null,
        rest.sexe || null,
        numero_passeport,
        telephone_rus || null,
        email || null,
        rest.ville || null,
        rest.universite || null,
        rest.filiere || null,
        rest.niveau || null,
        rest.date_arrivee || null,
        rest.date_fin_cycle || null,
        rest.montant_mensuel ? parseFloat(rest.montant_mensuel) : null,
        `Inscription via site web - Profil: ${profil || ""}`,
      ]
    );

    // Save bank details if provided
    if (rest.banque && rest.compte) {
      await query(
        `INSERT INTO coordonnees_bancaires (etudiant_id, banque, bik, compte) VALUES ($1, $2, $3, $4)`,
        [result.rows[0].id, rest.banque, rest.bik || null, rest.compte]
      );
    }

    // Link uploaded files to etudiant
    if (photo_id) {
      await query(`UPDATE fichiers SET etudiant_id = $1 WHERE id = $2`, [result.rows[0].id, photo_id]);
    }
    if (passeport_id) {
      await query(`UPDATE fichiers SET etudiant_id = $1 WHERE id = $2`, [result.rows[0].id, passeport_id]);
    }

    return NextResponse.json({ success: true, id: result.rows[0].id, message: "Inscription réussie" }, { status: 201 });
  } catch (error) {
    console.error("Inscription error:", error);
    return NextResponse.json({ error: "Erreur lors de l'inscription" }, { status: 500 });
  }
}
