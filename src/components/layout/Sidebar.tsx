"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard, GraduationCap, BookOpen, Shield,
  CreditCard, Calendar, MessageSquare, Briefcase,
  MapPin, House, Plane, TriangleAlert, Ticket,
  QrCode, FileText, ChevronLeft, ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { nameKey: "Tableau de Bord", href: "/dashboard", icon: LayoutDashboard },
  { nameKey: "Étudiants Boursiers", href: "/dashboard/etudiants", icon: GraduationCap },
  { nameKey: "Étudiants Contractuels", href: "/dashboard/etudiants-contractuels", icon: BookOpen },
  { nameKey: "Étudiants Militaires", href: "/dashboard/etudiants-militaires", icon: Shield },
  { nameKey: "Travailleurs", href: "/dashboard/travailleurs", icon: Briefcase },
  { nameKey: "Visiteurs", href: "/dashboard/visiteurs", icon: MapPin },
  { nameKey: "Résidents", href: "/dashboard/residents", icon: House },
  { nameKey: "Paiements", href: "/dashboard/paiements", icon: CreditCard },
  { nameKey: "Congés Académiques", href: "/dashboard/conges", icon: Calendar },
  { nameKey: "Doléances & Demandes", href: "/dashboard/doleances", icon: MessageSquare },
  { nameKey: "Déclarations d'Arrivée", href: "/dashboard/declarations-arrivee", icon: Plane },
  { nameKey: "Suivi Retards", href: "/dashboard/suivi-boursiers", icon: TriangleAlert },
  { nameKey: "Billets de Voyage", href: "/dashboard/billets-voyage", icon: Ticket },
  { nameKey: "Affiche QR Code", href: "/dashboard/qr-code", icon: QrCode },
  { nameKey: "Présentation", href: "/dashboard/presentation", icon: FileText },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-full flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
      style={{ background: "linear-gradient(180deg, #14532d 0%, #15803d 100%)" }}
    >
      <div className="flex items-center gap-1 h-1.5 shrink-0">
        <div className="h-full flex-1 bg-green-600" />
        <div className="h-full flex-1 bg-yellow-400" />
        <div className="h-full flex-1 bg-red-600" />
      </div>

      <div className={cn("flex items-center gap-3 px-4 py-5", collapsed && "justify-center px-2")}>
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-400 text-white font-bold text-lg shrink-0">
          M
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
                    <div className="text-yellow-400 font-bold text-base leading-tight">Portail Ambassade</div>
            <div className="text-green-200 text-xs">Ambassade - Moscou</div>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-2 scrollbar-thin scrollbar-thumb-green-600">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 transition-colors",
                isActive
                  ? "bg-green-800/60 text-white font-medium"
                  : "text-green-100 hover:bg-green-800/40 hover:text-white",
                collapsed && "justify-center px-0"
              )}
              title={collapsed ? item.nameKey : undefined}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span className="text-sm truncate">{item.nameKey}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-green-600/50 p-2">
        <button
          onClick={onToggle}
          className="flex items-center justify-center w-full py-2 text-green-200 hover:text-white hover:bg-green-800/40 rounded-lg transition-colors"
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>
    </aside>
  );
}
