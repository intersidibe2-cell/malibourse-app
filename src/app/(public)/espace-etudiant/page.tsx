"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function EspaceEtudiantPage() {
  const router = useRouter();
  const [form, setForm] = useState({ nom: "", prenom: "", telephone: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/etudiant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Aucun dossier trouvé. Vérifiez vos informations.");
      if (data.token) {
        document.cookie = `token_etudiant=${data.token}; path=/; max-age=86400`;
      }
      router.push("/espace-etudiant/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Aucun dossier trouvé. Vérifiez vos informations.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 py-8 px-4">
      <div className="max-w-md mx-auto">
        <Link href="/" className="flex items-center gap-1 text-sm text-gray-500 hover:text-green-700 mb-6">
          <ArrowLeft className="w-4 h-4" /> Retour
        </Link>

        <div className="bg-white rounded-2xl shadow-lg border p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-md">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Espace Étudiant</h1>
              <p className="text-xs text-gray-500">Connectez-vous avec vos informations personnelles</p>
            </div>
          </div>

          {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Nom *</Label>
              <Input value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} required />
            </div>
            <div>
              <Label>Prénom *</Label>
              <Input value={form.prenom} onChange={(e) => setForm({ ...form, prenom: e.target.value })} required />
            </div>
            <div>
              <Label>Téléphone *</Label>
              <Input type="tel" value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })} required />
            </div>

            <Button type="submit" className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0" disabled={loading || !form.nom || !form.prenom || !form.telephone}>
              {loading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Connexion...</> : "Se connecter"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
