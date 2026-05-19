import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: "Token invalide" }, { status: 401 });

    const { mois, annee } = await request.json();
    if (!mois || !annee) {
      return NextResponse.json({ error: "Mois et année requis" }, { status: 400 });
    }

    const etudiantsActifs = await query(
      "SELECT id, nom, prenom, montant_mensuel, devise FROM etudiants WHERE statut_bourse = 'Actif' AND montant_mensuel > 0"
    );

    let created = 0;
    for (const etudiant of etudiantsActifs.rows) {
      const existing = await query(
        "SELECT id FROM paiements WHERE etudiant_id = $1 AND mois_concerne = $2 AND annee_concerne = $3 AND type_paiement = 'Bourse mensuelle'",
        [etudiant.id, mois, annee]
      );

      if (existing.rows.length === 0) {
        await query(
          `INSERT INTO paiements (etudiant_id, etudiant_nom, type_paiement, montant, devise, mois_concerne, annee_concerne, statut, date_paiement)
           VALUES ($1, $2, 'Bourse mensuelle', $3, $4, $5, $6, 'En attente', CURRENT_DATE)`,
          [etudiant.id, `${etudiant.nom} ${etudiant.prenom}`, etudiant.montant_mensuel, etudiant.devise, mois, annee]
        );
        created++;
      }
    }

    return NextResponse.json({ message: `${created} paiements créés`, created });
  } catch (error) {
    console.error("Bulk create error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
