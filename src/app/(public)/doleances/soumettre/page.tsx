"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SoumettreDoleancePage() {
  const t = useTranslations("public");
  const formT = useTranslations("form");
  const [form, setForm] = useState({
    etudiant_nom: "", etudiant_prenom: "", telephone: "", email: "",
    type: "", titre: "", description: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/doleances/public", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-green-900 mb-2">{t("soumettreDoleance")}</h2>
          <p className="text-gray-600 mb-6">{t("doleanceSuccess")}</p>
          <Link href="/" className="text-green-700 hover:text-green-800 underline text-sm">Retour à l'accueil</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 py-8 px-4">
      <div className="max-w-lg mx-auto">
        <Link href="/" className="flex items-center gap-1 text-sm text-gray-500 hover:text-green-700 mb-6">
          <ArrowLeft className="w-4 h-4" /> Retour
        </Link>

        <div className="bg-white rounded-2xl shadow-lg border p-6 md:p-8">
          <div className="flex h-1 rounded-full overflow-hidden mb-6">
            <div className="flex-1 bg-green-600" />
            <div className="flex-1 bg-yellow-400" />
            <div className="flex-1 bg-red-600" />
          </div>

          <h1 className="text-2xl font-bold text-green-900 mb-2">{t("soumettreDoleance")}</h1>
          <p className="text-sm text-gray-500 mb-6">{t("doleanceSubtitle")}</p>

          {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>{formT("nom")}</Label>
                <Input value={form.etudiant_nom} onChange={(e) => setForm({ ...form, etudiant_nom: e.target.value })} />
              </div>
              <div>
                <Label>{formT("prenom")}</Label>
                <Input value={form.etudiant_prenom} onChange={(e) => setForm({ ...form, etudiant_prenom: e.target.value })} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>{formT("telephone")}</Label>
                <Input value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })} />
              </div>
              <div>
                <Label>{formT("email")}</Label>
                <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
            </div>

            <div>
              <Label>{formT("type")}</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                <SelectTrigger><SelectValue placeholder="Sélectionner un type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Problème de logement">Problème de logement</SelectItem>
                  <SelectItem value="Problème académique">Problème académique</SelectItem>
                  <SelectItem value="Problème de santé">Problème de santé</SelectItem>
                  <SelectItem value="Demande administrative">Demande administrative</SelectItem>
                  <SelectItem value="Problème financier">Problème financier</SelectItem>
                  <SelectItem value="Autre">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>{formT("titre")} *</Label>
              <Input value={form.titre} onChange={(e) => setForm({ ...form, titre: e.target.value })} required />
            </div>

            <div>
              <Label>{formT("description")} *</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required rows={4} />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Envoi..." : "Soumettre"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
