"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QrCode, Copy, ExternalLink, Check } from "lucide-react";

export default function QRCodePage() {
  const t = useTranslations();
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const [copied, setCopied] = useState(false);

  const publicLinks = [
    { label: t("nav.declarationsArrivee"), url: `${baseUrl}/declaration-arrivee`, desc: "Formulaire public de déclaration d'arrivée" },
    { label: t("public.soumettreDoleance"), url: `${baseUrl}/doleances/soumettre`, desc: "Formulaire public de soumission de doléance" },
    { label: t("nav.etudiantsContractuels"), url: `${baseUrl}/enregistrement-contractuel`, desc: "Formulaire d'inscription étudiant contractuel" },
  ];

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <QrCode className="w-6 h-6 text-green-700" />
        {t("nav.qrCodeArrivee")}
      </h1>

      <div className="grid gap-6">
        {publicLinks.map((link, i) => (
          <div key={i} className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900">{link.label}</h3>
                <p className="text-sm text-gray-500">{link.desc}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Input value={link.url} readOnly className="bg-gray-50" />
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleCopy(link.url)}
                title="Copier le lien"
              >
                {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => window.open(link.url, "_blank")}
                title="Ouvrir"
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-white rounded-lg border p-6 text-center">
        <h3 className="font-semibold text-gray-900 mb-2">Utilisation des QR Codes</h3>
        <p className="text-sm text-gray-500 mb-4">
          Partagez ces liens avec les étudiants et ressortissants maliens.
          Vous pouvez aussi générer des QR codes via un générateur en ligne (ex: qr-code-generator.com).
        </p>
        <div className="inline-flex items-center justify-center w-32 h-32 bg-white border-2 border-dashed border-gray-300 rounded-lg">
          <QrCode className="w-12 h-12 text-gray-300" />
        </div>
        <p className="text-xs text-gray-400 mt-2">QR Code généré à l'impression</p>
      </div>
    </div>
  );
}
