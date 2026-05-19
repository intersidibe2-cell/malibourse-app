"use client";

import { useState, useCallback, useEffect } from "react";
import CrudPage from "@/components/shared/CrudPage";
import StatusBadge from "@/components/shared/StatusBadge";
import { formatDate, formatCurrency } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Zap } from "lucide-react";

export default function PaiementsPage() {
  const t = useTranslations();
  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkMois, setBulkMois] = useState(new Date().toLocaleString("fr", { month: "long" }));
  const [bulkAnnee, setBulkAnnee] = useState(new Date().getFullYear().toString());
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkResult, setBulkResult] = useState("");

  const handleBulkGenerate = async () => {
    setBulkLoading(true);
    setBulkResult("");
    try {
      const res = await fetch("/api/paiements/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mois: bulkMois, annee: bulkAnnee }),
      });
      const data = await res.json();
      setBulkResult(`${data.created} paiements générés`);
    } catch {
      setBulkResult("Erreur lors de la génération");
    } finally {
      setBulkLoading(false);
    }
  };

  const bulkButton = (
    <Dialog open={bulkOpen} onOpenChange={setBulkOpen}>
      <DialogTrigger asChild>
        <Button variant="gold" size="sm">
          <Zap className="w-4 h-4 mr-1" />
          Générer les bourses du mois
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Générer les bourses mensuelles</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Mois</Label>
              <Select value={bulkMois} onValueChange={setBulkMois}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"].map((m) => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Année</Label>
              <Input type="number" value={bulkAnnee} onChange={(e) => setBulkAnnee(e.target.value)} />
            </div>
          </div>
          {bulkResult && <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">{bulkResult}</div>}
          <Button onClick={handleBulkGenerate} disabled={bulkLoading}>
            {bulkLoading && <Loader2 className="w-4 h-4 mr-1 animate-spin" />}
            Générer
          </Button>
        </div>
        <DialogClose asChild>
          <Button variant="outline">Fermer</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );

  return (
    <CrudPage
      title={t("nav.paiements")}
      apiEndpoint="/api/paiements"
      statusField="statut"
      fields={[
        { key: "etudiant_nom", label: "Étudiant", type: "text", required: true },
        { key: "type_paiement", label: "Type", type: "select", options: [
          { value: "Bourse mensuelle", label: "Bourse mensuelle" },
          { value: "Trousseau", label: "Trousseau" },
          { value: "Allocation spéciale", label: "Allocation spéciale" },
          { value: "Remboursement frais médicaux", label: "Remboursement frais médicaux" },
          { value: "Autre", label: "Autre" },
        ]},
        { key: "montant", label: "Montant", type: "number", required: true },
        { key: "devise", label: "Devise", type: "select", options: [
          { value: "RUB", label: "RUB" }, { value: "USD", label: "USD" },
          { value: "EUR", label: "EUR" }, { value: "XOF", label: "XOF" },
        ]},
        { key: "mois_concerne", label: "Mois", type: "text" },
        { key: "annee_concerne", label: "Année", type: "text" },
        { key: "date_paiement", label: "Date", type: "date" },
        { key: "statut", label: "Statut", type: "select", options: [
          { value: "Payé", label: "Payé" }, { value: "En attente", label: "En attente" }, { value: "Annulé", label: "Annulé" },
        ]},
        { key: "reference", label: "Référence", type: "text" },
        { key: "observations", label: "Observations", type: "textarea" },
      ]}
      columns={[
        { key: "etudiant_nom", label: "Étudiant", render: (v) => <span className="font-medium">{v as string}</span> },
        { key: "type_paiement", label: "Type" },
        { key: "montant", label: "Montant", render: (v, r) => formatCurrency(v as number, r.devise as string) },
        { key: "mois_concerne", label: "Mois" },
        { key: "annee_concerne", label: "Année" },
        { key: "statut", label: "Statut", render: (v) => <StatusBadge status={v as string} /> },
        { key: "date_paiement", label: "Date", render: (v) => formatDate(v as string) },
      ]}
      extraButtons={bulkButton}
    />
  );
}
