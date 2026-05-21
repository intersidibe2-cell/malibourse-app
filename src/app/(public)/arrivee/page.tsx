"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, Plane } from "lucide-react";

export default function ArriveePage() {
  const [form, setForm] = useState({ nom: "", prenom: "", numero_passeport: "", vol: "", compagnie: "", date_arrivee: "", ville_destination: "", telephone: "", email: "", hebergement: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/declarations-arrivee/public", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom: form.nom, prenom: form.prenom, numero_passeport: form.numero_passeport,
          date_arrivee: form.date_arrivee, ville_arrivee: form.ville_destination,
          telephone: form.telephone, email: form.email, adresse_sejour: form.hebergement,
          motif_sejour: `Vol: ${form.compagnie} ${form.vol}`,
        }),
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
          <CheckCircle className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-blue-900 mb-2">Arrivée signalée ! ✅</h2>
          <p className="text-gray-600 mb-6">L'Ambassade du Mali en Fédération de Russie a bien reçu votre signalement. Bienvenue en Russie !</p>
          <Link href="/" className="text-blue-700 hover:text-blue-800 underline text-sm">Retour à l'accueil</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-8 px-4">
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-2xl shadow-lg border p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Plane className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-blue-900">Signalement d'arrivée</h1>
              <p className="text-xs text-gray-500">Ambassade du Mali en Fédération de Russie</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-6">Vous arrivez en Russie ? Signalez votre arrivée à l'Ambassade pour faciliter votre suivi consulaire.</p>
          {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Nom *</Label><Input value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} required /></div>
              <div><Label>Prénom *</Label><Input value={form.prenom} onChange={e => setForm({ ...form, prenom: e.target.value })} required /></div>
            </div>
            <div><Label>Passeport *</Label><Input value={form.numero_passeport} onChange={e => setForm({ ...form, numero_passeport: e.target.value })} required /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Compagnie</Label><Input placeholder="Aeroflot, Air France..." value={form.compagnie} onChange={e => setForm({ ...form, compagnie: e.target.value })} /></div>
              <div><Label>N° Vol</Label><Input placeholder="AF1234" value={form.vol} onChange={e => setForm({ ...form, vol: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Date d'arrivée *</Label><Input type="date" value={form.date_arrivee} onChange={e => setForm({ ...form, date_arrivee: e.target.value })} required /></div>
              <div><Label>Ville de destination</Label><Input placeholder="Moscou, SPb..." value={form.ville_destination} onChange={e => setForm({ ...form, ville_destination: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Téléphone (RUS)</Label><Input placeholder="+7 XXX XXX XX XX" value={form.telephone} onChange={e => setForm({ ...form, telephone: e.target.value })} /></div>
              <div><Label>Email</Label><Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
            </div>
            <div><Label>Hébergement prévu</Label><Input placeholder="Hôtel, université, famille..." value={form.hebergement} onChange={e => setForm({ ...form, hebergement: e.target.value })} /></div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
              {loading ? "Envoi..." : "Signaler mon arrivée"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
