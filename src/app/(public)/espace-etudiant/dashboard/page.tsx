"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  User, FileText, Calendar, RefreshCcw, Plane, MessageSquare,
  ArrowLeft, Loader2
} from "lucide-react";
import Link from "next/link";

interface StudentInfo {
  nom: string;
  prenom: string;
  telephone: string;
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function parseStudentInfo(): StudentInfo | null {
  try {
    const raw = getCookie("student_info");
    if (!raw) return null;
    const decoded = atob(raw);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

const services = [
  { label: "Suivre mes demandes", href: "/suivi", icon: FileText, color: "from-blue-400 to-blue-500" },
  { label: "Prendre RDV", href: "/rdv", icon: Calendar, color: "from-emerald-400 to-emerald-500" },
  { label: "Renouvellement passeport", href: "/renouvellement-passeport", icon: RefreshCcw, color: "from-purple-400 to-purple-500" },
  { label: "Demander un congé", href: "/conges/demander", icon: Plane, color: "from-amber-400 to-amber-500" },
  { label: "Billet de voyage", href: "/billets/demander", icon: Plane, color: "from-rose-400 to-rose-500" },
  { label: "Soumettre un signalement", href: "/signalements/soumettre", icon: MessageSquare, color: "from-orange-400 to-orange-500" },
];

export default function EtudiantDashboardPage() {
  const router = useRouter();
  const [student, setStudent] = useState<StudentInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const info = parseStudentInfo();
    if (info) {
      setStudent(info);
      setLoading(false);
      return;
    }

    const token = getCookie("token_etudiant");
    if (!token) {
      router.replace("/espace-etudiant");
      return;
    }

    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.user) {
          setStudent({ nom: data.user.nom, prenom: data.user.prenom, telephone: data.user.telephone });
        } else {
          router.replace("/espace-etudiant");
        }
      })
      .catch(() => router.replace("/espace-etudiant"))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-green-700" />
      </div>
    );
  }

  if (!student) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/espace-etudiant" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-green-700 mb-6">
          <ArrowLeft className="w-4 h-4" /> Retour
        </Link>

        <div className="bg-white rounded-2xl shadow-lg border p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-md">
              <User className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {student.prenom} {student.nom}
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">{student.telephone}</p>
            </div>
          </div>
        </div>

        <h2 className="text-lg font-semibold text-gray-800 mb-4">Mes services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((svc, i) => {
            const Icon = svc.icon;
            return (
              <Link key={i} href={svc.href}>
                <div className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-gray-200 transition-all cursor-pointer group">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${svc.color} flex items-center justify-center shadow-sm mb-3 group-hover:scale-105 transition-transform`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 group-hover:text-green-700 transition-colors">
                    {svc.label}
                  </h3>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
