"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Users, GraduationCap, CreditCard, Plane, MessageSquare, CalendarCheck } from "lucide-react";
import StatCard from "@/components/shared/StatCard";
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
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const res = await fetch("/api/stats");
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-green-700 border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{t("title")}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatCard title={t("totalEtudiants")} value={stats?.totalEtudiants ?? 0} icon={Users} color="green" />
        <StatCard title={t("boursiersActifs")} value={stats?.boursiersActifs ?? 0} icon={GraduationCap} color="gold" />
        <StatCard title={t("montantPayeMois")} value={`${(stats?.montantPayeMois ?? 0).toLocaleString()} RUB`} icon={CreditCard} color="blue" />
        <StatCard title={t("declarationsArrivee")} value={stats?.declarationsArrivee ?? 0} icon={Plane} color="purple" />
        <StatCard title={t("doleancesEnAttente")} value={stats?.doleancesEnAttente ?? 0} icon={MessageSquare} color="red" />
        <StatCard title={t("congesApprouves")} value={stats?.congesApprouves ?? 0} icon={CalendarCheck} color="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{t("statutBourses")}</h2>
          <BoursePieChart data={stats?.bourseStatus ?? []} />
        </div>
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{t("paiements6Mois")}</h2>
          <PaymentBarChart data={stats?.paiements6Mois ?? []} />
        </div>
      </div>
    </div>
  );
}
