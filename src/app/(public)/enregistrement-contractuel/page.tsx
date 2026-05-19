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

export default function EnregistrementContractuelPage() {
  const t = useTranslations("public");
  const formT = useTranslations("form");
  const [form, setForm] = useState({
    nom: "", prenom: "", date_naissance: "", sexe: "", numero_passeport: "",
    telephone: "", email: "", ville: "", universite: "", filiere: "",
    niveau: "", annee_etude: "", date_arrivee: "", frais_scolarite_annuels: "",
    devise_frais: "RUB", contact_urgence_nom: "", contact_urgence_telephone: "",
    type_visa: "", date_expiration_visa: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/etudiants-contractuels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
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
          <h2 className="text-xl font-bold text-green-900 mb-2">{t("enregistrementContractuel")}</h2>
          <p className="text-gray-600 mb-6">{t("contractuelSuccess")}</p>
          <Link href="/" className="text-green-700 hover:text-green-800 underline text-sm">Retour à l'accueil</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="flex items-center gap-1 text-sm text-gray-500 hover:text-green-700 mb-6">
          <ArrowLeft className="w-4 h-4" /> Retour
        </Link>

        <div className="bg-white rounded-2xl shadow-lg border p-6 md:p-8">
          <div className="flex h-1 rounded-full overflow-hidden mb-6">
            <div className="flex-1 bg-green-600" />
            <div className="flex-1 bg-yellow-400" />
            <div className="flex-1 bg-red-600" />
          </div>

          <h1 className="text-2xl font-bold text-green-900 mb-2">{t("enregistrementContractuel")}</h1>
          <p className="text-sm text-gray-500 mb-6">{t("contractuelSubtitle")}</p>

          {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>{formT("nom")} *</Label>
                <Input value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} required />
              </div>
              <div>
                <Label>{formT("prenom")} *</Label>
                <Input value={form.prenom} onChange={(e) => setForm({ ...form, prenom: e.target.value })} required />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label>{formT("dateNaissance")}</Label>
                <Input type="date" value={form.date_naissance} onChange={(e) => setForm({ ...form, date_naissance: e.target.value })} />
              </div>
              <div>
                <Label>{formT("sexe")}</Label>
                <Select value={form.sexe} onValueChange={(v) => setForm({ ...form, sexe: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M">Masculin</SelectItem>
                    <SelectItem value="F">Féminin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>{formT("numeroPasseport")} *</Label>
                <Input value={form.numero_passeport} onChange={(e) => setForm({ ...form, numero_passeport: e.target.value })} required />
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

            <hr className="my-2" />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>{formT("universite")} *</Label>
                <Input value={form.universite} onChange={(e) => setForm({ ...form, universite: e.target.value })} required />
              </div>
              <div>
                <Label>{formT("ville")}</Label>
                <Input value={form.ville} onChange={(e) => setForm({ ...form, ville: e.target.value })} />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label>{formT("filiere")}</Label>
                <Input value={form.filiere} onChange={(e) => setForm({ ...form, filiere: e.target.value })} />
              </div>
              <div>
                <Label>{formT("niveau")}</Label>
                <Select value={form.niveau} onValueChange={(v) => setForm({ ...form, niveau: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Licence">Licence</SelectItem>
                    <SelectItem value="Master">Master</SelectItem>
                    <SelectItem value="Doctorat">Doctorat</SelectItem>
                    <SelectItem value="Spécialiste">Spécialiste</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>{formT("anneeEtude")}</Label>
                <Input value={form.annee_etude} onChange={(e) => setForm({ ...form, annee_etude: e.target.value })} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>{formT("dateArrivee")}</Label>
                <Input type="date" value={form.date_arrivee} onChange={(e) => setForm({ ...form, date_arrivee: e.target.value })} />
              </div>
              <div>
                <Label>{formT("fraisScolarite")}</Label>
                <Input type="number" value={form.frais_scolarite_annuels} onChange={(e) => setForm({ ...form, frais_scolarite_annuels: e.target.value })} />
              </div>
            </div>

            <hr className="my-2" />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>{formT("contactUrgence")}</Label>
                <Input value={form.contact_urgence_nom} onChange={(e) => setForm({ ...form, contact_urgence_nom: e.target.value })} />
              </div>
              <div>
                <Label>Tél. urgence</Label>
                <Input value={form.contact_urgence_telephone} onChange={(e) => setForm({ ...form, contact_urgence_telephone: e.target.value })} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>{formT("typeVisa")}</Label>
                <Input value={form.type_visa} onChange={(e) => setForm({ ...form, type_visa: e.target.value })} />
              </div>
              <div>
                <Label>{formT("dateExpirationVisa")}</Label>
                <Input type="date" value={form.date_expiration_visa} onChange={(e) => setForm({ ...form, date_expiration_visa: e.target.value })} />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Envoi..." : "Soumettre mon dossier"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
