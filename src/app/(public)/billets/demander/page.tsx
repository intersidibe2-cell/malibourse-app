"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plane, CheckCircle, ArrowLeft, Upload, FileText, X } from "lucide-react";
import Link from "next/link";

interface Fichier {
  id: string;
  url: string;
  nom: string;
  type: string;
}

export default function DemanderBilletPage() {
  const [form, setForm] = useState({
    etudiant_nom: "", etudiant_prenom: "", telephone: "", email: "",
    numero_passeport: "", universite: "", ville: "",
    type_billet: "", annee_academique: "",
    date_depart_prevu: "", date_retour_prevu: "",
    itineraire: "Moscou → Paris → Bamako", motif_demande: "",
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

  const removeFichier = (id: string) => setPiecesJointes(prev => prev.filter(f => f.id !== id));

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
      const res = await fetch("/api/billets-voyage/public", {
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Demande de billet envoyée</h2>
          <p className="text-gray-600 mb-6">
            Votre demande de billet a été transmise à l'ambassade. Vous recevrez une réponse sous peu.
          </p>
          <div className="flex flex-col gap-2">
            <Link href="/" className="text-green-700 hover:text-green-800 underline text-sm">Retour à l'accueil</Link>
            <button onClick={() => { setSubmitted(false); setForm({ etudiant_nom: "", etudiant_prenom: "", telephone: "", email: "", numero_passeport: "", universite: "", ville: "", type_billet: "", annee_academique: "", date_depart_prevu: "", date_retour_prevu: "", itineraire: "Moscou → Paris → Bamako", motif_demande: "" }); setPiecesJointes([]); }} className="text-gray-500 hover:text-gray-700 underline text-sm">Nouvelle demande</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-8 px-4">
      <div className="max-w-lg mx-auto">
        <Link href="/" className="flex items-center gap-1 text-sm text-gray-500 hover:text-purple-700 mb-6">
          <ArrowLeft className="w-4 h-4" /> Retour
        </Link>

        <div className="bg-white rounded-2xl shadow-lg border p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center shadow-md">
              <Plane className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Demander un billet de voyage</h1>
              <p className="text-xs text-gray-500">Vacances, rapatriement — soumettez votre demande avec les justificatifs</p>
            </div>
          </div>

          {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Nom *</Label>
                <Input value={form.etudiant_nom} onChange={(e) => setForm({ ...form, etudiant_nom: e.target.value })} required />
              </div>
              <div>
                <Label>Prénom *</Label>
                <Input value={form.etudiant_prenom} onChange={(e) => setForm({ ...form, etudiant_prenom: e.target.value })} required />
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
              <Label>Numéro de passeport</Label>
              <Input value={form.numero_passeport} onChange={(e) => setForm({ ...form, numero_passeport: e.target.value })} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Université</Label>
                <Input value={form.universite} onChange={(e) => setForm({ ...form, universite: e.target.value })} />
              </div>
              <div>
                <Label>Ville</Label>
                <Input value={form.ville} onChange={(e) => setForm({ ...form, ville: e.target.value })} />
              </div>
            </div>

            <div>
              <Label>Type de billet *</Label>
              <Select value={form.type_billet} onValueChange={(v) => setForm({ ...form, type_billet: v })}>
                <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Vacances annuelles">Vacances annuelles</SelectItem>
                  <SelectItem value="Rapatriement fin de cycle">Rapatriement fin de cycle</SelectItem>
                  <SelectItem value="Rapatriement médical">Rapatriement médical</SelectItem>
                  <SelectItem value="Rapatriement décès">Rapatriement décès</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Année académique</Label>
              <Input value={form.annee_academique} onChange={(e) => setForm({ ...form, annee_academique: e.target.value })} placeholder="Ex: 2025-2026" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Date départ *</Label>
                <Input type="date" value={form.date_depart_prevu} onChange={(e) => setForm({ ...form, date_depart_prevu: e.target.value })} required />
              </div>
              <div>
                <Label>Date retour</Label>
                <Input type="date" value={form.date_retour_prevu} onChange={(e) => setForm({ ...form, date_retour_prevu: e.target.value })} />
              </div>
            </div>

            <div>
              <Label>Itinéraire</Label>
              <Input value={form.itineraire} onChange={(e) => setForm({ ...form, itineraire: e.target.value })} />
            </div>

            <div>
              <Label>Motif de la demande</Label>
              <Textarea value={form.motif_demande} onChange={(e) => setForm({ ...form, motif_demande: e.target.value })} rows={3} placeholder="Précisez le motif de votre demande..." />
            </div>

            {/* Documents section */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <Label className="text-sm font-semibold mb-2 flex items-center gap-1">
                <FileText className="w-4 h-4" /> Pièces jointes (PDF)
              </Label>
              <p className="text-xs text-gray-500 mb-3">Demande écrite, justificatifs (médical, décès...)</p>

              <div className="flex flex-wrap gap-2 mb-3">
                <label className="flex items-center gap-1 px-3 py-2 rounded-lg bg-white border border-gray-300 cursor-pointer hover:bg-purple-50 hover:border-purple-300 transition-colors text-xs">
                  <Upload className="w-3.5 h-3.5" />
                  Demande écrite
                  <input type="file" accept=".pdf" className="hidden" onChange={(e) => handleFileInput(e, "billet_demande")} />
                </label>
                <label className="flex items-center gap-1 px-3 py-2 rounded-lg bg-white border border-gray-300 cursor-pointer hover:bg-purple-50 hover:border-purple-300 transition-colors text-xs">
                  <Upload className="w-3.5 h-3.5" />
                  Justificatif
                  <input type="file" accept=".pdf" className="hidden" onChange={(e) => handleFileInput(e, "billet_justificatif")} />
                </label>
              </div>

              {uploading && <p className="text-xs text-purple-600 mb-2">Upload en cours...</p>}

              {piecesJointes.length > 0 && (
                <div className="space-y-1">
                  {piecesJointes.map((f) => (
                    <div key={f.id} className="flex items-center justify-between bg-white rounded px-2 py-1.5 border text-xs">
                      <div className="flex items-center gap-1.5 truncate">
                        <FileText className="w-3 h-3 text-purple-600 shrink-0" />
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

            <Button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0" disabled={loading || !form.type_billet || !form.date_depart_prevu}>
              {loading ? "Envoi..." : "Soumettre la demande"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
