"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Users, GraduationCap, CreditCard, Plane, MessageSquare, CalendarCheck,
  ArrowUpRight, Bell,
  BookOpen, Shield, Briefcase, MapPin, Lock
} from "lucide-react";
import { BoursePieChart } from "@/components/charts/BoursePieChart";
import { PaymentBarChart } from "@/components/charts/PaymentBarChart";

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
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    fetchStats();
    fetchUser();
    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  function updateTime() {
    setCurrentTime(new Date().toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" }));
  }

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

  async function fetchUser() {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      setUser(data.user);
    } catch {}
  }

  const quickActions = [
    { label: "Ajouter étudiant", href: "/dashboard/etudiants", icon: GraduationCap, color: "bg-blue-50 text-blue-600" },
    { label: "Nouvelle doléance", href: "/dashboard/doleances", icon: MessageSquare, color: "bg-purple-50 text-purple-600" },
    { label: "Générer paiements", href: "/dashboard/paiements", icon: CreditCard, color: "bg-green-50 text-green-600" },
    { label: "Déclarations arrivée", href: "/dashboard/declarations-arrivee", icon: Plane, color: "bg-amber-50 text-amber-600" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-green-700 border-t-transparent" />
          <p className="text-sm text-gray-400">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  const roleLabels: Record<string, string> = {
    ambassadeur: "Ambassadeur",
    culturel: "Conseiller Culturel",
    comptable: "Agent Comptable",
    consulaire: "Conseiller Consulaire",
    defense: "Attaché Défense",
    secretariat: "Secrétariat",
    admin: "Administrateur",
    user: "Utilisateur",
  };

  const roleBadge: Record<string, string> = {
    ambassadeur: "bg-yellow-100 text-yellow-800 border-yellow-200",
    culturel: "bg-blue-100 text-blue-800 border-blue-200",
    comptable: "bg-green-100 text-green-800 border-green-200",
    consulaire: "bg-purple-100 text-purple-800 border-purple-200",
    defense: "bg-red-100 text-red-800 border-red-200",
    secretariat: "bg-gray-100 text-gray-800 border-gray-200",
    admin: "bg-yellow-100 text-yellow-800 border-yellow-200",
  };

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Bonjour, {user?.prenom || "Agent"}</h1>
            <p className="text-sm text-gray-500 capitalize flex items-center gap-2 mt-1">
              {currentTime}
              {user?.role && (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${roleBadge[user?.role] || "bg-gray-100 text-gray-800"}`}>
                  {roleLabels[user?.role] || user?.role}
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-colors">
              <Bell className="w-5 h-5 text-gray-500" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">3</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
        {[
          { label: t("totalEtudiants"), value: stats?.totalEtudiants ?? 0, icon: Users, gradient: "from-blue-500 to-blue-600", change: "+12" },
          { label: t("boursiersActifs"), value: stats?.boursiersActifs ?? 0, icon: GraduationCap, gradient: "from-green-500 to-green-600", change: "+5" },
          { label: "Paiements ce mois", value: `${(stats?.montantPayeMois ?? 0).toLocaleString()} ₽`, icon: CreditCard, gradient: "from-yellow-500 to-amber-600", change: "+180K" },
          { label: t("declarationsArrivee"), value: stats?.declarationsArrivee ?? 0, icon: Plane, gradient: "from-purple-500 to-purple-600", change: "+3" },
          { label: t("doleancesEnAttente"), value: stats?.doleancesEnAttente ?? 0, icon: MessageSquare, gradient: "from-red-500 to-red-600", change: "-2" },
          { label: t("congesApprouves"), value: stats?.congesApprouves ?? 0, icon: CalendarCheck, gradient: "from-teal-500 to-teal-600", change: "+1" },
        ].map((card, i) => {
          const Icon = card.icon;
          const isPositive = card.change?.startsWith("+");
          return (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow group cursor-pointer">
              <div className="flex items-start justify-between">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-lg`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${isPositive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                  {isPositive ? "↑" : "↓"} {card.change}
                </span>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                <p className="text-sm text-gray-500 mt-0.5">{card.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Actions rapides</h2>
        <div className="flex flex-wrap gap-3">
          {quickActions.map((action, i) => {
            const Icon = action.icon;
            return (
              <a key={i} href={action.href} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all text-sm font-medium text-gray-700 group">
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${action.color} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-4 h-4" />
                </span>
                {action.label}
              </a>
            );
          })}
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-green-600" />
                {t("statutBourses")}
              </h2>
            <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">Aujourd'hui</span>
          </div>
          <BoursePieChart data={stats?.bourseStatus ?? []} />
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-yellow-600" />
              {t("paiements6Mois")}
            </h2>
            <span className="text-xs bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-full">6 derniers mois</span>
          </div>
          <PaymentBarChart data={stats?.paiements6Mois ?? []} />
        </div>
      </div>

      {/* Alertes en attente */}
      {stats?.doleancesEnAttente && stats.doleancesEnAttente > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
            <Bell className="w-5 h-5 text-amber-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-amber-800">
              {stats.doleancesEnAttente} doléance{stats.doleancesEnAttente > 1 ? "s" : ""} en attente de traitement
            </p>
            <p className="text-xs text-amber-600">Nécessite une action rapide</p>
          </div>
          <button onClick={() => router.push("/dashboard/doleances")} className="text-sm text-amber-700 font-medium hover:underline flex items-center gap-1">
            Voir <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Navigation rapide vers les modules */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Modules</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          {[
            { label: "Étudiants Boursiers", href: "/dashboard/etudiants", icon: GraduationCap, color: "text-blue-600 bg-blue-50" },
            { label: "Contractuels", href: "/dashboard/etudiants-contractuels", icon: BookOpen, color: "text-teal-600 bg-teal-50" },
            { label: "Militaires", href: "/dashboard/etudiants-militaires", icon: Shield, color: "text-amber-600 bg-amber-50" },
            { label: "Paiements", href: "/dashboard/paiements", icon: CreditCard, color: "text-green-600 bg-green-50" },
            { label: "Travailleurs", href: "/dashboard/travailleurs", icon: Briefcase, color: "text-orange-600 bg-orange-50" },
            { label: "Visiteurs", href: "/dashboard/visiteurs", icon: MapPin, color: "text-purple-600 bg-purple-50" },
            { label: "Sans Papiers", href: "/dashboard/sans-papiers", icon: Lock, color: "text-red-600 bg-red-50" },
            { label: "Alertes", href: "/dashboard/alertes", icon: Bell, color: "text-amber-600 bg-amber-50" },
          ].map((mod, i) => {
            const Icon = mod.icon;
            return (
              <a key={i} href={mod.href} className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 bg-white hover:shadow-md hover:border-gray-300 transition-all cursor-pointer group">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${mod.color} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs text-gray-600 text-center font-medium">{mod.label}</span>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
