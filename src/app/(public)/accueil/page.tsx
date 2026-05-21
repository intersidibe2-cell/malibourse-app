"use client";

import Link from "next/link";
import { ArrowRight, FileText, Calendar, GraduationCap, MessageSquare, UserCheck, Mail } from "lucide-react";

export default function AccueilPage() {
  const services = [
    { icon: FileText, title: "Déclaration d'arrivée", desc: "Signalez votre arrivée en Russie", href: "/declaration-arrivee", color: "bg-blue-50 text-blue-700" },
    { icon: Calendar, title: "Demande d'audience", desc: "Rencontrez un agent consulaire", href: "/accueil/audience", color: "bg-green-50 text-green-700" },
    { icon: GraduationCap, title: "Inscription étudiant", desc: "Étudiant boursier, contractuel ou militaire", href: "/inscription", color: "bg-yellow-50 text-yellow-700" },
    { icon: MessageSquare, title: "Soumettre une doléance", desc: "Réclamation, suggestion ou demande", href: "/doleances/soumettre", color: "bg-purple-50 text-purple-700" },
    { icon: UserCheck, title: "Suivi de mon dossier", desc: "Consultez l'état de vos démarches", href: "/espace-ressortissant/connexion", color: "bg-teal-50 text-teal-700" },
    { icon: Mail, title: "Contacter l'ambassade", desc: "Besoin d'aide ? Écrivez-nous", href: "/doleances/soumettre", color: "bg-red-50 text-red-700" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      <div className="flex h-1.5">
        <div className="flex-1 bg-green-600" />
        <div className="flex-1 bg-yellow-400" />
        <div className="flex-1 bg-red-600" />
      </div>
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-400 flex items-center justify-center text-white font-bold text-2xl">
          M
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-green-900 mb-2">Ambassade du Mali en Fédération de Russie</h1>
        <p className="text-gray-500 mb-8">Services aux ressortissants maliens en Fédération de Russie</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {services.map((s, i) => {
            const Icon = s.icon;
            return (
              <Link key={i} href={s.href} className={`${s.color} rounded-xl border p-5 text-left hover:shadow-lg transition-all group`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-white/80 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1">{s.title}</h3>
                <p className="text-xs text-gray-500">{s.desc}</p>
              </Link>
            );
          })}
        </div>
        <div className="mt-8 text-sm text-gray-400">
          <p>Ambassade de la République du Mali — Moscou, Fédération de Russie</p>
        </div>
      </div>
    </div>
  );
}
