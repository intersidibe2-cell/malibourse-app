"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Users, GraduationCap, CreditCard, Plane, MessageSquare, CalendarCheck,
  ArrowUpRight, Bell, BookOpen, Shield, Briefcase, MapPin, Lock
} from "lucide-react";
import BoursePieChart from "@/components/charts/BoursePieChart";
import PaymentBarChart from "@/components/charts/PaymentBarChart";

interface DashboardStats {
  totalEtudiants: number;
  boursiersActifs: number;
  montantPayeMois: number;
  declarationsArrivee: number;
  doleancesEnAttente: number;
  congesApprouves: number;
  bourseStatus: { name: string; value: number }[];
  paiements6Mois: { mois: string; total: number }[];
}

export default function DashboardPage() {
  const t = useTranslations("dashboard");
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const now = new Date();
    setCurrentDate(now.toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" }));
    fetchStats();
    fetch("/api/auth/me").then(r => r.json()).then(d => setUser(d.user)).catch(() => {});
  }, []);

  async function fetchStats() {
    try {
      const res = await fetch("/api/stats");
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  }

  const roleBadge: Record<string, string> = {
    ambassadeur: "bg-yellow-50 text-yellow-700 border-yellow-200",
    culturel: "bg-blue-50 text-blue-700 border-blue-200",
    comptable: "bg-emerald-50 text-emerald-700 border-emerald-200",
    consulaire: "bg-purple-50 text-purple-700 border-purple-200",
    defense: "bg-red-50 text-red-700 border-red-200",
    secretariat: "bg-gray-50 text-gray-700 border-gray-200",
  };

  const roleLabels: Record<string, string> = {
    ambassadeur: "Ambassadeur", culturel: "Culturel", comptable: "Comptable",
    consulaire: "Consulaire", defense: "Défense", secretariat: "Secrétariat",
  };

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="animate-spin rounded-full h-8 w-8 border-3 border-green-700 border-t-transparent" />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Bonjour, {user?.prenom || "Agent"}</h1>
          <p className="text-xs text-gray-400 mt-0.5">{currentDate}</p>
        </div>
        <div className="flex items-center gap-3">
          {user?.role_specifique && (
            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${roleBadge[user.role_specifique] || "bg-gray-50 text-gray-700"}`}>
              {roleLabels[user.role_specifique] || user.role_specifique}
            </span>
          )}
          <button className="relative p-2 rounded-lg bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors">
            <Bell className="w-4 h-4 text-gray-500" />
            {stats?.doleancesEnAttente ? <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] text-white flex items-center justify-center font-bold">{stats.doleancesEnAttente}</span> : null}
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {[
          { label: "Étudiants", value: stats?.totalEtudiants ?? 0, icon: Users, color: "from-blue-400 to-blue-500" },
          { label: "Boursiers actifs", value: stats?.boursiersActifs ?? 0, icon: GraduationCap, color: "from-emerald-400 to-emerald-500" },
          { label: "Paiements (mois)", value: `${((stats?.montantPayeMois ?? 0)/1000).toFixed(0)}k`, icon: CreditCard, color: "from-yellow-400 to-amber-500" },
          { label: "Arrivées", value: stats?.declarationsArrivee ?? 0, icon: Plane, color: "from-purple-400 to-purple-500" },
          { label: "Doléances", value: stats?.doleancesEnAttente ?? 0, icon: MessageSquare, color: "from-rose-400 to-rose-500" },
          { label: "Congés approuvés", value: stats?.congesApprouves ?? 0, icon: CalendarCheck, color: "from-teal-400 to-teal-500" },
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

      {/* Quick actions */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { label: "Ajouter étudiant", href: "/dashboard/etudiants", icon: GraduationCap },
          { label: "Paiements", href: "/dashboard/paiements", icon: CreditCard },
          { label: "Doléances", href: "/dashboard/doleances", icon: MessageSquare },
          { label: "Arrivées", href: "/dashboard/declarations-arrivee", icon: Plane },
        ].map((a, i) => {
          const Icon = a.icon;
          return (
            <a key={i} href={a.href} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-medium text-gray-600 hover:border-gray-300 hover:text-gray-900 transition-all">
              <Icon className="w-3.5 h-3.5" />
              {a.label}
            </a>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut des bourses</h3>
          </div>
          <BoursePieChart data={stats?.bourseStatus ?? []} />
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Paiements (6 mois)</h3>
          </div>
          <PaymentBarChart data={stats?.paiements6Mois ?? []} />
        </div>
      </div>

      {/* Pending alert */}
      {stats?.doleancesEnAttente ? (
        <div className="flex items-center gap-3 p-3.5 bg-amber-50 border border-amber-100 rounded-xl mb-6">
          <Bell className="w-4 h-4 text-amber-600 shrink-0" />
          <p className="text-xs text-amber-800 flex-1">
            <span className="font-medium">{stats.doleancesEnAttente}</span> doléance{stats.doleancesEnAttente > 1 ? "s" : ""} en attente
          </p>
          <button onClick={() => router.push("/dashboard/doleances")} className="text-xs text-amber-700 font-medium hover:underline flex items-center gap-0.5">
            Voir <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
      ) : null}

      {/* Modules */}
      <div>
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Modules</h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
          {[
            { label: "Boursiers", href: "/dashboard/etudiants", icon: GraduationCap },
            { label: "Contractuels", href: "/dashboard/etudiants-contractuels", icon: BookOpen },
            { label: "Militaires", href: "/dashboard/etudiants-militaires", icon: Shield },
            { label: "Paiements", href: "/dashboard/paiements", icon: CreditCard },
            { label: "Travailleurs", href: "/dashboard/travailleurs", icon: Briefcase },
            { label: "Visiteurs", href: "/dashboard/visiteurs", icon: MapPin },
            { label: "Sans papiers", href: "/dashboard/sans-papiers", icon: Lock },
            { label: "Admin", href: "/dashboard/admin", icon: Users },
          ].map((m, i) => {
            const Icon = m.icon;
            return (
              <a key={i} href={m.href} className="flex flex-col items-center gap-1.5 p-3 rounded-lg border border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm transition-all">
                <Icon className="w-4 h-4 text-gray-500" />
                <span className="text-[10px] text-gray-500 text-center leading-tight">{m.label}</span>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
