"use client";

import { GraduationCap, ArrowLeft, CalendarDays, CheckCircle2, FileText, Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";

export default function BoursesPage() {
  const calendrier = [
    { mois: "Septembre 2025", montant: "300 €" },
    { mois: "Octobre 2025", montant: "300 €" },
    { mois: "Novembre 2025", montant: "300 €" },
    { mois: "Décembre 2025", montant: "300 €" },
    { mois: "Janvier 2026", montant: "350 €" },
    { mois: "Février 2026", montant: "350 €" },
    { mois: "Mars 2026", montant: "350 €" },
    { mois: "Avril 2026", montant: "350 €" },
    { mois: "Mai 2026", montant: "350 €" },
    { mois: "Juin 2026", montant: "350 €" },
  ];

  const conditions = [
    "Être de nationalité malienne",
    "Être inscrit dans un établissement d'enseignement supérieur en Russie",
    "Avoir un dossier académique satisfaisant",
    "Être à jour des formalités consulaires",
    "Fournir une attestation de fréquentation scolaire",
    "Présenter un relevé de notes du dernier semestre",
  ];

  const documents = [
    "Formulaire de demande de bourse dûment rempli",
    "Copie du passeport en cours de validité",
    "Attestation d'inscription de l'établissement",
    "Relevé de notes du dernier semestre",
    "Attestation de résidence en Russie",
    "RIB ou relevé d'identité bancaire",
    "Photo d'identité récente",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="flex items-center gap-1 text-sm text-gray-500 hover:text-green-700 mb-6">
          <ArrowLeft className="w-4 h-4" /> Retour
        </Link>

        {/* Hero */}
        <div className="bg-white rounded-2xl shadow-lg border p-6 md:p-8 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-md">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Bourses d'études</h1>
              <p className="text-sm text-gray-500">Programme de bourses pour les étudiants maliens en Russie</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            L'Ambassade du Mali en Russie offre un programme de bourses d'études destiné aux étudiants maliens
            poursuivant leur formation dans les établissements d'enseignement supérieur russes. Ce programme vise à
            soutenir les étudiants dans leur parcours académique et à faciliter leurs conditions de vie et d'études.
          </p>
        </div>

        {/* Calendrier de paiement */}
        <div className="bg-white rounded-2xl shadow-lg border p-6 md:p-8 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-md">
              <CalendarDays className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Calendrier de paiement</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 font-semibold text-gray-700">Mois</th>
                  <th className="text-right py-2 font-semibold text-gray-700">Montant</th>
                </tr>
              </thead>
              <tbody>
                {calendrier.map((row) => (
                  <tr key={row.mois} className="border-b border-gray-100 last:border-0">
                    <td className="py-2 text-gray-600">{row.mois}</td>
                    <td className="py-2 text-right font-medium text-green-700">{row.montant}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-3">* Calendrier indicatif sous réserve de disponibilité des fonds</p>
        </div>

        {/* Conditions d'éligibilité */}
        <div className="bg-white rounded-2xl shadow-lg border p-6 md:p-8 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-md">
              <CheckCircle2 className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Conditions d'éligibilité</h2>
          </div>
          <ul className="space-y-2">
            {conditions.map((cond, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
                {cond}
              </li>
            ))}
          </ul>
        </div>

        {/* Documents requis */}
        <div className="bg-white rounded-2xl shadow-lg border p-6 md:p-8 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-md">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Documents requis</h2>
          </div>
          <ul className="space-y-2">
            {documents.map((doc, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                {doc}
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="bg-white rounded-2xl shadow-lg border p-6 md:p-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-md">
              <Mail className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Contact</h2>
          </div>
          <div className="space-y-3 text-sm text-gray-600">
            <p className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-green-600 shrink-0" />
              bourses@ambassade-mali.ru
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-green-600 shrink-0" />
              +7 (495) 123-45-67
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-green-600 shrink-0" />
              Ambassade du Mali à Moscou, Service des Bourses
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
