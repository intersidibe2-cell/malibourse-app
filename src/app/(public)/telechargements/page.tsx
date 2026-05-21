"use client";

import { useState, useEffect } from "react";
import { Download, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

interface Telechargement {
  id: string;
  titre: string;
  description: string;
  fichier_url: string;
  categorie: string;
}

export default function TelechargementsPage() {
  const [items, setItems] = useState<Telechargement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/telechargements/public")
      .then((res) => { if (!res.ok) throw new Error("Erreur"); return res.json(); })
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const grouped = items.reduce<Record<string, Telechargement[]>>((acc, item) => {
    const cat = item.categorie || "Général";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="flex items-center gap-1 text-sm text-gray-500 hover:text-green-700 mb-6">
          <ArrowLeft className="w-4 h-4" /> Retour
        </Link>

        <div className="bg-white rounded-2xl shadow-lg border p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-md">
              <Download className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Téléchargements</h1>
              <p className="text-xs text-gray-500">Documents et formulaires à télécharger</p>
            </div>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-green-600" />
            </div>
          )}

          {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}

          {!loading && !error && items.length === 0 && (
            <div className="text-center py-12">
              <Download className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Aucun document disponible pour le moment</p>
            </div>
          )}

          {!loading && Object.keys(grouped).length > 0 && (
            <div className="space-y-6">
              {Object.entries(grouped).map(([categorie, docs]) => (
                <div key={categorie}>
                  <h2 className="text-sm font-semibold text-green-700 uppercase tracking-wide mb-3">{categorie}</h2>
                  <div className="space-y-3">
                    {docs.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between bg-gray-50 rounded-xl p-4 border">
                        <div className="flex-1 min-w-0 mr-4">
                          <p className="text-sm font-medium text-gray-900 truncate">{doc.titre}</p>
                          {doc.description && <p className="text-xs text-gray-500 mt-0.5 truncate">{doc.description}</p>}
                        </div>
                        <a
                          href={doc.fichier_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 shrink-0 px-3 py-2 rounded-lg bg-green-600 text-white text-xs hover:bg-green-700 transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" /> Télécharger
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
