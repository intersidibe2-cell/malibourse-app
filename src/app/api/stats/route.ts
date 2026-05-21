import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: "Token invalide" }, { status: 401 });

    const [
      totalEtudiants,
      boursiersActifs,
      paiementsMois,
      declarationsArrivee,
      doleancesEnAttente,
      signalementsEnAttente,
      congesApprouves,
      bourseStatus,
      paiements6Mois,
    ] = await Promise.all([
      query("SELECT COUNT(*) FROM etudiants"),
      query("SELECT COUNT(*) FROM etudiants WHERE statut_bourse = 'Actif'"),
      query(`SELECT COALESCE(SUM(montant), 0) FROM paiements WHERE statut = 'Payé' AND date_paiement >= DATE_TRUNC('month', CURRENT_DATE)`),
      query("SELECT COUNT(*) FROM declarations_arrivee"),
      query("SELECT COUNT(*) FROM doleances WHERE statut IN ('Nouveau', 'En cours')"),
      query("SELECT COUNT(*) FROM signalements WHERE statut IN ('Nouveau', 'En cours')"),
      query("SELECT COUNT(*) FROM conges_academiques WHERE statut = 'Approuvé'"),
      query(`SELECT statut_bourse as name, COUNT(*) as value FROM etudiants GROUP BY statut_bourse`),
      query(`SELECT TO_CHAR(date_paiement, 'MM/YYYY') as mois, COALESCE(SUM(montant), 0) as total FROM paiements WHERE statut = 'Payé' AND date_paiement >= CURRENT_DATE - INTERVAL '6 months' GROUP BY mois ORDER BY MIN(date_paiement)`),
    ]);

    return NextResponse.json({
      totalEtudiants: parseInt(totalEtudiants.rows[0].count),
      boursiersActifs: parseInt(boursiersActifs.rows[0].count),
      montantPayeMois: parseFloat(paiementsMois.rows[0].coalesce),
      declarationsArrivee: parseInt(declarationsArrivee.rows[0].count),
      doleancesEnAttente: parseInt(doleancesEnAttente.rows[0].count),
      signalementsEnAttente: parseInt(signalementsEnAttente.rows[0].count),
      congesApprouves: parseInt(congesApprouves.rows[0].count),
      bourseStatus: bourseStatus.rows,
      paiements6Mois: paiements6Mois.rows,
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
