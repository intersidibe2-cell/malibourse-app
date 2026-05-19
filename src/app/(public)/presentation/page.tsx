"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Globe, Bell, Shield, BarChart3, GraduationCap, ArrowRight } from "lucide-react";
import { useLocale } from "next-intl";

export default function PresentationPage() {
  const t = useTranslations("public");
  const appT = useTranslations("app");
  const navT = useTranslations("nav");
  const router = useRouter();
  const locale = useLocale();

  const features = [
    { icon: Globe, title: t("feature1Title"), desc: t("feature1Desc") },
    { icon: Bell, title: t("feature2Title"), desc: t("feature2Desc") },
    { icon: Shield, title: t("feature3Title"), desc: t("feature3Desc") },
    { icon: BarChart3, title: t("feature4Title"), desc: t("feature4Desc") },
  ];

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
              <span className="font-bold text-green-900">{appT("name")}</span>
              <span className="text-gray-500 text-sm ml-2 hidden md:inline">{appT("subtitle")}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href={`/${locale === "fr" ? "" : "ru"}login`} className="text-sm text-green-700 hover:text-green-800 font-medium">
              {navT("login")}
            </Link>
            <Button size="sm" onClick={() => router.push("/declaration-arrivee")}>
              {t("declarationArrivee")}
            </Button>
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-4 py-20 text-center">
        <GraduationCap className="w-16 h-16 mx-auto text-green-700 mb-6" />
        <h1 className="text-4xl md:text-5xl font-bold text-green-900 mb-4">
          {t("presentationTitle")}
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          {t("presentationSubtitle")}
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button size="lg" className="bg-green-700 hover:bg-green-800" onClick={() => router.push("/declaration-arrivee")}>
            {t("declarationArrivee")}
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
          <Button size="lg" variant="outline" onClick={() => router.push("/doleances/soumettre")}>
            {t("soumettreDoleance")}
          </Button>
          <Button size="lg" variant="outline" onClick={() => router.push("/enregistrement-contractuel")}>
            {t("enregistrementContractuel")}
          </Button>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div key={i} className="bg-white rounded-xl border p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-green-100 flex items-center justify-center">
                <f.icon className="w-6 h-6 text-green-700" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-green-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-8">{appT("subtitle")}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { n: "350+", l: "Boursiers" },
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

      <footer className="border-t bg-white py-6 text-center text-sm text-gray-500">
        <p>{appT("name")} — {appT("subtitle")}</p>
        <p className="mt-1">Федерация России</p>
      </footer>
    </div>
  );
}
