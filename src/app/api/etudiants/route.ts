import { NextRequest } from "next/server";
import { createEntityHandler } from "@/lib/entity-handler";
import { verifyToken } from "@/lib/auth";

const handler = createEntityHandler({
  table: "etudiants",
  allowedFields: [
    "nom", "prenom", "date_naissance", "sexe", "numero_passeport",
    "telephone", "email", "ville", "adresse_residence", "universite",
    "filiere", "niveau", "annee_etude", "date_arrivee", "date_fin_cycle",
    "date_depart", "montant_mensuel", "devise", "statut_bourse",
    "type_bourse", "observations", "source", "propose_par", "statut_ministere",
  ],
  searchFields: ["nom", "prenom", "numero_passeport", "universite"],
  orderField: "nom",
  orderDir: "ASC",
});

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const source = url.searchParams.get("source") || "";
  const statutMinistere = url.searchParams.get("statut_ministere") || "";
  const res = await handler.GET(request);
  if (res.status !== 200) return res;
  const data = await res.json();
  let filtered = data.data || [];
  if (source) filtered = filtered.filter((r: any) => r.source === source);
  if (statutMinistere) filtered = filtered.filter((r: any) => r.statut_ministere === statutMinistere);
  return new Response(JSON.stringify({ data: filtered, total: filtered.length }), { status: 200, headers: { "Content-Type": "application/json" } });
}

export async function POST(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  let role = "";
  if (token) {
    const payload = await verifyToken(token);
    if (payload) role = payload.role;
  }
  const body = await request.json();
  if (role === "ministere") {
    body.source = "ministere";
    body.propose_par = "ministère";
    body.statut_ministere = "Proposé";
    body.statut_bourse = body.statut_bourse || "En attente";
  } else if (role === "ambassadeur") {
    body.source = body.source || "ambassade";
    body.propose_par = body.propose_par || "ambassade";
    body.statut_ministere = "Approuvé";
    body.statut_bourse = body.statut_bourse || "Actif";
  }
  const req = new NextRequest(request.url, {
    method: request.method,
    headers: request.headers,
    body: JSON.stringify(body),
    cache: request.cache,
    credentials: request.credentials,
    integrity: request.integrity,
    keepalive: request.keepalive,
    mode: request.mode,
    redirect: request.redirect,
    referrer: request.referrer,
    referrerPolicy: request.referrerPolicy,
    signal: request.signal,
  });
  return handler.POST(req);
}
