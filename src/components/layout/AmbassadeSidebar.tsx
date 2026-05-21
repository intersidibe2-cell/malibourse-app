"use client";

import { useState, useEffect, use } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  LayoutDashboard, GraduationCap, BookOpen, Shield,
  CreditCard, Briefcase, MapPin, House, MessageSquare,
  Calendar, Plane, Ticket, FileQuestion, Lock,
  ClipboardCheck, Bell, Upload, Users, LogOut, Menu,
  ChevronLeft, ChevronRight, Globe, QrCode, TriangleAlert, Construction, AlertTriangle, Megaphone,
  CalendarCheck, IdCard, HelpCircle, Download,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getMenu, type Role } from "@/lib/rbac";

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard, GraduationCap, BookOpen, Shield,
  CreditCard, Briefcase, MapPin, House, MessageSquare,
  Calendar, Plane, Ticket, FileQuestion, Lock,
  ClipboardCheck, Bell, Upload, Users, QrCode, TriangleAlert, Construction, AlertTriangle, Megaphone,
  CalendarCheck, IdCard, HelpCircle, Download,
};

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  role: Role;
  onLogout: () => void;
  locale: string;
  onToggleLocale: () => void;
}

export default function AmbassadeSidebar({ collapsed, onToggle, role, onLogout, locale, onToggleLocale }: SidebarProps) {
  const pathname = usePathname();
  const menuItems = getMenu(role);
  const [user, setUser] = useState<{ nom: string; prenom: string; role: string } | null>(null);

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(d => setUser(d.user)).catch(() => {});
  }, []);

  const roleLabels: Record<string, string> = {
    ambassadeur: "Ambassadeur",
    culturel: "Conseiller Culturel",
    comptable: "Agent Comptable",
    consulaire: "Conseiller Consulaire",
    defense: "Attaché Défense",
    secretariat: "Secrétariat",
  };

  return (
    <aside
      className={cn("fixed left-0 top-0 z-40 h-full flex flex-col transition-all duration-300", collapsed ? "w-16" : "w-64")}
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

      {!collapsed && user && (
        <div className="px-4 pb-3 border-b border-green-600/50">
          <div className="text-white text-sm font-medium truncate">{user.prenom} {user.nom}</div>
          <div className="text-green-300 text-xs">{roleLabels[user.role] || user.role}</div>
        </div>
      )}

      <nav className="flex-1 overflow-y-auto px-2 py-3 scrollbar-thin scrollbar-thumb-green-600">
        {menuItems.map((item) => {
          const Icon = iconMap[item.icon] || LayoutDashboard;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 transition-colors cursor-pointer",
                isActive
                  ? "bg-green-800/60 text-white font-medium"
                  : "text-green-100 hover:bg-green-800/40 hover:text-white",
                collapsed && "justify-center px-0"
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span className="text-sm truncate">{item.label}</span>}
            </a>
          );
        })}
      </nav>

      <div className="border-t border-green-600/50 p-2 space-y-1">
        <button onClick={onToggleLocale} className="flex items-center justify-center w-full py-2 text-green-200 hover:text-white hover:bg-green-800/40 rounded-lg transition-colors gap-2">
          <Globe className="w-4 h-4 shrink-0" />
          {!collapsed && <span className="text-sm">{locale === "fr" ? "Русский" : "Français"}</span>}
        </button>
        <button onClick={onLogout} className="flex items-center justify-center w-full py-2 text-green-200 hover:text-white hover:bg-green-800/40 rounded-lg transition-colors gap-2">
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span className="text-sm">Déconnexion</span>}
        </button>
        <button onClick={onToggle} className="flex items-center justify-center w-full py-2 text-green-200 hover:text-white hover:bg-green-800/40 rounded-lg transition-colors">
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>
    </aside>
  );
}
