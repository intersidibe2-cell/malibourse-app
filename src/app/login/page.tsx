"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, User, Lock, Eye, EyeOff, ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const t = useTranslations("auth");
  const appT = useTranslations("app");
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t("loginError"));
      document.cookie = `token=${data.token}; path=/; max-age=86400; SameSite=Lax`;
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0d3b1e 0%, #14532d 50%, #0d3b1e 100%)" }}>
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 0L100 50L50 100L0 50Z' fill='%23ffffff' fill-opacity='0.1'/%3E%3C/svg%3E\")", backgroundSize: "120px 120px" }} />

      {/* Login Card */}
      <div className="w-full max-w-md relative animate-fade-in-up" style={{ animation: "fadeInUp 0.8s ease-out" }}>
        {/* Tricolore band */}
        <div className="flex h-1.5 rounded-t-2xl overflow-hidden">
          <div className="flex-1 bg-green-600" />
          <div className="flex-1 bg-yellow-400" />
          <div className="flex-1 bg-red-600" />
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-b-2xl shadow-2xl border border-white/20 p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-400 flex items-center justify-center text-white font-bold text-2xl shadow-lg animate-fade-in"
              style={{ boxShadow: "0 0 30px rgba(234, 179, 8, 0.3)" }}>
              M
            </div>
            <h1 className="text-xl font-bold text-green-900">{appT("name")}</h1>
            <p className="text-sm text-gray-500 mt-1">{appT("subtitle")}</p>
          </div>

          {/* Separator */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Espace réservé au personnel
            </span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-start gap-2 animate-fade-in">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">Login</Label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  placeholder="ambassadeur, culturel, comptable..."
                  className="pl-10 border-gray-200 focus:border-yellow-500 focus:ring-yellow-500/30 h-10 bg-gray-50/50 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">Mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  minLength={6}
                  placeholder="Mot de passe"
                  className="pl-10 pr-10 border-gray-200 focus:border-yellow-500 focus:ring-yellow-500/30 h-10 bg-gray-50/50 focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-400 hover:to-yellow-300 text-green-900 font-bold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] h-11"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Connexion...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <LogIn className="w-4 h-4" />
                  Se connecter
                </span>
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center space-y-3">
            <Link href="/" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-green-700 transition-colors">
              <ArrowLeft className="w-3 h-3" />
              Retour au site public
            </Link>
            <p className="text-xs text-gray-400">© 2026 — Ambassade du Mali à Moscou</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in-up { animation: fadeInUp 0.8s ease-out; }
        .animate-fade-in { animation: fadeIn 0.5s ease-out; }
      `}</style>
    </div>
  );
}
