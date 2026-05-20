"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, Users, Database, Clock, Download, Plus, Trash2 } from "lucide-react";

export default function AdminPage() {
  const router = useRouter();
  const [agents, setAgents] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});
  const [showAddAgent, setShowAddAgent] = useState(false);
  const [newAgent, setNewAgent] = useState({ email: "", nom: "", prenom: "", password: "", role: "secretariat" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(d => {
      if (d.user?.role !== "admin") router.push("/dashboard");
    });
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [agRes, stRes] = await Promise.all([
        fetch("/api/admin/agents"),
        fetch("/api/stats"),
      ]);
      if (agRes.ok) setAgents((await agRes.json()).data || []);
      if (stRes.ok) setStats(await stRes.json());
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const addAgent = async () => {
    try {
      await fetch("/api/admin/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAgent),
      });
      setShowAddAgent(false);
      setNewAgent({ email: "", nom: "", prenom: "", password: "", role: "secretariat" });
      loadData();
    } catch (e) { console.error(e); }
  };

  const deleteAgent = async (id: string) => {
    if (!confirm("Supprimer cet agent ?")) return;
    try {
      await fetch(`/api/admin/agents?id=${id}`, { method: "DELETE" });
      loadData();
    } catch (e) { console.error(e); }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-4 border-green-700 border-t-transparent" /></div>;

  const roleLabels: Record<string, string> = { ambassadeur: "🏛️ Ambassadeur", culturel: "🧑‍🏫 Culturel", comptable: "💰 Comptable", consulaire: "🪪 Consulaire", defense: "🎖️ Défense", secretariat: "📋 Secrétariat" };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2"><Shield className="w-6 h-6" /> Administration</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg border p-5 flex items-center gap-4">
          <Users className="w-8 h-8 text-blue-600" />
          <div><div className="text-2xl font-bold">{agents.length}</div><div className="text-sm text-gray-500">Agents</div></div>
        </div>
        <div className="bg-white rounded-lg border p-5 flex items-center gap-4">
          <Database className="w-8 h-8 text-green-600" />
          <div><div className="text-2xl font-bold">{stats.totalEtudiants || 0}</div><div className="text-sm text-gray-500">Étudiants</div></div>
        </div>
        <div className="bg-white rounded-lg border p-5 flex items-center gap-4">
          <Clock className="w-8 h-8 text-amber-600" />
          <div><div className="text-2xl font-bold">{stats.doleancesEnAttente || 0}</div><div className="text-sm text-gray-500">Doléances en attente</div></div>
        </div>
      </div>

      <div className="bg-white rounded-lg border mb-6">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="font-semibold flex items-center gap-2"><Users className="w-5 h-5" /> Gestion des agents</h2>
          <Button size="sm" onClick={() => setShowAddAgent(true)}><Plus className="w-4 h-4 mr-1" /> Ajouter</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-gray-50">
              <th className="text-left px-4 py-3 font-medium text-gray-600">Nom</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Email</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Rôle</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
            </tr></thead>
            <tbody>
              {agents.map((a: any, i: number) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{a.prenom} {a.nom}</td>
                  <td className="px-4 py-3 text-gray-500">{a.email}</td>
                  <td className="px-4 py-3">{roleLabels[a.role_specifique] || roleLabels[a.role] || a.role}</td>
                  <td className="px-4 py-3 text-right">
                    {a.role !== "admin" && (
                      <button onClick={() => deleteAgent(a.id)} className="p-1.5 rounded-md hover:bg-red-50 text-gray-500 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddAgent && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowAddAgent(false)}>
          <div className="bg-white rounded-xl p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-lg mb-4">Ajouter un agent</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Nom</Label><Input value={newAgent.nom} onChange={e => setNewAgent({ ...newAgent, nom: e.target.value })} /></div>
                <div><Label>Prénom</Label><Input value={newAgent.prenom} onChange={e => setNewAgent({ ...newAgent, prenom: e.target.value })} /></div>
              </div>
              <div><Label>Email</Label><Input type="email" value={newAgent.email} onChange={e => setNewAgent({ ...newAgent, email: e.target.value })} /></div>
              <div><Label>Mot de passe</Label><Input type="password" value={newAgent.password} onChange={e => setNewAgent({ ...newAgent, password: e.target.value })} /></div>
              <div>
                <Label>Rôle</Label>
                <Select value={newAgent.role} onValueChange={v => setNewAgent({ ...newAgent, role: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ambassadeur">Ambassadeur</SelectItem>
                    <SelectItem value="culturel">Conseiller Culturel</SelectItem>
                    <SelectItem value="comptable">Agent Comptable</SelectItem>
                    <SelectItem value="consulaire">Conseiller Consulaire</SelectItem>
                    <SelectItem value="defense">Attaché Défense</SelectItem>
                    <SelectItem value="secretariat">Secrétariat</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setShowAddAgent(false)}>Annuler</Button>
                <Button onClick={addAgent}>Ajouter</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
