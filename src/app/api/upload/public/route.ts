import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { query } from "@/lib/db";

const ALLOWED_TYPES = ["photo", "passeport", "conge_demande", "conge_justificatif", "billet_demande", "billet_justificatif"];
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const type = (formData.get("type") as string) || "fichier";

    if (!file) return NextResponse.json({ error: "Fichier requis" }, { status: 400 });
    if (!ALLOWED_TYPES.includes(type)) return NextResponse.json({ error: "Type de fichier invalide" }, { status: 400 });
    if (file.size > MAX_SIZE) return NextResponse.json({ error: "Fichier trop volumineux (max 10 MB)" }, { status: 400 });

    const ext = file.name.split(".").pop()?.toLowerCase() || "pdf";
    const uuid = crypto.randomUUID();
    const fileName = `${uuid}.${ext}`;
    const subDir = type.startsWith("conge") ? "conges" : type.startsWith("billet") ? "billets" : type === "photo" ? "photos" : "passports";
    const uploadDir = join(process.cwd(), "public", "uploads", subDir);

    await mkdir(uploadDir, { recursive: true });
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(join(uploadDir, fileName), buffer);

    const fileUrl = `/uploads/${subDir}/${fileName}`;

    const result = await query(
      `INSERT INTO fichiers (type, chemin_fichier, nom_original, taille) VALUES ($1, $2, $3, $4) RETURNING *`,
      [type, fileUrl, file.name, file.size]
    );

    return NextResponse.json({
      id: result.rows[0].id,
      url: fileUrl,
      nom: file.name,
      type,
      taille: file.size,
    }, { status: 201 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Erreur lors de l'upload" }, { status: 500 });
  }
}
