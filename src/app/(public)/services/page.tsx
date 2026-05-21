"use client";

import Link from "next/link";
import { ArrowLeft, FileText, IdCard, Stamp, ScrollText, CalendarClock, BadgeAlert, AlertTriangle, Construction } from "lucide-react";

const futursServices = [
  { icon: FileText, title: "Légalisation de documents", desc: "Légalisation des diplômes, actes et documents officiels pour la Russie", color: "from-blue-400 to-blue-500" },
  { icon: IdCard, title: "Carte consulaire", desc: "Demande et renouvellement de la carte d'immatriculation consulaire", color: "from-emerald-400 to-emerald-500" },
  { icon: Stamp, title: "Timbres & droits consulaires", desc: "Achat de timbres consulaires et paiement des droits en ligne", color: "from-amber-400 to-amber-500" },
  { icon: ScrollText, title: "Certificats d'état civil", desc: "Demande de certificats de mariage, décès, naissance", color: "from-purple-400 to-purple-500" },
  { icon: CalendarClock, title: "RDV avec le Consul", desc: "Prise de rendez-vous en ligne avec le consul ou les agents", color: "from-rose-400 to-rose-500" },
  { icon: BadgeAlert, title: "Renouvellement de passeport", desc: "Demande de renouvellement et suivi de fabrication", color: "from-cyan-400 to-cyan-500" },
  { icon: AlertTriangle, title: "Signalement d'un problème", desc: "Signaler un incident, une urgence ou une situation critique", color: "from-red-400 to-red-500", href: "/signalements/soumettre" },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      <div className="flex h-1.5">
        <div className="flex-1 bg-green-600" />
        <div className="flex-1 bg-yellow-400" />
        <div className="flex-1 bg-red-600" />
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link href="/" className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-green-700 mb-6 transition-colors">
          <ArrowLeft className="w-3 h-3" /> Retour à l'accueil
        </Link>

        <div className="text-center mb-12">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-lg">
            <Construction className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-green-900 mb-2">Services à venir</h1>
          <p className="text-sm text-gray-500 max-w-lg mx-auto">
            L'Ambassade du Mali à Moscou travaille sur de nouveaux services numériques pour mieux vous accompagner.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {futursServices.map((s, i) => {
            const Icon = s.icon;
            const isReady = "href" in s;
            const Wrapper = isReady ? (props: any) => <Link href={s.href!} {...props} /> : (props: any) => <div {...props} />;
            return (
              <Wrapper key={i} className={`relative bg-white rounded-xl border p-5 transition-all group ${isReady ? "border-green-200 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer" : "border-gray-200 hover:shadow-md"}`}>
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-gray-900">{s.title}</h3>
                      {isReady ? (
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200 shrink-0">
                          DISPONIBLE
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 shrink-0">
                          À VENIR
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{s.desc}</p>
                  </div>
                </div>
              </Wrapper>
            );
          })}
        </div>

        {/* Section contact */}
        <div className="mt-12 bg-white rounded-xl border border-gray-200 p-6 text-center">
          <p className="text-sm text-gray-600 mb-1">Un service manque ? Une suggestion ?</p>
          <p className="text-xs text-gray-400">Contactez l'ambassade pour proposer de nouveaux services numériques.</p>
        </div>
      </div>
    </div>
  );
}
