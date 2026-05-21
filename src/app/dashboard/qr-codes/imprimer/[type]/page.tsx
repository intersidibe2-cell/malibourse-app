"use client";

import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const QR_API = "https://api.qrserver.com/v1/create-qr-code/";

const affiches: Record<string, { titre: string; url: string; lieux: string; items: string[] }> = {
  accueil: {
    titre: "Ambassade du Mali à Moscou",
    url: "https://etudiantsmali.ru/accueil",
    lieux: "Hall d'accueil — Ambassade du Mali à Moscou",
    items: ["Déclaration d'arrivée", "Demande d'audience", "Inscription étudiant", "Soumettre une doléance", "Suivi de mon dossier"],
  },
  arrivee: {
    titre: "Vous arrivez en Russie ?",
    url: "https://etudiantsmali.ru/arrivee",
    lieux: "Affiche à placer à l'aéroport de Bamako",
    items: ["Signaler mon arrivée", "Vol et date d'arrivée", "Ville de destination", "Contact en Russie"],
  },
};

export default function ImprimerPage() {
  const params = useParams();
  const type = params.type as string;
  const a = affiches[type];

  if (!a) return <div className="p-8 text-center text-gray-400">Affiche introuvable</div>;

  return (
    <div>
      <Link href="/dashboard/qr-codes" className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 mb-4">
        <ArrowLeft className="w-3 h-3" /> Retour
      </Link>

      <div className="print-page bg-white max-w-2xl mx-auto" style={{ padding: "20mm" }}>
        {/* Tricolore */}
        <div className="flex h-2 rounded overflow-hidden mb-6">
          <div className="flex-1 bg-green-600" />
          <div className="flex-1 bg-yellow-400" />
          <div className="flex-1 bg-red-600" />
        </div>

        {/* Logo */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-400 flex items-center justify-center text-white font-bold text-xl">
            M
          </div>
          <h1 className="text-xl font-bold text-gray-900">{a.titre}</h1>
          <p className="text-xs text-gray-500 mt-1">Ambassade de la République du Mali à Moscou</p>
        </div>

        {/* QR Code */}
        <div className="flex justify-center mb-6">
          <img
            src={`${QR_API}?size=400x400&data=${encodeURIComponent(a.url)}`}
            alt="QR Code"
            className="w-48 h-48"
          />
        </div>

        {/* URL */}
        <p className="text-center text-xs text-gray-500 font-mono mb-6">{a.url}</p>

        {/* Services */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-xs font-semibold text-gray-700 mb-2 text-center">Scannez pour :</p>
          <ul className="space-y-1">
            {a.items.map((item, i) => (
              <li key={i} className="text-xs text-gray-600 text-center">{item}</li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-[10px] text-gray-400">{a.lieux}</p>
          <p className="text-[10px] text-gray-400 mt-1">Ambassade de la République du Mali à Moscou</p>
        </div>

        {/* Tricolore */}
        <div className="flex h-2 rounded overflow-hidden mt-6">
          <div className="flex-1 bg-green-600" />
          <div className="flex-1 bg-yellow-400" />
          <div className="flex-1 bg-red-600" />
        </div>

        <div className="text-center mt-4 no-print">
          <button onClick={() => window.print()} className="px-4 py-2 bg-green-700 text-white rounded-lg text-sm hover:bg-green-800">
            🖨️ Imprimer cette affiche
          </button>
        </div>
      </div>

      <style jsx>{`
        @media print {
          .no-print { display: none !important; }
          .print-page { margin: 0; padding: 0; }
          @page { margin: 0; size: A4 portrait; }
        }
      `}</style>
    </div>
  );
}
