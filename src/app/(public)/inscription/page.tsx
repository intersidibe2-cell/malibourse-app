"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, CheckCircle, Upload } from "lucide-react";
import Link from "next/link";

const PROFILS = [
  { value: "boursier", label: "Étudiant Boursier", icon: "🎓" },
  { value: "contractuel", label: "Étudiant Contractuel", icon: "📚" },
  { value: "militaire", label: "Étudiant Militaire", icon: "🪖" },
  { value: "travailleur", label: "Travailleur", icon: "👷" },
  { value: "visiteur", label: "Visiteur / Touriste", icon: "✈️" },
  { value: "resident", label: "Résident Permanent", icon: "🏠" },
  { value: "sans_papiers", label: "Sans Papiers (confidentiel)", icon: "📄" },
  { value: "detenu", label: "Détenu / Famille de détenu", icon: "⛓️" },
];

export default function InscriptionPage() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1=profil, 2=form, 3=success
  const [profil, setProfil] = useState("");
  const [form, setForm] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateField = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/inscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profil, ...form }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur lors de l'inscription");
      setStep(3);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  if (step === 3) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-green-900 mb-2">Inscription envoyée !</h2>
          <p className="text-gray-600 mb-6">
            Votre dossier a été transmis à l'Ambassade du Mali à Moscou. 
            Vous recevrez une confirmation par email après vérification.
          </p>
          <Link href="/" className="text-green-700 hover:text-green-800 underline text-sm">Retour à l'accueil</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="flex items-center gap-1 text-sm text-gray-500 hover:text-green-700 mb-6">
          <ArrowLeft className="w-4 h-4" /> Retour à l'accueil
        </Link>

        <div className="bg-white rounded-2xl shadow-lg border p-6 md:p-8">
          <div className="flex h-1 rounded-full overflow-hidden mb-6">
            <div className="flex-1 bg-green-600" />
            <div className="flex-1 bg-yellow-400" />
            <div className="flex-1 bg-red-600" />
          </div>

          {step === 1 && (
            <>
              <h1 className="text-2xl font-bold text-green-900 mb-2">Inscription</h1>
              <p className="text-sm text-gray-500 mb-6">Choisissez votre profil pour commencer</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PROFILS.map(p => (
                  <button
                    key={p.value}
                    onClick={() => { setProfil(p.value); setStep(2); }}
                    className="flex items-center gap-3 p-4 rounded-xl border hover:border-green-500 hover:bg-green-50 transition-all text-left"
                  >
                    <span className="text-2xl">{p.icon}</span>
                    <span className="font-medium text-gray-900 text-sm">{p.label}</span>
                  </button>
                ))}
              </div>
              {profil === "sans_papiers" && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-sm">
                  Les informations fournies resteront confidentielles et seront uniquement consultées par l'Ambassade.
                </div>
              )}
            </>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-xl font-bold text-green-900 mb-2">
                {PROFILS.find(p => p.value === profil)?.icon} {PROFILS.find(p => p.value === profil)?.label}
              </h2>
              <p className="text-sm text-gray-500 mb-4">Remplissez vos informations ci-dessous</p>

              {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}

              <div className="grid grid-cols-2 gap-3">
                <div><Label>Nom *</Label><Input value={form.nom || ""} onChange={e => updateField("nom", e.target.value)} required /></div>
                <div><Label>Prénom *</Label><Input value={form.prenom || ""} onChange={e => updateField("prenom", e.target.value)} required /></div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div><Label>Date de naissance</Label><Input type="date" value={form.date_naissance || ""} onChange={e => updateField("date_naissance", e.target.value)} /></div>
                <div>
                  <Label>Sexe</Label>
                  <Select value={form.sexe || ""} onValueChange={v => updateField("sexe", v)}>
                    <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="M">Masculin</SelectItem>
                      <SelectItem value="F">Féminin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div><Label>Numéro de passeport *</Label><Input value={form.numero_passeport || ""} onChange={e => updateField("numero_passeport", e.target.value)} required /></div>
              <div><Label>Date d'expiration du passeport</Label><Input type="date" value={form.date_expiration_passeport || ""} onChange={e => updateField("date_expiration_passeport", e.target.value)} /></div>

              <div className="grid grid-cols-2 gap-3">
                <div><Label>Téléphone (RUS) *</Label><Input placeholder="+7 XXX XXX XX XX" value={form.telephone_rus || ""} onChange={e => updateField("telephone_rus", e.target.value)} /></div>
                <div><Label>Téléphone (MALI)</Label><Input placeholder="+223 XX XX XX XX" value={form.telephone_mali || ""} onChange={e => updateField("telephone_mali", e.target.value)} /></div>
              </div>

              <div><Label>Email</Label><Input type="email" value={form.email || ""} onChange={e => updateField("email", e.target.value)} /></div>

              <div><Label>Adresse en Russie</Label><Input value={form.adresse_russie || ""} onChange={e => updateField("adresse_russie", e.target.value)} /></div>

              <div>
                <Label>Ville</Label>
                <Select value={form.ville || ""} onValueChange={v => updateField("ville", v)}>
                  <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Moscou">Moscou</SelectItem>
                    <SelectItem value="Saint-Pétersbourg">Saint-Pétersbourg</SelectItem>
                    <SelectItem value="Kazan">Kazan</SelectItem>
                    <SelectItem value="Voronej">Voronej</SelectItem>
                    <SelectItem value="Rostov-sur-le-Don">Rostov-sur-le-Don</SelectItem>
                    <SelectItem value="Novossibirsk">Novossibirsk</SelectItem>
                    <SelectItem value="Ekaterinbourg">Ekaterinbourg</SelectItem>
                    <SelectItem value="Autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <hr className="my-4" />

              {profil === "boursier" && (
                <>
                  <h3 className="font-semibold text-gray-900">Informations étudiant</h3>
                  <div><Label>Université *</Label><Input value={form.universite || ""} onChange={e => updateField("universite", e.target.value)} /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><Label>Filière</Label><Input value={form.filiere || ""} onChange={e => updateField("filiere", e.target.value)} /></div>
                    <div>
                      <Label>Niveau</Label>
                      <Select value={form.niveau || ""} onValueChange={v => updateField("niveau", v)}>
                        <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Licence">Licence</SelectItem>
                          <SelectItem value="Master">Master</SelectItem>
                          <SelectItem value="Doctorat">Doctorat</SelectItem>
                          <SelectItem value="Spécialiste">Spécialiste</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><Label>Date d'arrivée en Russie</Label><Input type="date" value={form.date_arrivee || ""} onChange={e => updateField("date_arrivee", e.target.value)} /></div>
                    <div><Label>Date fin d'études</Label><Input type="date" value={form.date_fin_cycle || ""} onChange={e => updateField("date_fin_cycle", e.target.value)} /></div>
                  </div>
                  <div><Label>Montant mensuel de la bourse (RUB)</Label><Input type="number" value={form.montant_mensuel || ""} onChange={e => updateField("montant_mensuel", e.target.value)} /></div>

                  <h3 className="font-semibold text-gray-900 mt-4">Coordonnées bancaires (pour le paiement de la bourse)</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div><Label>Banque</Label><Input placeholder="Сбербанк, ВТБ..." value={form.banque || ""} onChange={e => updateField("banque", e.target.value)} /></div>
                    <div><Label>БИК (9 chiffres)</Label><Input placeholder="044525225" value={form.bik || ""} onChange={e => updateField("bik", e.target.value)} /></div>
                  </div>
                  <div><Label>Compte bancaire (20 chiffres)</Label><Input placeholder="40817.810.2.38000123456" value={form.compte || ""} onChange={e => updateField("compte", e.target.value)} /></div>
                </>
              )}

              {profil === "militaire" && (
                <>
                  <h3 className="font-semibold text-gray-900">Informations militaires</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Grade</Label>
                      <Select value={form.grade || ""} onValueChange={v => updateField("grade", v)}>
                        <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Élève Officier">Élève Officier</SelectItem>
                          <SelectItem value="Sous-Lieutenant">Sous-Lieutenant</SelectItem>
                          <SelectItem value="Lieutenant">Lieutenant</SelectItem>
                          <SelectItem value="Capitaine">Capitaine</SelectItem>
                          <SelectItem value="Commandant">Commandant</SelectItem>
                          <SelectItem value="Colonel">Colonel</SelectItem>
                          <SelectItem value="Autre">Autre</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div><Label>Matricule</Label><Input value={form.matricule || ""} onChange={e => updateField("matricule", e.target.value)} /></div>
                  </div>
                  <div>
                    <Label>Arme / Service</Label>
                    <Select value={form.arme_service || ""} onValueChange={v => updateField("arme_service", v)}>
                      <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Armée de Terre">Armée de Terre</SelectItem>
                        <SelectItem value="Armée de l'Air">Armée de l'Air</SelectItem>
                        <SelectItem value="Marine">Marine</SelectItem>
                        <SelectItem value="Gendarmerie">Gendarmerie</SelectItem>
                        <SelectItem value="Garde Nationale">Garde Nationale</SelectItem>
                        <SelectItem value="Autre">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div><Label>Établissement de formation</Label><Input value={form.etablissement_formation || ""} onChange={e => updateField("etablissement_formation", e.target.value)} /></div>
                </>
              )}

              {(profil === "sans_papiers" || profil === "detenu") && (
                <div>
                  <Label>Description de la situation *</Label>
                  <Textarea rows={4} placeholder="Décrivez votre situation en toute confidentialité..." value={form.description || ""} onChange={e => updateField("description", e.target.value)} required />
                </div>
              )}

              {profil === "detenu" && (
                <>
                  <div><Label>Lieu de détention</Label><Input value={form.lieu_detention || ""} onChange={e => updateField("lieu_detention", e.target.value)} /></div>
                  <div><Label>Date d'arrestation</Label><Input type="date" value={form.date_arrestation || ""} onChange={e => updateField("date_arrestation", e.target.value)} /></div>
                  <div><Label>Contact famille (nom et téléphone)</Label><Input value={form.contact_famille || ""} onChange={e => updateField("contact_famille", e.target.value)} /></div>
                </>
              )}

              <hr className="my-4" />

              <div><Label>Contact urgence (nom et téléphone)</Label><Input value={form.contact_urgence || ""} onChange={e => updateField("contact_urgence", e.target.value)} /></div>

              <div className="flex justify-between gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setStep(1)}>Changer de profil</Button>
                <Button type="submit" disabled={loading} className="bg-green-700 hover:bg-green-800">
                  {loading ? "Envoi en cours..." : "Envoyer ma candidature"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
