"use client";

import { useRouter, usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  const router = useRouter();
  const pathname = usePathname();

  if (pathname === "/" || pathname.startsWith("/dashboard") || pathname.startsWith("/login")) {
    return null;
  }

  return (
    <button
      onClick={() => router.back()}
      className="fixed top-4 left-4 z-[100] w-10 h-10 rounded-full bg-white/90 backdrop-blur-md shadow-lg border flex items-center justify-center hover:bg-green-50 hover:border-green-300 transition-all active:scale-95"
      title="Retour"
    >
      <ArrowLeft className="w-5 h-5 text-green-700" />
    </button>
  );
}
