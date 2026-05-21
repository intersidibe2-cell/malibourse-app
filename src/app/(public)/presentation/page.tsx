"use client";

import Link from "next/link";
import { ArrowLeft, Building2, Users, GraduationCap, Globe, Shield, Bell, BarChart3 } from "lucide-react";

export default function PresentationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      <div className="flex h-1.5">
        <div className="flex-1 bg-green-600" />
        <div className="flex-1 bg-yellow-400" />
        <div className="flex-1 bg-red-600" />
      </div>

      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-400 flex items-center justify-center text-white font-bold">
              M
            </div>
            <div>
              <span className="font-bold text-green-900">Ambassade du Mali en Fédération de Russie</span>
              <span className="text-gray-500 text-sm ml-2 hidden md:inline">Portail des Ressortissants</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-green-700 hover:text-green-800 font-medium">
              Ambassade
            </Link>
            <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
              Accueil
            </Link>
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-green-100 flex items-center justify-center">
          <Building2 className="w-8 h-8 text-green-700" />
        </div>
        <h1 className="text-3xl md:text-5xl font-bold text-green-900 mb-4">À propos</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
          L'Ambassade du Mali en Fédération de Russie met à disposition des ressortissants maliens
          une plateforme numérique centralisée pour la gestion des démarches consulaires, le suivi
          des dossiers et la communication avec les services de l'ambassade.
        </p>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: Globe, title: "Accessible en ligne", desc: "Gérez vos démarches depuis n'importe où, 24h/24 et 7j/7" },
              { icon: Bell, title: "Notifications", desc: "Alertes en temps réel pour le suivi de vos dossiers" },
              { icon: Shield, title: "Données protégées", desc: "Hébergement sécurisé en Russie, conformité RGPD" },
              { icon: BarChart3, title: "Suivi en temps réel", desc: "Tableau de bord dynamique avec statistiques actualisées" },
            ].map((f, i) => (
              <div key={i} className="bg-gray-50 rounded-xl border p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-green-100 flex items-center justify-center">
                  <f.icon className="w-6 h-6 text-green-700" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-green-900 mb-8 text-center">Services disponibles</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { href: "/inscription", title: "Inscription", desc: "Inscription des ressortissants maliens" },
            { href: "/conges/demander", title: "Congé académique", desc: "Demande de congé pour les étudiants" },
            { href: "/billets/demander", title: "Billet de voyage", desc: "Demande de billet ou rapatriement" },
            { href: "/signalements/soumettre", title: "Signalement", desc: "Signaler un incident ou une urgence" },
            { href: "/doleances/soumettre", title: "Doléances", desc: "Soumettre une réclamation" },
            { href: "/arrivee", title: "Déclaration d'arrivée", desc: "Signaler votre arrivée en Russie" },
          ].map((s, i) => (
            <Link key={i} href={s.href} className="bg-white rounded-xl border p-5 hover:shadow-md transition-shadow group">
              <h3 className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors">{s.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{s.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-green-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-8">Ambassade du Mali en Fédération de Russie</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { n: "360+", l: "Étudiants" },
              { n: "120+", l: "Contractuels" },
              { n: "80+", l: "Travailleurs" },
              { n: "200+", l: "Résidents" },
            ].map((s, i) => (
              <div key={i}>
                <div className="text-3xl font-bold text-yellow-400">{s.n}</div>
                <div className="text-green-200 text-sm mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-xl font-bold text-green-900 mb-4">Nous contacter</h2>
          <p className="text-sm text-gray-600 mb-2">
            11, rue Novokouznetskaïa (Новокузнецкая улица, 11с1), Moscou
          </p>
          <p className="text-sm text-gray-600 mb-2">Tél : +7 495 951-06-55 | Fax : +7 495 951-27-84</p>
          <p className="text-sm text-gray-600">
            Email : <a href="mailto:amaliru@mail.ru" className="text-green-700 hover:underline">amaliru@mail.ru</a>
          </p>
          <div className="mt-6">
            <Link href="/" className="inline-flex items-center gap-1 text-sm text-green-700 hover:text-green-800">
              <ArrowLeft className="w-4 h-4" /> Retour à l'accueil
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t bg-white py-6 text-center text-sm text-gray-500">
        <p>Ambassade de la République du Mali en Fédération de Russie — Portail des Ressortissants Maliens</p>
      </footer>
    </div>
  );
}
