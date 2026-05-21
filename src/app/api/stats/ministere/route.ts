import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: "Token invalide" }, { status: 401 });

    const [totalEtudiants, parUniversite, parFiliere, parNiveau, parSexe, parStatut, parSource, paiements, arrives, conges, diplomes] = await Promise.all([
      query("SELECT COUNT(*) as total FROM etudiants"),
      query("SELECT universite, COUNT(*) as count FROM etudiants WHERE universite IS NOT NULL AND universite != '' GROUP BY universite ORDER BY count DESC"),
      query("SELECT filiere, COUNT(*) as count FROM etudiants WHERE filiere IS NOT NULL AND filiere != '' GROUP BY filiere ORDER BY count DESC"),
      query("SELECT niveau, COUNT(*) as count FROM etudiants WHERE niveau IS NOT NULL AND niveau != '' GROUP BY niveau ORDER BY count DESC"),
      query("SELECT sexe, COUNT(*) as count FROM etudiants WHERE sexe IS NOT NULL GROUP BY sexe"),
      query("SELECT statut_bourse, COUNT(*) as count FROM etudiants GROUP BY statut_bourse ORDER BY count DESC"),
      query("SELECT source, COUNT(*) as count FROM etudiants WHERE source IS NOT NULL GROUP BY source"),
      query("SELECT COALESCE(SUM(montant), 0) as total_paye, COUNT(*) as total_paiements FROM paiements WHERE statut = 'Payé' AND date_paiement >= NOW() - INTERVAL '12 months'"),
      query("SELECT COUNT(*) as total FROM declarations_arrivee WHERE created_at >= NOW() - INTERVAL '12 months'"),
      query("SELECT COUNT(*) as total FROM conges_academiques WHERE statut = 'Approuvé' AND date_debut >= NOW() - INTERVAL '12 months'"),
      query("SELECT COUNT(*) as total FROM etudiants WHERE date_fin_cycle BETWEEN NOW() AND NOW() + INTERVAL '12 months'"),
    ]);

    return NextResponse.json({
      totalEtudiants: parseInt(totalEtudiants.rows[0].total),
      parUniversite: parUniversite.rows,
      parFiliere: parFiliere.rows,
      parNiveau: parNiveau.rows,
      parSexe: parSexe.rows,
      parStatut: parStatut.rows,
      parSource: parSource.rows,
      paiements: { total_paye: parseFloat(paiements.rows[0].total_paye), total_paiements: parseInt(paiements.rows[0].total_paiements) },
      arrives: parseInt(arrives.rows[0].total),
      conges: parseInt(conges.rows[0].total),
      diplomes: parseInt(diplomes.rows[0].total),
    });
  } catch (error) {
    console.error("Stats ministere error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
