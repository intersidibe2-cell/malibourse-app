import { NextRequest } from "next/server";
import { createEntityHandler } from "@/lib/entity-handler";

const handler = createEntityHandler({
  table: "etudiants",
  allowedFields: [
    "nom", "prenom", "date_naissance", "sexe", "numero_passeport",
    "telephone", "email", "ville", "adresse_residence", "universite",
    "filiere", "niveau", "annee_etude", "date_arrivee", "date_fin_cycle",
    "date_depart", "montant_mensuel", "devise", "statut_bourse",
    "type_bourse", "observations",
  ],
  searchFields: ["nom", "prenom", "numero_passeport", "universite"],
  orderField: "nom",
  orderDir: "ASC",
});

export async function GET(request: NextRequest) { return handler.GET(request); }
export async function POST(request: NextRequest) { return handler.POST(request); }
