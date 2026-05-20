"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import AmbassadeSidebar from "@/components/layout/AmbassadeSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [role, setRole] = useState<string>("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    fetch("/api/auth/me")
      .then(r => r.json())
      .then(d => {
        const r = d.user?.role_specifique || d.user?.role;
        if (r) setRole(r);
      })
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/login");
  };

  const handleToggleLocale = () => {
    const newLocale = locale === "fr" ? "ru" : "fr";
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AmbassadeSidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        role={role as any}
        onLogout={handleLogout}
        locale={locale}
        onToggleLocale={handleToggleLocale}
      />
      <div className={`transition-all duration-300 ${collapsed ? "ml-16" : "ml-64"}`}>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white px-4 md:px-6 shadow-sm">
          <button className="lg:hidden text-gray-600" onClick={() => setCollapsed(!collapsed)}>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <div className="flex-1" />
        </header>
        <main className="p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
