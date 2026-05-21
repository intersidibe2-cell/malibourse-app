"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, FileText, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

interface Demande {
  id: string;
  reference: string;
  type_demande: string;
  statut: string;
  date_soumission: string;
  details?: string;
}

export default function SuiviPage() {
  const [reference, setReference] = useState("");
  const [demandes, setDemandes] = useState<Demande[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reference.trim()) return;
    setLoading(true);
    setError("");
    setSearched(true);
    setDemandes(null);
    try {
      const res = await fetch(`/api/suivi?reference=${encodeURIComponent(reference.trim())}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      setDemandes(Array.isArray(data) ? data : [data]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
      setDemandes([]);
    } finally {
      setLoading(false);
    }
  };

  const statutBadge = (statut: string) => {
    const colors: Record<string, string> = {
      soumise: "bg-yellow-100 text-yellow-800",
      en_cours: "bg-blue-100 text-blue-800",
      traitee: "bg-green-100 text-green-800",
      rejetee: "bg-red-100 text-red-800",
      approuvee: "bg-green-100 text-green-800",
    };
    return colors[statut] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 py-8 px-4">
      <div className="max-w-lg mx-auto">
        <Link href="/" className="flex items-center gap-1 text-sm text-gray-500 hover:text-green-700 mb-6">
          <ArrowLeft className="w-4 h-4" /> Retour
        </Link>

        <div className="bg-white rounded-2xl shadow-lg border p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-md">
              <Search className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Suivi de Demande</h1>
              <p className="text-xs text-gray-500">Consultez l'état de votre demande avec votre référence</p>
            </div>
          </div>

          {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}

          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="Numéro de référence..."
              required
            />
            <Button type="submit" className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0 shrink-0" disabled={loading || !reference.trim()}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              Rechercher
            </Button>
          </form>

          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-green-600" />
            </div>
          )}

          {searched && !loading && demandes && demandes.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Aucune demande trouvée avec cette référence</p>
            </div>
          )}

          {searched && !loading && demandes && demandes.length > 0 && (
            <div className="mt-6 space-y-3">
              {demandes.map((d) => (
                <div key={d.id} className="bg-gray-50 rounded-xl p-4 border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-gray-500">{d.reference}</span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statutBadge(d.statut)}`}>
                      {d.statut}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{d.type_demande}</p>
                  <p className="text-xs text-gray-500 mt-1">Soumis le : {d.date_soumission}</p>
                  {d.details && <p className="text-xs text-gray-600 mt-1">{d.details}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
