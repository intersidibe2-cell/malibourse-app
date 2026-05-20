"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { GraduationCap, BookOpen, Shield, Briefcase, MapPin, House, FileQuestion, Lock, ArrowRight, Globe, Users, Heart, Scale, Plane } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const locale = useLocale();

  const services = [
    { icon: GraduationCap, title: "Étudiants Boursiers", desc: "Suivi des bourses, paiements, congés académiques", href: "/inscription" },
    { icon: BookOpen, title: "Étudiants Contractuels", desc: "Enregistrement et suivi des étudiants non boursiers", href: "/inscription" },
    { icon: Shield, title: "Étudiants Militaires", desc: "Formation et suivi des officiers maliens en Russie", href: "/inscription" },
    { icon: Briefcase, title: "Travailleurs", desc: "Accompagnement des travailleurs maliens", href: "/inscription" },
    { icon: MapPin, title: "Visiteurs & Touristes", desc: "Déclaration d'arrivée et assistance", href: "/inscription" },
    { icon: House, title: "Résidents Permanents", desc: "Suivi des Maliens établis en Russie", href: "/inscription" },
    { icon: FileQuestion, title: "Sans Papiers", desc: "Aide aux Maliens en situation irrégulière (confidentiel)", href: "/inscription" },
    { icon: Lock, title: "Assistance Détention", desc: "Suivi consulaire des compatriotes détenus", href: "/inscription" },
  ];

  const stats = [
    { value: "360+", label: "Étudiants Boursiers" },
    { value: "120+", label: "Étudiants Contractuels" },
    { value: "200+", label: "Résidents" },
    { value: "80+", label: "Travailleurs" },
  ];

  const toggleLocale = () => {
    const newLocale = locale === "fr" ? "ru" : "fr";
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;
    router.refresh();
  };

  return (
    <div className="min-h-screen">
      {/* Tricolore band */}
      <div className="flex h-2">
        <div className="flex-1 bg-green-600" />
        <div className="flex-1 bg-yellow-400" />
        <div className="flex-1 bg-red-600" />
      </div>

      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-400 flex items-center justify-center text-white font-bold">
              M
            </div>
            <div>
              <div className="font-bold text-green-900 text-sm leading-tight">Ambassade du Mali à Moscou</div>
              <div className="text-xs text-gray-500">République du Mali</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={toggleLocale} className="flex items-center gap-1 text-sm text-gray-500 hover:text-green-700">
              <Globe className="w-4 h-4" />
              {locale === "fr" ? "RU" : "FR"}
            </button>
            <Link href="/ambassade/login" className="text-sm text-green-700 hover:text-green-800 font-medium hidden md:block">
              Espace Ambassade
            </Link>
            <Button size="sm" onClick={() => router.push("/inscription")}>
              S'inscrire
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #14532d 0%, #166534 50%, #15803d 100%)" }}>
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "40px 40px" }} />
        <div className="max-w-7xl mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-yellow-400" />
              <span className="text-yellow-300 text-sm font-medium">Ambassade de la République du Mali à Moscou</span>
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Plateforme Numérique de Gestion des Ressortissants Maliens en Russie
            </h1>
            <p className="text-lg md:text-xl text-green-100 mb-8 max-w-2xl">
              L'Ambassade du Mali à Moscou œuvre au quotidien pour une meilleure gestion 
              et un accompagnement de proximité de ses ressortissants sur l'ensemble 
              du territoire de la Fédération de Russie.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" onClick={() => router.push("/inscription")} className="bg-yellow-500 hover:bg-yellow-600 text-green-900 font-bold">
                S'inscrire dès maintenant
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => router.push("/declaration-arrivee")} className="bg-white/10 text-white border-white/30 hover:bg-white/20">
                Déclaration d'Arrivée
              </Button>
              <Button size="lg" variant="outline" onClick={() => router.push("/doleances/soumettre")} className="bg-white/10 text-white border-white/30 hover:bg-white/20">
                Soumettre une Doléance
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* Stats */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-green-700">{s.value}</div>
                <div className="text-sm text-gray-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-green-900 mb-4">L'Ambassade à vos côtés</h2>
          <p className="text-gray-600 max-w-3xl mx-auto mb-12">
            L'Ambassade de la République du Mali à Moscou assure la protection et l'accompagnement 
            de ses ressortissants en Fédération de Russie à travers des services dédiés 
            pour chaque situation.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl border p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-green-100 flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-green-700" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Service des Études</h3>
              <p className="text-sm text-gray-500">Gestion des bourses, suivi académique et accompagnement des étudiants maliens dans les universités russes.</p>
            </div>
            <div className="bg-white rounded-xl border p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-yellow-100 flex items-center justify-center">
                <Heart className="w-6 h-6 text-yellow-700" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Service Consulaire</h3>
              <p className="text-sm text-gray-500">Assistance administrative, légalisations, renouvellement de passeports, et suivi des situations urgentes.</p>
            </div>
            <div className="bg-white rounded-xl border p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-red-100 flex items-center justify-center">
                <Scale className="w-6 h-6 text-red-700" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Protection Consulaire</h3>
              <p className="text-sm text-gray-500">Assistance juridique, visites consulaires, et accompagnement des compatriotes en détention ou en difficulté.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-green-900 mb-4">Nos Services aux Ressortissants</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Que vous soyez étudiant, travailleur, visiteur ou résident, l'Ambassade vous accompagne 
              dans toutes vos démarches en Russie.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {services.map((s, i) => {
              const Icon = s.icon;
              return (
                <a key={i} href={s.href} className="bg-gray-50 rounded-xl border p-5 hover:shadow-md hover:border-green-200 transition-all cursor-pointer group">
                  <div className="w-10 h-10 mb-3 rounded-lg bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <Icon className="w-5 h-5 text-green-700" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1 text-sm">{s.title}</h3>
                  <p className="text-xs text-gray-500">{s.desc}</p>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16" style={{ background: "linear-gradient(135deg, #14532d 0%, #15803d 100%)" }}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Besoin d'aide ou d'information ?</h2>
          <p className="text-green-100 mb-8">
            L'Ambassade du Mali à Moscou est à votre disposition pour toute question. 
            Inscrivez-vous sur la plateforme pour faciliter vos démarches.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" onClick={() => router.push("/inscription")} className="bg-yellow-500 hover:bg-yellow-600 text-green-900 font-bold">
              S'inscrire sur la plateforme
            </Button>
            <Button size="lg" variant="outline" onClick={() => router.push("/doleances/soumettre")} className="bg-white/10 text-white border-white/30 hover:bg-white/20">
              Contacter l'Ambassade
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-900 text-white py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-400 flex items-center justify-center text-white font-bold text-sm">M</div>
                <span className="font-bold">Ambassade du Mali</span>
              </div>
              <p className="text-green-300 text-sm">Fédération de Russie — Moscou</p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-yellow-400">Liens utiles</h4>
              <ul className="space-y-2 text-sm text-green-200">
                <li><a href="/inscription" className="hover:text-white">Inscription</a></li>
                <li><a href="/declaration-arrivee" className="hover:text-white">Déclaration d'Arrivée</a></li>
                <li><a href="/doleances/soumettre" className="hover:text-white">Soumettre une Doléance</a></li>
                <li><a href="/presentation" className="hover:text-white">À propos</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-yellow-400">Contact</h4>
              <ul className="space-y-2 text-sm text-green-200">
                <li>Ambassade de la République du Mali</li>
                <li>Moscou, Fédération de Russie</li>
                <li><a href="#" className="hover:text-white">Email : contact@etudiantsmali.ru</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-green-700 pt-6 text-center text-sm text-green-400">
            <p>© 2026 Ambassade de la République du Mali à Moscou — Plateforme Numérique de Gestion des Ressortissants</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
