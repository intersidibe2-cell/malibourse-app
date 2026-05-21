"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { GraduationCap, ArrowLeft, Users, Building2, BookOpen, MapPin, Phone, Mail, Globe } from "lucide-react";

export default function MinisterePublicPage() {
  const [totalEtudiants, setTotalEtudiants] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/stats/ministere")
      .then(r => r.json())
      .then(d => setTotalEtudiants(d.totalEtudiants))
      .catch(() => {});
  }, []);

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
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-600 to-green-500 flex items-center justify-center text-white font-bold">M</div>
            <div>
              <span className="font-bold text-green-900">Ministère de l'Éducation Supérieure</span>
              <span className="text-gray-500 text-sm ml-2 hidden md:inline">République du Mali</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-green-700 hover:text-green-800 font-medium">Espace Agent</Link>
            <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">Accueil</Link>
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-green-100 flex items-center justify-center">
          <GraduationCap className="w-8 h-8 text-green-700" />
        </div>
        <h1 className="text-3xl md:text-5xl font-bold text-green-900 mb-4">
          Ministère de l'Éducation Supérieure et de la Recherche Scientifique
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Supervision et suivi des étudiants boursiers maliens en Fédération de Russie —
          coordination académique, gestion des bourses et accompagnement des jeunes maliens
          dans leur parcours universitaire à l'étranger.
        </p>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: Users, title: "Gestion des effectifs", desc: "Suivi centralisé de l'ensemble des étudiants boursiers maliens en Russie" },
              { icon: BookOpen, title: "Suivi académique", desc: "Coordination des inscriptions, filières et résultats académiques" },
              { icon: Building2, title: "Relations universitaires", desc: "Liaison avec les universités russes partenaires et accréditations" },
              { icon: Globe, title: "Viseur d'avenir", desc: "Planification du retour et valorisation des compétences acquises" },
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

      <section className="bg-green-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-8">Chiffres clés</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6">
              <div className="text-4xl font-bold text-yellow-400">{totalEtudiants ?? "..."}</div>
              <div className="text-green-200 text-sm mt-2">Étudiants boursiers suivis</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-yellow-400">30+</div>
              <div className="text-green-200 text-sm mt-2">Universités partenaires</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-yellow-400">15+</div>
              <div className="text-green-200 text-sm mt-2">Filières représentées</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-xl font-bold text-green-900 mb-8">Nous contacter</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="bg-gray-50 rounded-xl p-5 border">
              <MapPin className="w-6 h-6 text-green-700 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Bamako, Mali<br />Colline de Badalabougou</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-5 border">
              <Phone className="w-6 h-6 text-green-700 mx-auto mb-2" />
              <p className="text-sm text-gray-600">+223 20 22 20 25<br />+223 20 22 21 80</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-5 border">
              <Mail className="w-6 h-6 text-green-700 mx-auto mb-2" />
              <p className="text-sm text-gray-600">contact@education.gouv.ml</p>
            </div>
          </div>
          <div className="mt-8">
            <Link href="/" className="inline-flex items-center gap-1 text-sm text-green-700 hover:text-green-800">
              <ArrowLeft className="w-4 h-4" /> Retour à l'accueil
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t bg-white py-6 text-center text-sm text-gray-500">
        <p>Ministère de l'Éducation Supérieure et de la Recherche Scientifique — République du Mali</p>
      </footer>
    </div>
  );
}
