"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

const categorieColors: Record<string, string> = {
  "Note officielle": "bg-blue-100 text-blue-700",
  "Communiqué": "bg-purple-100 text-purple-700",
  "Information": "bg-green-100 text-green-700",
  "Avis": "bg-yellow-100 text-yellow-700",
  "Urgent": "bg-red-100 text-red-700 animate-pulse",
};

type Annonce = {
  id: string;
  titre: string;
  contenu: string;
  categorie: string;
  date_publication: string;
  created_at: string;
};

export default function ActualitesPage() {
  const [annonces, setAnnonces] = useState<Annonce[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/annonces/public?limit=50")
      .then((r) => r.json())
      .then((d) => { setAnnonces(d.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="flex items-center gap-1 text-sm text-gray-500 hover:text-green-700 mb-6">
          <ArrowLeft className="w-4 h-4" /> Retour à l&apos;accueil
        </Link>

        <h1 className="text-3xl font-bold text-green-900 mb-2">Actualités & Communiqués</h1>
        <p className="text-gray-500 mb-8">Annonces officielles de l&apos;Ambassade du Mali en Fédération de Russie</p>

        {loading ? (
          <div className="text-center py-12 text-gray-400">Chargement...</div>
        ) : annonces.length === 0 ? (
          <div className="text-center py-12 text-gray-400">Aucune actualité pour le moment.</div>
        ) : (
          <div className="space-y-4">
            {annonces.map((a) => (
              <div key={a.id} className="bg-white rounded-xl border p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-3">
                  <Badge className={categorieColors[a.categorie] || ""}>{a.categorie}</Badge>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(a.date_publication)}
                  </span>
                </div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">{a.titre}</h2>
                <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">{a.contenu}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
