"use client";

import { useState, useEffect } from "react";
import {
  GraduationCap, BookOpen, Shield, Briefcase, MapPin, House,
  CalendarDays, Plane, CalendarCheck, IdCard, HelpCircle, Download,
  Wallet, Search, User, MessageSquare, AlertTriangle, Megaphone,
  CheckCircle, ExternalLink, Globe, QrCode, Printer,
  Landmark, Eye, Calculator, Users, Building2,
} from "lucide-react";

const QR_SIZE = 280;
const QR_API = "https://api.qrserver.com/v1/create-qr-code";

interface Service {
  icon: any;
  title: string;
  desc: string;
  href: string;
  color: string;
  category: string;
}

const services: Service[] = [
  { icon: GraduationCap, title: "Inscription Étudiant", desc: "Boursier, contractuel ou militaire", href: "/inscription", color: "from-emerald-500 to-green-600", category: "Inscription" },
  { icon: CalendarDays, title: "Congé Académique", desc: "Médical, familial ou académique", href: "/conges/demander", color: "from-cyan-500 to-blue-600", category: "Demande" },
  { icon: Plane, title: "Billet de Voyage", desc: "Vacances et rapatriement", href: "/billets/demander", color: "from-purple-500 to-pink-600", category: "Demande" },
  { icon: CalendarCheck, title: "Rendez-vous Consulaire", desc: "Visa, passeport, légalisation", href: "/rdv", color: "from-violet-500 to-purple-600", category: "Rendez-vous" },
  { icon: IdCard, title: "Renouvellement Passeport", desc: "Demande en ligne", href: "/renouvellement-passeport", color: "from-rose-500 to-pink-600", category: "Demande" },
  { icon: MessageSquare, title: "Doléances", desc: "Réclamation, suggestion", href: "/doleances/soumettre", color: "from-purple-400 to-purple-500", category: "Communication" },
  { icon: AlertTriangle, title: "Signalement Urgence", desc: "Incident, urgence critique", href: "/signalements/soumettre", color: "from-orange-500 to-red-600", category: "Urgence" },
  { icon: MapPin, title: "Déclaration d'Arrivée", desc: "Signaler votre arrivée en Russie", href: "/declaration-arrivee", color: "from-blue-500 to-blue-600", category: "Déclaration" },
  { icon: BookOpen, title: "Enregistrement Contractuel", desc: "Inscription étudiant contractuel", href: "/enregistrement-contractuel", color: "from-blue-400 to-indigo-500", category: "Inscription" },
  { icon: HelpCircle, title: "FAQ", desc: "Questions fréquentes", href: "/faq", color: "from-sky-500 to-cyan-600", category: "Information" },
  { icon: Download, title: "Téléchargements", desc: "Formulaires et guides", href: "/telechargements", color: "from-indigo-500 to-blue-600", category: "Information" },
  { icon: Wallet, title: "Bourses d'Études", desc: "Calendrier, montants", href: "/bourses", color: "from-emerald-500 to-teal-600", category: "Information" },
  { icon: Search, title: "Suivi de Demande", desc: "Avec votre référence", href: "/suivi", color: "from-orange-500 to-amber-600", category: "Suivi" },
  { icon: User, title: "Espace Étudiant", desc: "Votre dossier personnel", href: "/espace-etudiant", color: "from-blue-500 to-indigo-600", category: "Espace personnel" },
  { icon: Megaphone, title: "Actualités", desc: "Annonces et communiqués", href: "/actualites", color: "from-green-500 to-emerald-600", category: "Information" },
];

function StatCard({ label, value, icon: Icon, color }: { label: string; value: string; icon: any; color: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 text-center hover:shadow-lg transition-shadow">
      <div className={`w-10 h-10 mx-auto mb-3 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-xs text-gray-500 mt-1">{label}</div>
    </div>
  );
}

export default function DemoPage() {
  const [baseUrl, setBaseUrl] = useState("");
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    setBaseUrl(window.location.origin);
    fetch("/api/stats/ministere")
      .then(r => r.json())
      .then(d => setStats(d))
      .catch(() => {});
  }, []);

  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const categories = ["Tous", ...new Set(services.map(s => s.category))];

  const filtered = selectedCategory === "Tous" ? services : services.filter(s => s.category === selectedCategory);

  const qrUrl = (path: string) => `${QR_API}?size=${QR_SIZE}x${QR_SIZE}&data=${encodeURIComponent(baseUrl + path)}&margin=12&bgcolor=ffffff&color=1a3a1a`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top band */}
      <div className="flex h-2">
        <div className="flex-1 bg-green-600" />
        <div className="flex-1 bg-yellow-400" />
        <div className="flex-1 bg-red-600" />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-green-700 to-green-500 shadow-lg mb-4">
            <span className="text-2xl font-bold text-white">M</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-green-900 mb-2">
            Plateforme Numérique
          </h1>
          <p className="text-lg text-gray-500 mb-1">
            Ambassade de la République du Mali en Fédération de Russie
          </p>
          <p className="text-sm text-gray-400">
            Gestion des ressortissants maliens — Moscou
          </p>
          <div className="mt-4 flex items-center justify-center gap-4 text-sm">
            <span className="flex items-center gap-1 text-green-700"><CheckCircle className="w-4 h-4" /> 15 services en ligne</span>
            <span className="flex items-center gap-1 text-green-700"><Globe className="w-4 h-4" /> etudiantsmali.ru</span>
            <span className="flex items-center gap-1 text-green-700"><QrCode className="w-4 h-4" /> Accès par QR code</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <StatCard label="Étudiants inscrits" value={stats ? String(stats.totalEtudiants || 0) : "—"} icon={GraduationCap} color="from-emerald-500 to-green-600" />
          <StatCard label="Bourses versées (12 mois)" value={stats ? `${(stats.paiements?.total_paye || 0).toLocaleString()} ₽` : "—"} icon={Wallet} color="from-blue-500 to-blue-600" />
          <StatCard label="Arrivées signalées" value={stats ? String(stats.arrives || 0) : "—"} icon={MapPin} color="from-purple-500 to-purple-600" />
          <StatCard label="Diplômes attendus" value={stats ? String(stats.diplomes || 0) : "—"} icon={GraduationCap} color="from-amber-500 to-orange-600" />
        </div>

        {/* Services avec QR Codes */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Services disponibles</h2>
              <p className="text-sm text-gray-500">Scannez un QR code pour accéder directement au service</p>
            </div>
            <Printer className="w-5 h-5 text-gray-400" />
          </div>

          {/* Filtres */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map(cat => (
              <button key={cat} onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  selectedCategory === cat
                    ? "bg-green-700 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {filtered.map((s, i) => {
              const Icon = s.icon;
              const fullUrl = baseUrl + s.href;
              return (
                <div key={i} className="group bg-gray-50 rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all hover:-translate-y-0.5">
                  {/* QR Code */}
                  <div className="flex justify-center mb-3">
                    {baseUrl ? (
                      <img
                        src={qrUrl(s.href)}
                        alt={`QR Code ${s.title}`}
                        width={QR_SIZE > 200 ? 200 : QR_SIZE}
                        height={QR_SIZE > 200 ? 200 : QR_SIZE}
                        className="rounded-lg border border-gray-200"
                        style={{ imageRendering: "pixelated" }}
                      />
                    ) : (
                      <div className="w-[200px] h-[200px] bg-gray-100 rounded-lg flex items-center justify-center">
                        <QrCode className="w-12 h-12 text-gray-300" />
                      </div>
                    )}
                  </div>
                  {/* Label */}
                  <div className="text-center">
                    <div className={`w-8 h-8 mx-auto mb-2 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-0.5">{s.title}</h3>
                    <p className="text-[10px] text-gray-400 mb-2">{s.desc}</p>
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-[10px] text-gray-400 truncate max-w-[130px]">{fullUrl}</span>
                      <a href={fullUrl} target="_blank" rel="noopener noreferrer" className="text-green-700 hover:text-green-800 shrink-0">
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Utilité par profil */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Utilité pour chaque profil</h2>
          <p className="text-sm text-gray-500 mb-6">Ce que chaque acteur peut faire concrètement avec la plateforme</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Ambassadeur */}
            <div className="bg-amber-50 rounded-xl border border-amber-200 p-5 md:col-span-2">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center shadow-md shrink-0">
                  <Landmark className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-base font-bold text-amber-900">Ambassadeur</h3>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-200 text-amber-800">Supervision</span>
                  </div>
                  <p className="text-xs text-amber-700 leading-relaxed mb-3">
                    Vision complète et en temps réel de la communauté malienne en Russie.
                    Plus besoin d'attendre des rapports papier — tout est accessible depuis un tableau de bord unique.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div className="bg-white/70 rounded-lg p-3 border border-amber-100">
                      <div className="text-lg font-bold text-amber-800">360°</div>
                      <div className="text-[10px] text-amber-600">Vision globale de tous les services et modules</div>
                    </div>
                    <div className="bg-white/70 rounded-lg p-3 border border-amber-100">
                      <div className="text-lg font-bold text-amber-800">1 clic</div>
                      <div className="text-[10px] text-amber-600">Valider ou refuser une inscription, suivre les alertes</div>
                    </div>
                    <div className="bg-white/70 rounded-lg p-3 border border-amber-100">
                      <div className="text-lg font-bold text-amber-800">Export</div>
                      <div className="text-[10px] text-amber-600">Rapports Excel pour le Ministère de tutelle</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Comptable */}
            <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center shadow shrink-0">
                  <Calculator className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-sm font-bold text-emerald-900">Agent Comptable</h3>
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-emerald-200 text-emerald-800">Finances</span>
                  </div>
                  <ul className="space-y-1 text-xs text-emerald-700">
                    <li className="flex items-start gap-1.5"><CheckCircle className="w-3 h-3 mt-0.5 shrink-0" /> Suivi des paiements mensuels de bourse</li>
                    <li className="flex items-start gap-1.5"><CheckCircle className="w-3 h-3 mt-0.5 shrink-0" /> Historique des versements par étudiant</li>
                    <li className="flex items-start gap-1.5"><CheckCircle className="w-3 h-3 mt-0.5 shrink-0" /> Génération de fichiers bancaires (Excel)</li>
                    <li className="flex items-start gap-1.5"><CheckCircle className="w-3 h-3 mt-0.5 shrink-0" /> Tableau de bord des montants versés</li>
                    <li className="flex items-start gap-1.5"><CheckCircle className="w-3 h-3 mt-0.5 shrink-0" /> Pas de saisie manuelle → gagne des heures/semaine</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Conseiller Culturel */}
            <div className="bg-blue-50 rounded-xl border border-blue-200 p-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow shrink-0">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-sm font-bold text-blue-900">Conseiller Culturel</h3>
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-blue-200 text-blue-800">Étudiants</span>
                  </div>
                  <ul className="space-y-1 text-xs text-blue-700">
                    <li className="flex items-start gap-1.5"><CheckCircle className="w-3 h-3 mt-0.5 shrink-0" /> Gestion des inscriptions étudiantes en ligne</li>
                    <li className="flex items-start gap-1.5"><CheckCircle className="w-3 h-3 mt-0.5 shrink-0" /> Validation des dossiers (boursiers + contractuels)</li>
                    <li className="flex items-start gap-1.5"><CheckCircle className="w-3 h-3 mt-0.5 shrink-0" /> Publication d'annonces et communiqués</li>
                    <li className="flex items-start gap-1.5"><CheckCircle className="w-3 h-3 mt-0.5 shrink-0" /> Suivi des congés académiques</li>
                    <li className="flex items-start gap-1.5"><CheckCircle className="w-3 h-3 mt-0.5 shrink-0" /> Plus de paperasse — tout est numérique</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Ministère (Bamako) */}
            <div className="bg-purple-50 rounded-xl border border-purple-200 p-5 md:col-span-2">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center shadow-md shrink-0">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-base font-bold text-purple-900">Ministère de l'Éducation Supérieure — Bamako</h3>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-purple-200 text-purple-800">Tutelle</span>
                  </div>
                  <p className="text-xs text-purple-700 leading-relaxed mb-3">
                    Accès distant depuis Bamako aux données des boursiers maliens en Russie.
                    Fini les appels téléphoniques et les courriers — le Ministère consulte en temps réel
                    les effectifs, les universités fréquentées, les filières et le budget alloué.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div className="bg-white/70 rounded-lg p-3 border border-purple-100">
                      <div className="text-lg font-bold text-purple-800">Temps réel</div>
                      <div className="text-[10px] text-purple-600">Effectifs, universités, filières mis à jour en direct</div>
                    </div>
                    <div className="bg-white/70 rounded-lg p-3 border border-purple-100">
                      <div className="text-lg font-bold text-purple-800">Propositions</div>
                      <div className="text-[10px] text-purple-600">Le Ministère propose, l'Ambassade valide</div>
                    </div>
                    <div className="bg-white/70 rounded-lg p-3 border border-purple-100">
                      <div className="text-lg font-bold text-purple-800">Budget</div>
                      <div className="text-[10px] text-purple-600">Suivi des bourses versées, exports Excel</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-gradient-to-r from-green-700 to-green-600 rounded-2xl p-6 md:p-8 text-center text-white">
          <h2 className="text-xl font-bold mb-2">Ambassade de la République du Mali</h2>
          <p className="text-green-100 text-sm mb-4">11, rue Novokouznetskaïa — Moscou</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-green-100">
            <span>📞 +7 495 951-06-55</span>
            <span>✉️ amaliru@mail.ru</span>
            <span>🌐 etudiantsmali.ru</span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-400">
          <p>Plateforme développée pour l'Ambassade de la République du Mali en Fédération de Russie © 2026</p>
        </div>
      </div>
    </div>
  );
}
