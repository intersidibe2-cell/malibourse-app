"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Pencil, Trash2, Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import SearchBar from "@/components/shared/SearchBar";
import EmptyState from "@/components/shared/EmptyState";
import StatusBadge from "@/components/shared/StatusBadge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type FieldType = "text" | "number" | "date" | "email" | "select" | "textarea" | "tel";

interface FieldConfig {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: { value: string; label: string }[];
  width?: string;
  selectGroup?: string;
}

interface CrudPageProps {
  title: string;
  apiEndpoint: string;
  fields: FieldConfig[];
  columns: { key: string; label: string; render?: (value: unknown, row: any) => React.ReactNode }[];
  statusField?: string;
  searchFields?: string[];
  idField?: string;
  defaultFormValues?: Record<string, string>;
  customActions?: (row: any, refresh: () => void) => React.ReactNode;
  extraButtons?: React.ReactNode;
}

export default function CrudPage({
  title,
  apiEndpoint,
  fields,
  columns,
  statusField,
  searchFields = [],
  idField = "id",
  defaultFormValues = {},
  customActions,
  extraButtons,
}: CrudPageProps) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<Record<string, string>>(defaultFormValues);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (statusFilter) params.set("status", statusFilter);
      const res = await fetch(`${apiEndpoint}?${params.toString()}`);
      const json = await res.json();
      setData(json.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [apiEndpoint, search, statusFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openAdd = () => {
    setEditingId(null);
    setFormValues(defaultFormValues);
    setError("");
    setDialogOpen(true);
  };

  const openEdit = (row: any) => {
    setEditingId(row[idField] as string);
    const values: Record<string, string> = {};
    fields.forEach((f) => {
      values[f.key] = (row[f.key] as string) || "";
    });
    setFormValues(values);
    setError("");
    setDialogOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `${apiEndpoint}/${editingId}` : apiEndpoint;
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formValues),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Erreur");
      setDialogOpen(false);
      toast.success(editingId ? "Modifié avec succès" : "Ajouté avec succès");
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
      toast.error(err instanceof Error ? err.message : "Erreur lors de l'enregistrement");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmId) return;
    try {
      await fetch(`${apiEndpoint}/${confirmId}`, { method: "DELETE" });
      toast.success("Supprimé avec succès");
      setConfirmOpen(false);
      setConfirmId(null);
      fetchData();
    } catch (err) {
      toast.error("Erreur lors de la suppression");
      setConfirmOpen(false);
      setConfirmId(null);
    }
  };

  const askDelete = (id: string) => {
    setConfirmId(id);
    setConfirmOpen(true);
  };

  const statusOptions = (() => {
    if (!statusField) return [];
    const set = new Set<string>();
    data.forEach((d) => {
      const val = d[statusField as string] as string;
      if (val) set.add(val);
    });
    return Array.from(set);
  })();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <div className="flex items-center gap-2">
          {extraButtons}
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openAdd} size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Ajouter
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingId ? "Modifier" : "Ajouter"} {title}</DialogTitle>
              </DialogHeader>
              {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}
              <div className="grid gap-4 py-4">
                {fields.map((field) => (
                  <div key={field.key} className={cn("grid gap-1.5", field.width || "")}>
                    <Label>{field.label}{field.required && " *"}</Label>
                    {field.type === "select" ? (
                      <Select
                        value={formValues[field.key] || ""}
                        onValueChange={(v) => setFormValues({ ...formValues, [field.key]: v })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={`Sélectionner ${field.label.toLowerCase()}`} />
                        </SelectTrigger>
                        <SelectContent>
                          {field.options?.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : field.type === "textarea" ? (
                      <Textarea
                        value={formValues[field.key] || ""}
                        onChange={(e) => setFormValues({ ...formValues, [field.key]: e.target.value })}
                        required={field.required}
                      />
                    ) : (
                      <Input
                        type={field.type}
                        value={formValues[field.key] || ""}
                        onChange={(e) => setFormValues({ ...formValues, [field.key]: e.target.value })}
                        required={field.required}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-2">
                <DialogClose asChild>
                  <Button variant="outline">Annuler</Button>
                </DialogClose>
                <Button onClick={handleSave} disabled={saving}>
                  {saving && <Loader2 className="w-4 h-4 mr-1 animate-spin" />}
                  {editingId ? "Modifier" : "Ajouter"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <SearchBar value={search} onChange={setSearch} />
        {statusField && statusOptions.length > 0 && (
          <select
            className="h-9 rounded-md border border-gray-300 bg-white px-3 text-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Tous les statuts</option>
            {statusOptions.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-green-700" />
        </div>
      ) : data.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="bg-white rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  {columns.map((col) => (
                    <th key={col.key} className="text-left px-4 py-3 font-medium text-gray-600 whitespace-nowrap">
                      {col.label}
                    </th>
                  ))}
                  <th className="text-right px-4 py-3 font-medium text-gray-600 w-24">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    {columns.map((col) => (
                      <td key={col.key} className="px-4 py-3 whitespace-nowrap">
                        {col.render ? col.render(row[col.key], row) : (row[col.key] as string) || "-"}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      {customActions ? customActions(row, fetchData) : (
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => openEdit(row)} className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 hover:text-blue-600">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button onClick={() => askDelete(row[idField] as string)} className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 hover:text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Confirmation dialog */}
      <Dialog open={confirmOpen} onOpenChange={(open) => { if (!open) { setConfirmOpen(false); setConfirmId(null); } }}>
        <DialogContent className="max-w-sm">
          <div className="text-center py-4">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <DialogTitle className="text-lg font-semibold text-gray-900 mb-2">Confirmer la suppression</DialogTitle>
            <p className="text-sm text-gray-500 mb-6">Cette action est irréversible.</p>
            <div className="flex justify-center gap-3">
              <DialogClose asChild>
                <Button variant="outline">Annuler</Button>
              </DialogClose>
              <Button onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">Supprimer</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
