import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

type EntityConfig = {
  table: string;
  idField?: string;
  allowedFields: string[];
  searchFields?: string[];
  orderField?: string;
  orderDir?: "ASC" | "DESC";
  requireAuth?: boolean;
};

export function createEntityHandler(config: EntityConfig) {
  const { table, idField = "id", allowedFields, searchFields = [], orderField = "created_at", orderDir = "DESC", requireAuth = true } = config;

  const columns = allowedFields.join(", ");

  async function checkAuth(request: NextRequest) {
    if (!requireAuth) return null;
    const token = request.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: "Token invalide" }, { status: 401 });
    return null;
  }

  return {
    async GET(request: NextRequest) {
      const authError = await checkAuth(request);
      if (authError) return authError;

      try {
        const url = new URL(request.url);
        const search = url.searchParams.get("search") || "";
        const statusFilter = url.searchParams.get("status") || "";
        const limit = parseInt(url.searchParams.get("limit") || "100");
        const offset = parseInt(url.searchParams.get("offset") || "0");

        let sql = `SELECT * FROM ${table}`;
        const params: unknown[] = [];
        const conditions: string[] = [];

        if (search && searchFields.length > 0) {
          const searchConditions = searchFields.map((field, i) => {
            params.push(`%${search}%`);
            return `LOWER(${field}) LIKE LOWER($${params.length})`;
          });
          if (searchConditions.length > 0) {
            conditions.push(`(${searchConditions.join(" OR ")})`);
          }
        }

        if (statusFilter) {
          const statusField = table === "etudiants" ? "statut_bourse" : "statut";
          params.push(statusFilter);
          conditions.push(`${statusField} = $${params.length}`);
        }

        if (conditions.length > 0) {
          sql += " WHERE " + conditions.join(" AND ");
        }

        sql += ` ORDER BY ${orderField} ${orderDir} LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
        params.push(limit, offset);

        const result = await query(sql, params);
        return NextResponse.json({ data: result.rows, total: result.rows.length });
      } catch (error) {
        console.error(`GET ${table} error:`, error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
      }
    },

    async POST(request: NextRequest) {
      const authError = await checkAuth(request);
      if (authError) return authError;

      try {
        const body = await request.json();
        const fields: string[] = [];
        const values: unknown[] = [];
        const placeholders: string[] = [];
        let idx = 1;

        for (const key of allowedFields) {
          if (body[key] !== undefined) {
            fields.push(key);
            values.push(body[key]);
            placeholders.push(`$${idx++}`);
          }
        }

        if (fields.length === 0) {
          return NextResponse.json({ error: "Aucune donnée fournie" }, { status: 400 });
        }

        const sql = `INSERT INTO ${table} (${fields.join(", ")}) VALUES (${placeholders.join(", ")}) RETURNING *`;
        const result = await query(sql, values);
        return NextResponse.json({ data: result.rows[0] }, { status: 201 });
      } catch (error) {
        console.error(`POST ${table} error:`, error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
      }
    },

    async PUT(request: NextRequest, id: string) {
      const authError = await checkAuth(request);
      if (authError) return authError;

      try {
        const body = await request.json();
        const sets: string[] = [];
        const values: unknown[] = [];
        let idx = 1;

        for (const key of allowedFields) {
          if (body[key] !== undefined) {
            sets.push(`${key} = $${idx++}`);
            values.push(body[key]);
          }
        }

        if (sets.length === 0) {
          return NextResponse.json({ error: "Aucune donnée fournie" }, { status: 400 });
        }

        values.push(id);
        const sql = `UPDATE ${table} SET ${sets.join(", ")}, updated_at = NOW() WHERE ${idField} = $${idx} RETURNING *`;
        const result = await query(sql, values);

        if (result.rows.length === 0) {
          return NextResponse.json({ error: "Élément introuvable" }, { status: 404 });
        }

        return NextResponse.json({ data: result.rows[0] });
      } catch (error) {
        console.error(`PUT ${table} error:`, error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
      }
    },

    async DELETE(request: NextRequest, id: string) {
      const authError = await checkAuth(request);
      if (authError) return authError;

      try {
        const sql = `DELETE FROM ${table} WHERE ${idField} = $1 RETURNING *`;
        const result = await query(sql, [id]);

        if (result.rows.length === 0) {
          return NextResponse.json({ error: "Élément introuvable" }, { status: 404 });
        }

        return NextResponse.json({ message: "Supprimé avec succès" });
      } catch (error) {
        console.error(`DELETE ${table} error:`, error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
      }
    },
  };
}
