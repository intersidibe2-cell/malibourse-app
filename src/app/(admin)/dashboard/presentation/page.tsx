"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

export default function AdminPresentationPage() {
  const t = useTranslations();
  const router = useRouter();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        {t("nav.presentation")}
      </h1>

      <div className="bg-white rounded-lg border p-6">
        <p className="text-gray-600 mb-4">
          La page de présentation est accessible publiquement à l'adresse :
        </p>
        <div className="flex items-center gap-2 mb-6">
          <code className="flex-1 p-2 bg-gray-50 rounded border text-sm">/presentation</code>
          <Button variant="outline" size="sm" onClick={() => router.push("/presentation")}>
            <ExternalLink className="w-4 h-4 mr-1" />
            Voir
          </Button>
        </div>
        <p className="text-sm text-gray-500">
          Cette page présente l'application GestBourse Mali aux visiteurs et contient les liens
          vers les formulaires publics (déclaration d'arrivée, doléances, inscription contractuel).
          Le contenu peut être modifié dans le fichier <code>src/app/(public)/presentation/page.tsx</code>.
        </p>
      </div>
    </div>
  );
}
