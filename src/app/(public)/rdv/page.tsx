"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarDays, CheckCircle, ArrowLeft, Upload, FileText, X, Clock } from "lucide-react";
import Link from "next/link";

interface Fichier {
  id: string;
  url: string;
  nom: string;
  type: string;
}

export default function PriseRdvPage() {
  const [form, setForm] = useState({
    nom_complet: "", telephone: "", email: "", motif: "",
    description: "", date_souhaitee: "", creneau_horaire: "",
  });
  const [uploading, setUploading] = useState(false);
  const [piecesJointes, setPiecesJointes] = useState<Fichier[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const uploadFile = async (file: File, type: string) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("type", type);
      const res = await fetch("/api/upload/public", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setPiecesJointes(prev => [...prev, data]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur upload");
    } finally {
      setUploading(false);
    }
  };

  const removeFichier = (id: string) => {
    setPiecesJointes(prev => prev.filter(f => f.id !== id));
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") uploadFile(file, type);
    else setError("Seuls les fichiers PDF sont acceptés");
    e.target.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/rdv/public", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, pieces_jointes: piecesJointes }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data);
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Rendez-vous enregistré</h2>
          <p className="text-gray-600 mb-4">Votre demande de rendez-vous a été transmise avec succès.</p>
          <div className="bg-gray-50 rounded-xl p-4 text-left text-sm space-y-1 mb-6">
            <p><span className="font-semibold">Référence :</span> {result?.reference}</p>
            <p><span className="font-semibold">Nom :</span> {result?.nom_complet}</p>
            <p><span className="font-semibold">Date :</span> {result?.date_souhaitee}</p>
            <p><span className="font-semibold">Créneau :</span> {result?.creneau_horaire}</p>
            <p><span className="font-semibold">Téléphone :</span> {result?.telephone}</p>
          </div>
          <div className="flex flex-col gap-2">
            <Link href="/" className="text-green-700 hover:text-green-800 underline text-sm">Retour à l'accueil</Link>
            <button onClick={() => { setSubmitted(false); setForm({ nom_complet: "", telephone: "", email: "", motif: "", description: "", date_souhaitee: "", creneau_horaire: "" }); setPiecesJointes([]); setResult(null); }} className="text-gray-500 hover:text-gray-700 underline text-sm">Nouveau rendez-vous</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 py-8 px-4">
      <div className="max-w-lg mx-auto">
        <Link href="/" className="flex items-center gap-1 text-sm text-gray-500 hover:text-green-700 mb-6">
          <ArrowLeft className="w-4 h-4" /> Retour
        </Link>

        <div className="bg-white rounded-2xl shadow-lg border p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-md">
              <CalendarDays className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Prise de RDV Consulaire</h1>
              <p className="text-xs text-gray-500">Planifiez votre rendez-vous à l'ambassade</p>
            </div>
          </div>

          {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Nom complet *</Label>
              <Input value={form.nom_complet} onChange={(e) => setForm({ ...form, nom_complet: e.target.value })} required />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Téléphone *</Label>
                <Input type="tel" value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })} required />
              </div>
              <div>
                <Label>Email *</Label>
                <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </div>
            </div>

            <div>
              <Label>Motif *</Label>
              <Select value={form.motif} onValueChange={(v) => setForm({ ...form, motif: v })}>
                <SelectTrigger><SelectValue placeholder="Sélectionner un motif" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Visa">Visa</SelectItem>
                  <SelectItem value="Passeport">Passeport</SelectItem>
                  <SelectItem value="Légalisation">Légalisation</SelectItem>
                  <SelectItem value="Bourse">Bourse</SelectItem>
                  <SelectItem value="Notariat">Notariat</SelectItem>
                  <SelectItem value="État civil">État civil</SelectItem>
                  <SelectItem value="Information">Information</SelectItem>
                  <SelectItem value="Autre">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Description (optionnelle)</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Précisions sur votre demande..." />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Date souhaitée *</Label>
                <Input type="date" value={form.date_souhaitee} onChange={(e) => setForm({ ...form, date_souhaitee: e.target.value })} required />
              </div>
              <div>
                <Label>Créneau horaire *</Label>
                <Select value={form.creneau_horaire} onValueChange={(v) => setForm({ ...form, creneau_horaire: v })}>
                  <SelectTrigger><SelectValue placeholder="Choisir" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="09:00-10:00">09:00 - 10:00</SelectItem>
                    <SelectItem value="10:00-11:00">10:00 - 11:00</SelectItem>
                    <SelectItem value="11:00-12:00">11:00 - 12:00</SelectItem>
                    <SelectItem value="14:00-15:00">14:00 - 15:00</SelectItem>
                    <SelectItem value="15:00-16:00">15:00 - 16:00</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <Label className="text-sm font-semibold mb-2 flex items-center gap-1">
                <FileText className="w-4 h-4" /> Justificatif (PDF, optionnel)
              </Label>
              <p className="text-xs text-gray-500 mb-3">Document justificatif si nécessaire...</p>

              <div className="flex flex-wrap gap-2 mb-3">
                <label className="flex items-center gap-1 px-3 py-2 rounded-lg bg-white border border-gray-300 cursor-pointer hover:bg-green-50 hover:border-green-300 transition-colors text-xs">
                  <Upload className="w-3.5 h-3.5" />
                  Justificatif
                  <input type="file" accept=".pdf" className="hidden" onChange={(e) => handleFileInput(e, "rdv_justificatif")} />
                </label>
              </div>

              {uploading && <p className="text-xs text-green-600 mb-2">Upload en cours...</p>}

              {piecesJointes.length > 0 && (
                <div className="space-y-1">
                  {piecesJointes.map((f) => (
                    <div key={f.id} className="flex items-center justify-between bg-white rounded px-2 py-1.5 border text-xs">
                      <div className="flex items-center gap-1.5 truncate">
                        <FileText className="w-3 h-3 text-green-600 shrink-0" />
                        <span className="truncate">{f.nom}</span>
                      </div>
                      <button type="button" onClick={() => removeFichier(f.id)} className="text-red-500 hover:text-red-700 shrink-0">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button type="submit" className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0" disabled={loading || !form.nom_complet || !form.telephone || !form.email || !form.motif || !form.date_souhaitee || !form.creneau_horaire}>
              {loading ? "Envoi..." : "Prendre rendez-vous"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
