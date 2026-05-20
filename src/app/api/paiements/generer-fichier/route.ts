import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Non auth" }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: "Non auth" }, { status: 401 });

    const { mois, annee, format } = await request.json();
    if (!mois || !annee) return NextResponse.json({ error: "Mois et année requis" }, { status: 400 });

    // Get all active students with bank details
    const students = await query(`
      SELECT e.nom, e.prenom, e.numero_passeport, e.universite, e.montant_mensuel, e.devise, e.id,
             cb.banque, cb.bik, cb.compte, cb.nom_compte_ru
      FROM etudiants e
      LEFT JOIN coordonnees_bancaires cb ON cb.etudiant_id = e.id
      WHERE e.statut_bourse = 'Actif' AND e.montant_mensuel > 0
      ORDER BY e.nom, e.prenom
    `);

    // Generate data for the file
    const total = students.rows.reduce((sum: number, s: any) => sum + parseFloat(s.montant_mensuel || "0"), 0);

    let content = `FICHIER DE PAIEMENT - ${mois.toUpperCase()} ${annee}\n`;
    content += `Ambassade du Mali à Moscou\n`;
    content += `Total: ${students.rows.length} étudiants | ${total.toLocaleString()} ${students.rows[0]?.devise || "RUB"}\n\n`;
    content += "N°\tNom\tPrénom\tPasseport\tUniversité\tMontant\tDevise\tBanque\tБИК\tCompte\n";

    students.rows.forEach((s: any, i: number) => {
      content += `${i + 1}\t${s.nom}\t${s.prenom}\t${s.numero_passeport || "-"}\t${s.universite || "-"}\t${s.montant_mensuel}\t${s.devise || "RUB"}\t${s.banque || "-"}\t${s.bik || "-"}\t${s.compte || "-"}\n`;
    });

    return NextResponse.json({
      success: true,
      total_students: students.rows.length,
      total_amount: total,
      devise: students.rows[0]?.devise || "RUB",
      content,
      filename: `paiement_${mois}_${annee}`,
    });
  } catch (error) {
    console.error("Generate file error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
