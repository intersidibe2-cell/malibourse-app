"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Download, FileSpreadsheet, CheckCircle, AlertCircle } from "lucide-react";

export default function ImportPage() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleImport = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/import/etudiants", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Import / Export</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border p-6">
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2"><Upload className="w-5 h-5 text-blue-600" /> Importer des étudiants</h2>
          <p className="text-sm text-gray-500 mb-4">Téléchargez un fichier TSV (tabulations) avec les colonnes :<br />
          <code className="text-xs bg-gray-100 p-1 rounded">Nom Prénom Passeport Téléphone Email Université Filière Niveau Ville Montant Devise</code></p>
          <div className="border-2 border-dashed rounded-lg p-6 text-center mb-4" onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); setFile(e.dataTransfer.files[0]); }}>
            <FileSpreadsheet className="w-10 h-10 mx-auto text-gray-300 mb-2" />
            {file ? (
              <p className="text-sm font-medium">{file.name} ({Math.round(file.size / 1024)} Ko)</p>
            ) : (
              <p className="text-sm text-gray-500">Glissez votre fichier ou cliquez pour parcourir</p>
            )}
            <input ref={fileRef} type="file" accept=".tsv,.csv,.txt" className="hidden" onChange={e => setFile(e.target.files?.[0] || null)} />
            <Button variant="outline" size="sm" className="mt-2" onClick={() => fileRef.current?.click()}>Choisir un fichier</Button>
          </div>
          {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm mb-4">{error}</div>}
          <Button onClick={handleImport} disabled={!file || loading} className="w-full">
            {loading ? "Importation..." : "Importer"}
          </Button>
          {result && (
            <div className={`mt-4 p-3 rounded-lg flex items-start gap-2 text-sm ${result.imported > 0 ? "bg-green-50 text-green-700 border border-green-200" : "bg-yellow-50 text-yellow-700 border border-yellow-200"}`}>
              {result.imported > 0 ? <CheckCircle className="w-5 h-5 mt-0.5" /> : <AlertCircle className="w-5 h-5 mt-0.5" />}
              <div>
                <p className="font-medium">{result.message}</p>
                {result.imported > 0 && <p className="text-xs mt-1">{result.imported}/{result.total} importés</p>}
                {result.errors?.length > 0 && <p className="text-xs mt-1 text-red-600">{result.errors.length} erreurs</p>}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg border p-6">
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2"><Download className="w-5 h-5 text-green-600" /> Exporter</h2>
          <p className="text-sm text-gray-500 mb-4">Téléchargez les données de la plateforme</p>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start" onClick={() => window.open("/api/etudiants?limit=1000", "_blank")}>
              <Download className="w-4 h-4 mr-2" /> Exporter les étudiants (JSON)
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => window.open("/api/stats", "_blank")}>
              <Download className="w-4 h-4 mr-2" /> Exporter les statistiques
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
