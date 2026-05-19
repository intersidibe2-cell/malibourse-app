"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { TriangleAlert, Loader2 } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import StatusBadge from "@/components/shared/StatusBadge";

interface SuiviData {
  etudiantsEnRetard: { nom: string; prenom: string; universite: string; mois_impayes: number; montant_total: number }[];
  paiementsEnAttente: any[];
}

export default function SuiviBoursiersPage() {
  const t = useTranslations();
  const [data, setData] = useState<SuiviData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const url = "/api/etudiants?search=&limit=500";
      const res = await fetch(url);
      const json = await res.json();
      const today = new Date().toISOString().slice(0, 10);

      const etudiants = (json.data || []).filter((e: any) => e.statut_bourse === "Actif");
      const enRetard = etudiants.filter((e: any) => e.date_fin_cycle && e.date_fin_cycle < today);

      setData({
        etudiantsEnRetard: enRetard.map((e: any) => ({
          nom: e.nom,
          prenom: e.prenom,
          universite: e.universite || "-",
          mois_impayes: 0,
          montant_total: e.montant_mensuel || 0,
        })),
        paiementsEnAttente: [],
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-green-700" /></div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <TriangleAlert className="w-6 h-6 text-amber-500" />
        {t("nav.suiviBoursiers")}
      </h1>

      {(!data || data.etudiantsEnRetard.length === 0) ? (
        <div className="bg-white rounded-lg border p-8 text-center text-gray-500">Aucun retard détecté.</div>
      ) : (
        <div className="bg-white rounded-lg border overflow-hidden">
          <div className="p-4 bg-amber-50 border-b border-amber-200">
            <p className="text-amber-800 font-medium">
              {data.etudiantsEnRetard.length} étudiant(s) avec fin de cycle dépassée
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Étudiant</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Université</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">Montant mensuel</th>
                  <th className="text-center px-4 py-3 font-medium text-gray-600">Statut</th>
                </tr>
              </thead>
              <tbody>
                {data.etudiantsEnRetard.map((e, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{e.prenom} {e.nom}</td>
                    <td className="px-4 py-3">{e.universite}</td>
                    <td className="px-4 py-3 text-right">{formatCurrency(e.montant_total)}</td>
                    <td className="px-4 py-3 text-center">
                      <StatusBadge status="Terminé" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
