"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarDays, CheckCircle, ArrowLeft, Upload, FileText, X } from "lucide-react";
import Link from "next/link";

interface Fichier {
  id: string;
  url: string;
  nom: string;
  type: string;
}

export default function DemanderCongePage() {
  const [form, setForm] = useState({
    etudiant_nom: "", etudiant_prenom: "", telephone: "", email: "",
    type_conge: "", motif: "", date_debut: "", date_fin: "",
  });
  const [uploading, setUploading] = useState(false);
  const [piecesJointes, setPiecesJointes] = useState<Fichier[]>([]);
  const [submitted, setSubmitted] = useState(false);
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
      const res = await fetch("/api/conges-academiques/public", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, pieces_jointes: piecesJointes }),
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50 p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Demande de congé envoyée</h2>
          <p className="text-gray-600 mb-6">
            Votre demande de congé a été transmise à l'ambassade. Vous recevrez une réponse sous peu.
          </p>
          <div className="flex flex-col gap-2">
            <Link href="/" className="text-green-700 hover:text-green-800 underline text-sm">Retour à l'accueil</Link>
            <button onClick={() => { setSubmitted(false); setForm({ etudiant_nom: "", etudiant_prenom: "", telephone: "", email: "", type_conge: "", motif: "", date_debut: "", date_fin: "" }); setPiecesJointes([]); }} className="text-gray-500 hover:text-gray-700 underline text-sm">Nouvelle demande</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-8 px-4">
      <div className="max-w-lg mx-auto">
        <Link href="/" className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-700 mb-6">
          <ArrowLeft className="w-4 h-4" /> Retour
        </Link>

        <div className="bg-white rounded-2xl shadow-lg border p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center shadow-md">
              <CalendarDays className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Demander un congé académique</h1>
              <p className="text-xs text-gray-500">Soumettez votre demande avec les pièces justificatives</p>
            </div>
          </div>

          {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Nom</Label>
                <Input value={form.etudiant_nom} onChange={(e) => setForm({ ...form, etudiant_nom: e.target.value })} />
              </div>
              <div>
                <Label>Prénom</Label>
                <Input value={form.etudiant_prenom} onChange={(e) => setForm({ ...form, etudiant_prenom: e.target.value })} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Téléphone</Label>
                <Input value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })} />
              </div>
              <div>
                <Label>Email</Label>
                <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
            </div>

            <div>
              <Label>Type de congé *</Label>
              <Select value={form.type_conge} onValueChange={(v) => setForm({ ...form, type_conge: v })}>
                <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Congé médical">Congé médical</SelectItem>
                  <SelectItem value="Congé familial">Congé familial</SelectItem>
                  <SelectItem value="Congé académique">Congé académique</SelectItem>
                  <SelectItem value="Autre">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Date début *</Label>
                <Input type="date" value={form.date_debut} onChange={(e) => setForm({ ...form, date_debut: e.target.value })} required />
              </div>
              <div>
                <Label>Date fin *</Label>
                <Input type="date" value={form.date_fin} onChange={(e) => setForm({ ...form, date_fin: e.target.value })} required />
              </div>
            </div>

            <div>
              <Label>Motif *</Label>
              <Textarea value={form.motif} onChange={(e) => setForm({ ...form, motif: e.target.value })} required rows={3} placeholder="Décrivez le motif de votre demande de congé..." />
            </div>

            {/* Documents section */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <Label className="text-sm font-semibold mb-2 flex items-center gap-1">
                <FileText className="w-4 h-4" /> Pièces jointes (PDF)
              </Label>
              <p className="text-xs text-gray-500 mb-3">Demande écrite, certificat médical, justificatifs...</p>

              <div className="flex flex-wrap gap-2 mb-3">
                <label className="flex items-center gap-1 px-3 py-2 rounded-lg bg-white border border-gray-300 cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors text-xs">
                  <Upload className="w-3.5 h-3.5" />
                  Demande écrite
                  <input type="file" accept=".pdf" className="hidden" onChange={(e) => handleFileInput(e, "conge_demande")} />
                </label>
                <label className="flex items-center gap-1 px-3 py-2 rounded-lg bg-white border border-gray-300 cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors text-xs">
                  <Upload className="w-3.5 h-3.5" />
                  Justificatif
                  <input type="file" accept=".pdf" className="hidden" onChange={(e) => handleFileInput(e, "conge_justificatif")} />
                </label>
              </div>

              {uploading && <p className="text-xs text-blue-600 mb-2">Upload en cours...</p>}

              {piecesJointes.length > 0 && (
                <div className="space-y-1">
                  {piecesJointes.map((f) => (
                    <div key={f.id} className="flex items-center justify-between bg-white rounded px-2 py-1.5 border text-xs">
                      <div className="flex items-center gap-1.5 truncate">
                        <FileText className="w-3 h-3 text-blue-600 shrink-0" />
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

            <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0" disabled={loading || !form.type_conge || !form.motif || !form.date_debut || !form.date_fin}>
              {loading ? "Envoi..." : "Soumettre la demande"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
