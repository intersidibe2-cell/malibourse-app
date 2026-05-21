"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, CheckCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SignalementPage() {
  const [form, setForm] = useState({
    nom_complet: "", telephone: "", email: "",
    type_signalement: "", titre: "", description: "", lieu: "", urgence: "Normale",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/signalements/public", {
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-400 to-red-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Signalement envoyé</h2>
          <p className="text-gray-600 mb-6">
            Votre signalement a été transmis à l'Ambassade du Mali en Fédération de Russie. L'équipe consulaire vous contactera dans les plus brefs délais si nécessaire.
          </p>
          <div className="flex flex-col gap-2">
            <Link href="/" className="text-green-700 hover:text-green-800 underline text-sm">Retour à l'accueil</Link>
            <button onClick={() => { setSubmitted(false); setForm({ nom_complet: "", telephone: "", email: "", type_signalement: "", titre: "", description: "", lieu: "", urgence: "Normale" }); }}
              className="text-gray-500 hover:text-gray-700 underline text-sm">Signaler un autre problème</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 py-8 px-4">
      <div className="max-w-lg mx-auto">
        <Link href="/" className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-700 mb-6">
          <ArrowLeft className="w-4 h-4" /> Retour
        </Link>

        <div className="bg-white rounded-2xl shadow-lg border p-6 md:p-8">
          <div className="flex h-1 rounded-full overflow-hidden mb-6">
            <div className="flex-1 bg-red-500" />
            <div className="flex-1 bg-orange-400" />
            <div className="flex-1 bg-amber-400" />
          </div>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-400 to-red-500 flex items-center justify-center shadow-md">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Signalement d&apos;un problème</h1>
              <p className="text-xs text-gray-500">Signaler un incident, une urgence ou une situation critique</p>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6 space-y-1.5">
            <p className="text-xs text-red-700">
              <strong>Urgence immédiate ?</strong> Contactez l'ambassade par téléphone au <strong>+7 495 951-06-55</strong>.
            </p>
            <p className="text-xs text-red-600">
              Si l'ambassade n'est pas disponible (weekend, hors horaires), utilisez ce formulaire en sélectionnant le niveau <strong>"Urgente"</strong> ou <strong>"Critique"</strong> — votre signalement sera traité en priorité dès ouverture.
            </p>
          </div>

          {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Nom complet</Label>
              <Input value={form.nom_complet} onChange={(e) => setForm({ ...form, nom_complet: e.target.value })} placeholder="Votre nom et prénom" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Téléphone</Label>
                <Input value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })} placeholder="+7 XXX XXX XX XX" />
              </div>
              <div>
                <Label>Email</Label>
                <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="exemple@mail.ru" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Type de signalement</Label>
                <Select value={form.type_signalement} onValueChange={(v) => setForm({ ...form, type_signalement: v })}>
                  <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Incident">Incident</SelectItem>
                    <SelectItem value="Urgence">Urgence</SelectItem>
                    <SelectItem value="Critique">Critique</SelectItem>
                    <SelectItem value="Suggestion">Suggestion</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Urgence</Label>
                <Select value={form.urgence} onValueChange={(v) => setForm({ ...form, urgence: v })}>
                  <SelectTrigger><SelectValue placeholder="Niveau d'urgence" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Normale">Normale</SelectItem>
                    <SelectItem value="Urgente">Urgente</SelectItem>
                    <SelectItem value="Critique">Critique</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Lieu</Label>
              <Input value={form.lieu} onChange={(e) => setForm({ ...form, lieu: e.target.value })} placeholder="Ville, adresse, ou lieu de l'incident" />
            </div>

            <div>
              <Label>Titre *</Label>
              <Input value={form.titre} onChange={(e) => setForm({ ...form, titre: e.target.value })} required placeholder="Résumé du problème" />
            </div>

            <div>
              <Label>Description détaillée *</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required rows={5} placeholder="Décrivez la situation en détail : ce qui s'est passé, quand, où, les personnes impliquées..." />
            </div>

            <Button type="submit" className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white border-0" disabled={loading}>
              {loading ? "Envoi en cours..." : "Envoyer le signalement"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
