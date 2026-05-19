"use client";

import { useRouter } from "next/navigation";
import { LogOut, Menu, Globe } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("nav");

  const handleLogout = async () => {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/login");
  };

  const toggleLocale = () => {
    const newLocale = locale === "fr" ? "ru" : "fr";
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white px-4 md:px-6 shadow-sm">
      <button
        onClick={onMenuClick}
        className="lg:hidden text-gray-600 hover:text-gray-900"
      >
        <Menu className="h-6 w-6" />
      </button>

      <div className="flex-1" />

      <button
        onClick={toggleLocale}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-green-700 transition-colors"
      >
        <Globe className="h-4 w-4" />
        <span>{locale === "fr" ? "RU" : "FR"}</span>
      </button>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleLogout}
        className="text-gray-500 hover:text-red-600"
      >
        <LogOut className="h-4 w-4 mr-1" />
        {t("logout")}
      </Button>
    </header>
  );
}
