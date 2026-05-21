"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, CreditCard, Plane, GraduationCap, Download, CheckCircle, ChevronRight, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsMinistere {
  totalEtudiants: number;
  paiements: { total_paye: number; total_paiements: number };
  arrives: number;
  diplomes: number;
  parUniversite: { universite: string; count: number }[];
  parFiliere: { filiere: string; count: number }[];
  parStatut: { statut_bourse: string; count: number }[];
}

interface Etudiant {
  id: string;
  nom: string;
  prenom: string;
  universite: string;
  filiere: string;
  niveau: string;
  date_arrivee: string;
  telephone: string;
  email: string;
}

const statutColors: Record<string, string> = {
  Actif: "bg-green-100 text-green-700",
  Suspendu: "bg-yellow-100 text-yellow-700",
  Terminé: "bg-gray-100 text-gray-700",
  En_attente: "bg-blue-100 text-blue-700",
};

export default function MinistereDashboardPage() {
  const [stats, setStats] = useState<StatsMinistere | null>(null);
  const [pending, setPending] = useState<Etudiant[]>([]);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/stats/ministere").then(r => r.json()),
      fetch("/api/etudiants?source=ministere&statut_ministere=Proposé").then(r => r.json()),
    ]).then(([statsData, etudiantsData]) => {
      setStats(statsData);
      setPending(etudiantsData.data || []);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  async function handleApprove(id: string) {
    setApproving(id);
    try {
      const res = await fetch(`/api/etudiants/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statut_ministere: "Approuvé", statut_bourse: "Actif" }),
      });
      if (res.ok) {
        setPending(prev => prev.filter(e => e.id !== id));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setApproving(null);
    }
  }

  const maxUniv = Math.max(...(stats?.parUniversite?.slice(0, 10).map(u => u.count) || [1]));
  const maxFiliere = Math.max(...(stats?.parFiliere?.slice(0, 10).map(f => f.count) || [1]));
  const totalStatut = stats?.parStatut?.reduce((s, p) => s + p.count, 0) || 1;

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="animate-spin rounded-full h-8 w-8 border-3 border-green-700 border-t-transparent" />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Ministère de l'Éducation Supérieure</h1>
          <p className="text-xs text-gray-400 mt-0.5">Tableau de bord — Gestion des boursiers maliens en Russie</p>
        </div>
        <Link
          href="/api/export/ministere"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-700 text-white text-xs font-medium hover:bg-green-800 transition-colors"
        >
          <Download className="w-3.5 h-3.5" /> Export Excel
        </Link>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Étudiants", value: stats?.totalEtudiants ?? 0, icon: Users, color: "from-blue-400 to-blue-500" },
          { label: "Total payé (12 mois)", value: `${((stats?.paiements?.total_paye ?? 0) / 1000).toFixed(0)}k`, icon: CreditCard, color: "from-yellow-400 to-amber-500" },
          { label: "Arrivées (12 mois)", value: stats?.arrives ?? 0, icon: Plane, color: "from-purple-400 to-purple-500" },
          { label: "Diplômes attendus (12 mois)", value: stats?.diplomes ?? 0, icon: GraduationCap, color: "from-emerald-400 to-emerald-500" },
        ].map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-3.5 hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center shadow-sm`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
              </div>
              <p className="text-lg font-semibold text-gray-900">{card.value}</p>
              <p className="text-[11px] text-gray-400 mt-0.5">{card.label}</p>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Students per university */}
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Étudiants par université (Top 10)</h3>
          <div className="space-y-2">
            {stats?.parUniversite?.slice(0, 10).map((u) => (
              <div key={u.universite}>
                <div className="flex justify-between text-xs text-gray-600 mb-0.5">
                  <span className="truncate">{u.universite}</span>
                  <span className="font-medium">{u.count}</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${(u.count / maxUniv) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Students per filiere */}
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Étudiants par filière (Top 10)</h3>
          <div className="space-y-2">
            {stats?.parFiliere?.slice(0, 10).map((f) => (
              <div key={f.filiere}>
                <div className="flex justify-between text-xs text-gray-600 mb-0.5">
                  <span className="truncate">{f.filiere}</span>
                  <span className="font-medium">{f.count}</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${(f.count / maxFiliere) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Statut bourse pie */}
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Statut des bourses</h3>
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-32 h-32">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                {stats?.parStatut?.map((s, i, arr) => {
                  const pct = s.count / totalStatut;
                  const prevPct = arr.slice(0, i).reduce((a, b) => a + b.count / totalStatut, 0);
                  const colors = ["#059669", "#eab308", "#6b7280", "#3b82f6", "#8b5cf6"];
                  const r = 15.9155;
                  const circ = 2 * Math.PI * r;
                  const offset = prevPct * circ;
                  const len = pct * circ;
                  return (
                    <circle
                      key={s.statut_bourse}
                      cx="18" cy="18" r={r}
                      fill="none"
                      stroke={colors[i % colors.length]}
                      strokeWidth="3.5"
                      strokeDasharray={`${len} ${circ - len}`}
                      strokeDashoffset={-offset}
                      className="transition-all duration-500"
                    />
                  );
                })}
              </svg>
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              {stats?.parStatut?.map((s, i) => {
                const colors = ["#059669", "#eab308", "#6b7280", "#3b82f6", "#8b5cf6"];
                return (
                  <div key={s.statut_bourse} className="flex items-center gap-1.5 text-xs">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colors[i % colors.length] }} />
                    <span className="text-gray-600">{s.statut_bourse}</span>
                    <span className="font-medium text-gray-900">{s.count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Propositions en attente */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Propositions en attente</h3>
          <span className="text-xs text-gray-400">{pending.length} étudiant(s)</span>
        </div>
        {pending.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm">Aucune proposition en attente</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 px-2 font-medium text-gray-500">Nom</th>
                  <th className="text-left py-2 px-2 font-medium text-gray-500">Prénom</th>
                  <th className="text-left py-2 px-2 font-medium text-gray-500">Université</th>
                  <th className="text-left py-2 px-2 font-medium text-gray-500">Filière</th>
                  <th className="text-left py-2 px-2 font-medium text-gray-500">Niveau</th>
                  <th className="text-left py-2 px-2 font-medium text-gray-500">Téléphone</th>
                  <th className="text-right py-2 px-2 font-medium text-gray-500">Action</th>
                </tr>
              </thead>
              <tbody>
                {pending.map((e) => (
                  <tr key={e.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-2.5 px-2 font-medium text-gray-900">{e.nom}</td>
                    <td className="py-2.5 px-2 text-gray-700">{e.prenom}</td>
                    <td className="py-2.5 px-2 text-gray-700">{e.universite}</td>
                    <td className="py-2.5 px-2 text-gray-700">{e.filiere}</td>
                    <td className="py-2.5 px-2 text-gray-700">{e.niveau}</td>
                    <td className="py-2.5 px-2 text-gray-700">{e.telephone}</td>
                    <td className="py-2.5 px-2 text-right">
                      <button
                        onClick={() => handleApprove(e.id)}
                        disabled={approving === e.id}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-green-700 text-white text-[11px] font-medium hover:bg-green-800 disabled:opacity-50 transition-colors"
                      >
                        {approving === e.id ? (
                          <span className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent" />
                        ) : (
                          <CheckCircle className="w-3 h-3" />
                        )}
                        Approuver
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
