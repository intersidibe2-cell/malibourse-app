"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { hasAccess, type Role } from "@/lib/rbac";
import {
  Users, GraduationCap, CreditCard, Briefcase, MapPin,
  MessageSquare, AlertTriangle, Shield, BookOpen,
  FileQuestion, Lock, Plane,
} from "lucide-react";

export default function AmbassadeDashboard() {
  const t = useTranslations();
  const router = useRouter();
  const [role, setRole] = useState<Role | "">("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then(r => r.json())
      .then(d => {
        if (d.user?.role) setRole(d.user.role);
        else router.push("/ambassade/login");
      })
      .catch(() => router.push("/ambassade/login"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-4 border-green-700 border-t-transparent" /></div>;

  const modules = [
    { key: "etudiants", label: "Étudiants Boursiers", icon: GraduationCap, color: "bg-blue-50 text-blue-700 border-blue-200", href: "/ambassade/etudiants" },
    { key: "etudiants-contractuels", label: "Étudiants Contractuels", icon: BookOpen, color: "bg-teal-50 text-teal-700 border-teal-200", href: "/ambassade/etudiants-contractuels" },
    { key: "etudiants-militaires", label: "Étudiants Militaires", icon: Shield, color: "bg-olive-50 text-olive-700 border-olive-200", href: "/ambassade/etudiants-militaires" },
    { key: "paiements", label: "Paiements & Bourses", icon: CreditCard, color: "bg-green-50 text-green-700 border-green-200", href: "/ambassade/paiements" },
    { key: "travailleurs", label: "Travailleurs", icon: Briefcase, color: "bg-orange-50 text-orange-700 border-orange-200", href: "/ambassade/travailleurs" },
    { key: "visiteurs", label: "Visiteurs", icon: MapPin, color: "bg-purple-50 text-purple-700 border-purple-200", href: "/ambassade/visiteurs" },
    { key: "doleances", label: "Doléances", icon: MessageSquare, color: "bg-pink-50 text-pink-700 border-pink-200", href: "/ambassade/doleances" },
    { key: "verification", label: "Inscriptions à vérifier", icon: Users, color: "bg-amber-50 text-amber-700 border-amber-200", href: "/ambassade/verification" },
    { key: "sans-papiers", label: "Sans Papiers", icon: FileQuestion, color: "bg-red-50 text-red-700 border-red-200", href: "/ambassade/sans-papiers" },
    { key: "detentions", label: "Détentions", icon: Lock, color: "bg-gray-800 text-white border-gray-800", href: "/ambassade/detentions" },
    { key: "alertes", label: "Alertes", icon: AlertTriangle, color: "bg-yellow-50 text-yellow-700 border-yellow-200", href: "/ambassade/alertes" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Tableau de Bord</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {modules.filter(m => hasAccess(role as Role, m.key)).map((m) => {
          const Icon = m.icon;
          return (
            <a key={m.key} href={m.href} className={`${m.color} rounded-lg border p-5 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer`}>
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/80">
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm font-medium">{m.label}</div>
                <div className="text-xs opacity-70">Accéder →</div>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
