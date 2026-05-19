import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
  customMap?: Record<string, "default" | "secondary" | "destructive" | "warning" | "info">;
}

const defaultMap: Record<string, "default" | "secondary" | "destructive" | "warning" | "info"> = {
  Actif: "default",
  "En formation": "default",
  "En séjour": "default",
  Payé: "default",
  Approuvé: "default",
  Résolu: "default",
  Arrivé: "default",
  "Billet émis": "default",
  "Voyage effectué": "default",
  Suspendu: "warning",
  "En attente": "warning",
  Demande: "warning",
  Nouveau: "info",
  "En cours": "info",
  Terminé: "secondary",
  Annulé: "secondary",
  Refusé: "destructive",
  Rejeté: "destructive",
  Absent: "destructive",
  Décédé: "destructive",
  Diabétique: "info",
};

export default function StatusBadge({ status, customMap }: StatusBadgeProps) {
  const map = customMap || defaultMap;
  const variant = map[status] || "secondary";
  return <Badge variant={variant}>{status}</Badge>;
}
