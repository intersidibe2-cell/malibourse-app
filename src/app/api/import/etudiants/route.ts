import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Non auth" }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: "Non auth" }, { status: 401 });

    const formData = await request.formData();
    const file = formData.get("file") as File;
    if (!file) return NextResponse.json({ error: "Fichier requis" }, { status: 400 });

    const text = await file.text();
    const lines = text.split("\n").filter(l => l.trim());

    let imported = 0;
    let errors: { line: number; reason: string }[] = [];

    for (let i = 1; i < lines.length; i++) {
      try {
        const cols = lines[i].split("\t");
        if (cols.length < 2) continue;
        const nom = cols[0]?.trim();
        const prenom = cols[1]?.trim();
        if (!nom || !prenom) { errors.push({ line: i + 1, reason: "Nom ou prénom manquant" }); continue; }
        await query(
          `INSERT INTO etudiants (nom, prenom, numero_passeport, telephone, email, universite, filiere, niveau, ville, montant_mensuel, devise, statut_bourse)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'Actif')`,
          [
            nom, prenom, cols[2]?.trim() || null, cols[3]?.trim() || null,
            cols[4]?.trim() || null, cols[5]?.trim() || null, cols[6]?.trim() || null,
            cols[7]?.trim() || null, cols[8]?.trim() || null,
            cols[9] ? parseFloat(cols[9]) : null, cols[10]?.trim() || "RUB",
          ]
        );
        imported++;
      } catch (e: any) {
        errors.push({ line: i + 1, reason: e.message?.substring(0, 100) || "Erreur" });
      }
    }

    return NextResponse.json({
      success: true, imported, errors, total: lines.length - 1,
      message: `${imported} étudiants importés${errors.length ? `, ${errors.length} erreurs` : ""}`,
    });
  } catch (error) {
    console.error("Import error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
