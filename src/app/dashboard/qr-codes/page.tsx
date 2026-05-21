"use client";

import { useState } from "react";
import { QrCode, Download, Printer, Copy, Check, ExternalLink } from "lucide-react";

const QR_API = "https://api.qrserver.com/v1/create-qr-code/";

const affiches = [
  {
    id: "accueil",
    titre: "Ambassade — Services aux ressortissants",
    url: "https://etudiantsmali.ru/accueil",
    desc: "À coller dans les locaux de l'ambassade",
    lieux: "Ambassade du Mali à Moscou — Hall d'accueil",
    items: ["Déclaration d'arrivée", "Demande d'audience", "Inscription étudiant", "Soumettre une doléance"],
  },
  {
    id: "arrivee",
    titre: "Aéroport — Signalement d'arrivée",
    url: "https://etudiantsmali.ru/arrivee",
    desc: "À coller à l'aéroport de Bamako / Ambassade de Russie",
    lieux: "Aéroport de Bamako — Ambassade de Russie à Bamako",
    items: ["Signaler mon arrivée en Russie", "Vol et date d'arrivée", "Ville de destination", "Contact en Russie"],
  },
];

export default function QrCodesPage() {
  const [copied, setCopied] = useState("");
  const [size, setSize] = useState(300);

  const copyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(""), 2000);
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <QrCode className="w-5 h-5 text-gray-600" />
        <h1 className="text-lg font-semibold text-gray-900">QR Codes</h1>
      </div>
      <p className="text-xs text-gray-400 mb-6">Affiches prêtes à imprimer pour l'ambassade et l'aéroport</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {affiches.map((a) => (
          <div key={a.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="p-5 flex flex-col items-center text-center border-b border-gray-50">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mb-3">
                <QrCode className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-sm font-semibold text-gray-900 mb-1">{a.titre}</h2>
              <p className="text-xs text-gray-400 mb-4">{a.desc}</p>
              <img
                src={`${QR_API}?size=${size}x${size}&data=${encodeURIComponent(a.url)}`}
                alt={`QR Code ${a.titre}`}
                className="w-40 h-40 rounded-lg border border-gray-100"
                loading="lazy"
                decoding="async"
              />
              <p className="text-[10px] text-gray-400 mt-2 font-mono">{a.url}</p>
            </div>
            <div className="p-4 space-y-2">
              <p className="text-[11px] text-gray-500 font-medium">{a.lieux}</p>
              <ul className="space-y-1">
                {a.items.map((item, i) => (
                  <li key={i} className="text-[11px] text-gray-400 flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-green-400" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="flex gap-2 pt-2">
                <a
                  href={`/dashboard/qr-codes/imprimer/${a.id}`}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-50 text-green-700 text-xs font-medium hover:bg-green-100 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Imprimer
                </a>
                <a
                  href={`${QR_API}?size=600x600&data=${encodeURIComponent(a.url)}`}
                  download={`qrcode_${a.id}.png`}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-50 text-gray-600 text-xs font-medium hover:bg-gray-100 transition-colors border border-gray-200"
                >
                  <Download className="w-3.5 h-3.5" />
                  PNG
                </a>
                <button
                  onClick={() => copyLink(a.url)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-50 text-gray-600 text-xs font-medium hover:bg-gray-100 transition-colors border border-gray-200"
                >
                  {copied === a.url ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied === a.url ? "Copié" : "Lien"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lien direct */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Liens à partager</h3>
        <div className="space-y-2">
          {affiches.map((a) => (
            <div key={a.id} className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
              <code className="flex-1 text-xs text-gray-600 font-mono truncate">{a.url}</code>
              <button
                onClick={() => copyLink(a.url)}
                className="p-1.5 rounded-md hover:bg-gray-200 transition-colors"
              >
                {copied === a.url ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5 text-gray-400" />}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
