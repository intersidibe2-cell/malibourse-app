import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import ExcelJS from "exceljs";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: "Token invalide" }, { status: 401 });

    const result = await query(`
      SELECT nom, prenom, date_naissance, sexe, numero_passeport,
             telephone, email, ville, universite, filiere, niveau,
             annee_etude, date_arrivee, date_fin_cycle, statut_bourse,
             montant_mensuel, source, statut_ministere
      FROM etudiants
      ORDER BY universite, filiere, nom
    `);

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Étudiants Boursiers");

    sheet.columns = [
      { header: "Nom", key: "nom", width: 25 },
      { header: "Prénom", key: "prenom", width: 25 },
      { header: "Date Naissance", key: "date_naissance", width: 16 },
      { header: "Sexe", key: "sexe", width: 8 },
      { header: "Passeport", key: "numero_passeport", width: 18 },
      { header: "Téléphone", key: "telephone", width: 18 },
      { header: "Email", key: "email", width: 32 },
      { header: "Ville (Mali)", key: "ville", width: 20 },
      { header: "Université", key: "universite", width: 30 },
      { header: "Filière", key: "filiere", width: 28 },
      { header: "Niveau", key: "niveau", width: 12 },
      { header: "Année", key: "annee_etude", width: 10 },
      { header: "Date Arrivée", key: "date_arrivee", width: 16 },
      { header: "Date Fin Cycle", key: "date_fin_cycle", width: 16 },
      { header: "Statut Bourse", key: "statut_bourse", width: 16 },
      { header: "Montant Mensuel", key: "montant_mensuel", width: 18 },
      { header: "Source", key: "source", width: 14 },
      { header: "Proposé par", key: "statut_ministere", width: 16 },
    ];

    const headerRow = sheet.getRow(1);
    headerRow.font = { bold: true, size: 11 };
    headerRow.height = 20;

    result.rows.forEach((row: any) => {
      sheet.addRow({
        nom: row.nom || "",
        prenom: row.prenom || "",
        date_naissance: row.date_naissance ? new Date(row.date_naissance).toLocaleDateString("fr-FR") : "",
        sexe: row.sexe || "",
        numero_passeport: row.numero_passeport || "",
        telephone: row.telephone || "",
        email: row.email || "",
        ville: row.ville || "",
        universite: row.universite || "",
        filiere: row.filiere || "",
        niveau: row.niveau || "",
        annee_etude: row.annee_etude || "",
        date_arrivee: row.date_arrivee ? new Date(row.date_arrivee).toLocaleDateString("fr-FR") : "",
        date_fin_cycle: row.date_fin_cycle ? new Date(row.date_fin_cycle).toLocaleDateString("fr-FR") : "",
        statut_bourse: row.statut_bourse || "",
        montant_mensuel: row.montant_mensuel ? parseFloat(row.montant_mensuel).toLocaleString("fr-FR") : "",
        source: row.source || "",
        statut_ministere: row.statut_ministere || "",
      });
    });

    const today = new Date().toISOString().slice(0, 10);
    const filename = `etudiants_boursiers_${today}.xlsx`;

    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Export ministere error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
