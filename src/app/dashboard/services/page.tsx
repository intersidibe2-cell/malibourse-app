"use client";

import { Construction, FileText, IdCard, Stamp, ScrollText, CalendarClock, Passport, AlertTriangle, Lightbulb } from "lucide-react";

const futursServices = [
  { icon: FileText, title: "Légalisation de documents", desc: "Légalisation des diplômes et actes officiels", color: "from-blue-400 to-blue-500", statut: "planification" },
  { icon: IdCard, title: "Carte consulaire", desc: "Immatriculation et renouvellement en ligne", color: "from-emerald-400 to-emerald-500", statut: "planification" },
  { icon: Stamp, title: "Timbres consulaires", desc: "Achat et paiement en ligne", color: "from-amber-400 to-amber-500", statut: "planification" },
  { icon: ScrollText, title: "Certificats d'état civil", desc: "Mariage, décès, naissance — demande en ligne", color: "from-purple-400 to-purple-500", statut: "planification" },
  { icon: CalendarClock, title: "RDV avec le Consul", desc: "Prise de rendez-vous en ligne", color: "from-rose-400 to-rose-500", statut: "prioritaire" },
  { icon: Passport, title: "Renouvellement passeport", desc: "Demande et suivi de fabrication", color: "from-cyan-400 to-cyan-500", statut: "prioritaire" },
  { icon: AlertTriangle, title: "Signalement d'urgence", desc: "Incident, urgence ou situation critique", color: "from-red-400 to-red-500", statut: "prioritaire" },
];

export default function ServicesAdminPage() {
  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Construction className="w-5 h-5 text-gray-600" />
        <h1 className="text-lg font-semibold text-gray-900">Services à développer</h1>
      </div>
      <p className="text-xs text-gray-400 mb-6">Futurs modules à ajouter à la plateforme pour les ressortissants maliens</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {futursServices.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center shadow-sm`}>
                  <Icon className="w-4.5 h-4.5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-sm font-medium text-gray-900">{s.title}</h3>
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full shrink-0 ${
                      s.statut === "prioritaire" ? "bg-red-50 text-red-700 border border-red-200" : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}>
                      {s.statut === "prioritaire" ? "PRIORITAIRE" : "À PLANIFIER"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">{s.desc}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Lightbulb className="w-4 h-4 text-amber-700 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-medium text-amber-800">Suggestions pour l'ambassadeur</p>
            <p className="text-xs text-amber-700 mt-1">
              Ces services peuvent être développés progressivement. Les modules <strong>prioritaires</strong> (RDV, passeport, signalement) 
              peuvent être livrés en 1-2 jours chacun. Les autres services peuvent être planifiés selon les besoins de l'ambassade.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
