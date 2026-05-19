import { NextRequest } from "next/server";
import { createEntityHandler } from "@/lib/entity-handler";

const handler = createEntityHandler({
  table: "etudiants_militaires",
  allowedFields: [
    "nom", "prenom", "grade", "matricule", "numero_passeport",
    "date_naissance", "sexe", "telephone", "email",
    "etablissement_formation", "ville", "specialite", "type_formation",
    "duree_formation_annees", "annee_etude", "date_arrivee",
    "date_fin_formation", "arme_service", "montant_bourse_mensuelle",
    "devise", "contact_urgence_nom", "contact_urgence_telephone",
    "type_visa", "date_expiration_visa", "statut", "observations",
  ],
  searchFields: ["nom", "prenom", "matricule", "numero_passeport"],
  orderField: "nom",
  orderDir: "ASC",
});

export async function GET(request: NextRequest) { return handler.GET(request); }
export async function POST(request: NextRequest) { return handler.POST(request); }
