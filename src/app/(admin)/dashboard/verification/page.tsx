"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function VerificationPage() {
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/etudiants?search=&limit=500").then(r => r.json()).then(d => {
      setData((d.data || []).filter((e: any) => e.statut_bourse === "En attente"));
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-4 border-green-700 border-t-transparent" /></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Inscriptions à vérifier</h1>
      {data.length === 0 ? (
        <div className="bg-white rounded-lg border p-8 text-center text-gray-500">Aucune inscription en attente</div>
      ) : (
        <div className="bg-white rounded-lg border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left px-4 py-3 font-medium text-gray-600">Nom</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Passeport</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Université</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Observations</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, i) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{item.prenom} {item.nom}</td>
                  <td className="px-4 py-3">{item.numero_passeport}</td>
                  <td className="px-4 py-3">{item.universite || "-"}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{item.observations || "-"}</td>
                  <td className="px-4 py-3">
                    <Button size="sm" variant="outline" onClick={() => {
                      fetch(`/api/etudiants/${item.id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ statut_bourse: "Actif" }),
                      }).then(() => window.location.reload());
                    }}>✅ Valider</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
