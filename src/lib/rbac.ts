export type Role = "ambassadeur" | "culturel" | "comptable" | "consulaire" | "defense" | "secretariat"

export const rolePermissions: Record<Role, { modules: string[]; menu: { href: string; label: string; icon: string }[] }> = {
  ambassadeur: {
    modules: [
      "dashboard", "etudiants", "etudiants-contractuels", "etudiants-militaires",
      "paiements", "conges", "doleances", "travailleurs", "visiteurs",
      "residents", "declarations-arrivee", "suivi-boursiers", "billets-voyage",
      "verification", "sans-papiers", "detentions", "alertes", "import",
      "ressortissants", "qr-codes",
    ],
    menu: [
      { href: "/dashboard", label: "Tableau de Bord", icon: "LayoutDashboard" },
      { href: "/dashboard/etudiants", label: "Étudiants Boursiers", icon: "GraduationCap" },
      { href: "/dashboard/etudiants-contractuels", label: "Contractuels", icon: "BookOpen" },
      { href: "/dashboard/etudiants-militaires", label: "Militaires", icon: "Shield" },
      { href: "/dashboard/paiements", label: "Paiements", icon: "CreditCard" },
      { href: "/dashboard/travailleurs", label: "Travailleurs", icon: "Briefcase" },
      { href: "/dashboard/visiteurs", label: "Visiteurs", icon: "MapPin" },
      { href: "/dashboard/residents", label: "Résidents", icon: "House" },
      { href: "/dashboard/doleances", label: "Doléances", icon: "MessageSquare" },
      { href: "/dashboard/conges", label: "Congés", icon: "Calendar" },
      { href: "/dashboard/declarations-arrivee", label: "Déclarations", icon: "Plane" },
      { href: "/dashboard/billets-voyage", label: "Billets", icon: "Ticket" },
      { href: "/dashboard/sans-papiers", label: "Sans Papiers", icon: "FileQuestion" },
      { href: "/dashboard/detentions", label: "Détentions", icon: "Lock" },
      { href: "/dashboard/verification", label: "À Vérifier", icon: "ClipboardCheck" },
      { href: "/dashboard/alertes", label: "Alertes", icon: "Bell" },
      { href: "/dashboard/import", label: "Import/Export", icon: "Upload" },
      { href: "/dashboard/suivi-boursiers", label: "Suivi Retards", icon: "TriangleAlert" },
      { href: "/dashboard/qr-codes", label: "QR Codes", icon: "QrCode" },
    ],
  },
  culturel: {
    modules: ["dashboard", "etudiants", "etudiants-contractuels", "etudiants-militaires", "verification"],
    menu: [
      { href: "/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
      { href: "/dashboard/etudiants", label: "Étudiants Boursiers", icon: "GraduationCap" },
      { href: "/dashboard/etudiants-contractuels", label: "Contractuels", icon: "BookOpen" },
      { href: "/dashboard/etudiants-militaires", label: "Militaires", icon: "Shield" },
      { href: "/dashboard/verification", label: "À Vérifier", icon: "ClipboardCheck" },
    ],
  },
  comptable: {
    modules: ["dashboard", "paiements", "etudiants"],
    menu: [
      { href: "/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
      { href: "/dashboard/paiements", label: "Paiements & Bourses", icon: "CreditCard" },
      { href: "/dashboard/etudiants", label: "Boursiers", icon: "GraduationCap" },
    ],
  },
  consulaire: {
    modules: ["dashboard", "travailleurs", "visiteurs", "residents", "sans-papiers", "detentions", "alertes", "declarations-arrivee", "doleances"],
    menu: [
      { href: "/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
      { href: "/dashboard/ressortissants", label: "Ressortissants", icon: "Users" },
      { href: "/dashboard/travailleurs", label: "Travailleurs", icon: "Briefcase" },
      { href: "/dashboard/visiteurs", label: "Visiteurs", icon: "MapPin" },
      { href: "/dashboard/residents", label: "Résidents", icon: "House" },
      { href: "/dashboard/sans-papiers", label: "Sans Papiers", icon: "FileQuestion" },
      { href: "/dashboard/detentions", label: "Détentions", icon: "Lock" },
      { href: "/dashboard/alertes", label: "Alertes", icon: "Bell" },
    ],
  },
  defense: {
    modules: ["dashboard", "etudiants-militaires"],
    menu: [
      { href: "/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
      { href: "/dashboard/etudiants-militaires", label: "Étudiants Militaires", icon: "Shield" },
    ],
  },
  secretariat: {
    modules: ["dashboard", "verification", "etudiants", "travailleurs", "visiteurs", "declarations-arrivee"],
    menu: [
      { href: "/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
      { href: "/dashboard/verification", label: "À Vérifier", icon: "ClipboardCheck" },
    ],
  },
}

export function hasAccess(role: Role | undefined, module: string): boolean {
  if (!role) return false
  if (role === "ambassadeur") return true
  return rolePermissions[role]?.modules.includes(module) ?? false
}

export function getMenu(role: Role | undefined) {
  if (!role) return []
  return rolePermissions[role]?.menu ?? []
}
