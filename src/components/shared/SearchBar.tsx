"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder }: SearchBarProps) {
  const t = useTranslations("form");
  return (
    <div className="relative">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
      <Input
        placeholder={placeholder || t("rechercher")}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-8 w-full md:w-72"
      />
    </div>
  );
}
