"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, Globe, GraduationCap, BookOpen, Shield, 
  Briefcase, MapPin, House, FileQuestion, Lock, 
  ChevronRight, Star, Phone, Mail, MapPinned, 
  Users, Building2, Award, HeartHandshake, Construction
} from "lucide-react";

function AnimatedCounter({ end, duration = 2000, suffix = "" }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const counted = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !counted.current) {
        counted.current = true;
        const startTime = Date.now();
        const timer = setInterval(() => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const ease = 1 - Math.pow(1 - progress, 3);
          setCount(Math.floor(ease * end));
          if (progress >= 1) clearInterval(timer);
        }, 16);
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return <div ref={ref} className="text-4xl md:text-5xl font-bold text-yellow-400">{count}{suffix}</div>;
}

export default function HomePage() {
  const router = useRouter();
  const locale = useLocale();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const services = [
    { icon: GraduationCap, title: "Étudiants Boursiers", desc: "Suivi des bourses et paiements mensuels", href: "/inscription", color: "from-emerald-500 to-green-600", urgent: false },
    { icon: BookOpen, title: "Étudiants Contractuels", desc: "Enregistrement et accompagnement", href: "/inscription", color: "from-blue-500 to-blue-600", urgent: false },
    { icon: Shield, title: "Étudiants Militaires", desc: "Formation des officiers maliens", href: "/inscription", color: "from-amber-500 to-yellow-600", urgent: false },
    { icon: Briefcase, title: "Travailleurs", desc: "Accompagnement professionnel", href: "/inscription", color: "from-orange-500 to-red-600", urgent: false },
    { icon: MapPin, title: "Visiteurs & Touristes", desc: "Déclaration d'arrivée et assistance", href: "/inscription", color: "from-purple-500 to-purple-600", urgent: false },
    { icon: House, title: "Résidents Permanents", desc: "Suivi des Maliens établis en Russie", href: "/inscription", color: "from-teal-500 to-teal-600", urgent: false },
  ];

  const urgentServices = [
    { icon: FileQuestion, title: "Sans Papiers", desc: "Aide confidentielle", href: "/inscription", color: "from-red-500 to-red-600", urgent: true },
    { icon: Lock, title: "Assistance Détention", desc: "Suivi consulaire urgent", href: "/inscription", color: "from-gray-700 to-gray-900", urgent: true },
    { icon: Construction, title: "Services à venir", desc: "Légalisation, RDV, passeport, certificats...", href: "/services", color: "from-amber-500 to-amber-600", urgent: false },
  ];

  const toggleLocale = () => {
    const newLocale = locale === "fr" ? "ru" : "fr";
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Fixed header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-md shadow-lg py-2" : "bg-transparent py-4"}`}>
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-400 flex items-center justify-center text-white font-bold shadow-lg transition-transform hover:scale-110`}>
              M
            </div>
            <div className={scrolled ? "text-green-900" : "text-white"}>
              <div className="font-bold text-sm leading-tight">Ambassade du Mali</div>
              <div className="text-xs opacity-80">Moscou</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={toggleLocale} className={`flex items-center gap-1 text-sm transition-colors ${scrolled ? "text-gray-500 hover:text-green-700" : "text-white/80 hover:text-white"}`}>
              <Globe className="w-4 h-4" />
              {locale === "fr" ? "RU" : "FR"}
            </button>
            <Link href="/login" className={`text-sm font-medium hidden md:block transition-colors ${scrolled ? "text-green-700 hover:text-green-800" : "text-white/80 hover:text-white"}`}>
              Ambassade
            </Link>
            <Button size="sm" onClick={() => router.push("/inscription")} className="bg-yellow-500 hover:bg-yellow-600 text-green-900 font-semibold shadow-lg">
              S'inscrire
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background with gradient and pattern */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #0d3b1e 0%, #14532d 30%, #166534 60%, #15803d 100%)" }}>
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 0L100 50L50 100L0 50Z' fill='%23ffffff' fill-opacity='0.1'/%3E%3C/svg%3E\")", backgroundSize: "120px 120px" }} />
          <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />
        </div>

        {/* Tricolore band */}
        <div className="absolute top-0 left-0 right-0 flex h-1.5 z-10">
          <div className="flex-1 bg-green-600" />
          <div className="flex-1 bg-yellow-400" />
          <div className="flex-1 bg-red-600" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 pt-24 sm:pt-32 pb-16 sm:pb-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-4 sm:mb-6 animate-fade-in">
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
              <span className="text-yellow-300/80 text-[10px] sm:text-sm font-medium tracking-wider uppercase">Ambassade de la République du Mali à Moscou</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-4 sm:mb-6 animate-fade-in-up text-center px-2">
              Plateforme de Gestion des<br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">Ressortissants Maliens</span>
              <br className="hidden sm:block" />en Russie
            </h1>

            <p className="text-sm sm:text-lg md:text-xl text-green-100/90 mb-6 sm:mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up text-center px-2">
              L'Ambassade du Mali à Moscou vous accompagne au quotidien dans toutes vos démarches 
              administratives et consulaires sur l'ensemble du territoire de la Fédération de Russie.
            </p>

            <div className="flex flex-wrap justify-center gap-2 sm:gap-4 animate-fade-in-up px-2">
              <Button onClick={() => router.push("/inscription")} className="bg-yellow-500 hover:bg-yellow-400 text-green-900 font-bold px-4 sm:px-8 py-3 sm:py-6 text-sm sm:text-lg shadow-2xl hover:shadow-yellow-500/30 transition-all hover:scale-105">
                S'inscrire
                <ArrowRight className="ml-1.5 w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
              <Button variant="outline" onClick={() => router.push("/accueil")} className="border-2 border-white/30 text-white hover:bg-white/10 px-4 sm:px-6 py-3 sm:py-6 text-sm sm:text-lg backdrop-blur-sm">
                Services
              </Button>
              <Button variant="outline" onClick={() => router.push("/arrivee")} className="border-2 border-white/30 text-white hover:bg-white/10 px-3 sm:px-6 py-3 sm:py-6 text-sm sm:text-lg backdrop-blur-sm">
                <MapPinned className="w-3.5 h-3.5 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Signalement arrivée</span>
                <span className="sm:hidden">Arrivée</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-1.5">
            <div className="w-1.5 h-3 rounded-full bg-white/60 animate-scroll" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[
              { value: 360, suffix: "+", label: "Étudiants Boursiers", icon: GraduationCap },
              { value: 120, suffix: "+", label: "Étudiants Contractuels", icon: BookOpen },
              { value: 200, suffix: "+", label: "Résidents & Travailleurs", icon: Users },
              { value: 15, suffix: "+", label: "Villes russes couvertes", icon: MapPinned },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="text-center group">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition-colors">
                    <Icon className="w-7 h-7 text-green-700" />
                  </div>
                  <AnimatedCounter end={s.value} suffix={s.suffix} />
                  <div className="text-sm text-gray-500 mt-2 font-medium">{s.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Ambassador Message */}
      <section className="py-20 bg-gradient-to-br from-green-900 via-green-800 to-green-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-2xl">
            <Award className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">Mot de l'Ambassadeur</h2>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-white/20">
            <p className="text-lg md:text-xl text-green-50 italic leading-relaxed mb-6">
              "L'Ambassade du Mali à Moscou place le bien-être et la protection de ses ressortissants 
              au cœur de son action. Cette plateforme numérique incarne notre engagement à offrir 
              des services modernes, accessibles et efficaces à chaque Malien vivant en Fédération de Russie. 
              Nous œuvrons chaque jour pour une diplomatie de proximité au service de notre communauté."
            </p>
            <div className="w-12 h-0.5 bg-yellow-400 mx-auto mb-4" />
            <p className="text-yellow-300 font-semibold">S.E. l'Ambassadeur du Mali à Moscou</p>
            <p className="text-green-300 text-sm">République du Mali</p>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-green-900 mb-4 text-center">Nos Services</h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-center">
              L'Ambassade du Mali à Moscou propose des services adaptés à chaque situation des ressortissants maliens en Fédération de Russie.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {[...services, ...urgentServices].map((s, i) => {
              const Icon = s.icon;
              return (
                <a key={i} href={s.href} className={`group relative overflow-hidden rounded-xl sm:rounded-2xl p-4 sm:p-6 ${s.urgent ? "bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200" : "bg-white border border-gray-200"} hover:shadow-lg transition-all duration-300`}>
                  {s.urgent && <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] sm:text-xs px-1.5 py-0.5 rounded-full font-medium">Urgent</div>}
                  <div className={`w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-2 sm:mb-4 shadow-md group-hover:scale-110 transition-transform`}>
                    <Icon className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-0.5 sm:mb-1 group-hover:text-green-700 transition-colors">{s.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-500">{s.desc}</p>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #0d3b1e 0%, #14532d 50%, #0d3b1e 100%)" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-yellow-500/5 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Besoin d'aide ?</h2>
          <p className="text-green-200 mb-10 max-w-xl mx-auto">
            L'Ambassade du Mali à Moscou est à votre disposition. 
            Inscrivez-vous pour faciliter vos démarches administratives.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" onClick={() => router.push("/inscription")} className="bg-yellow-500 hover:bg-yellow-400 text-green-900 font-bold px-10 py-6 text-lg shadow-xl hover:shadow-yellow-500/30 transition-all hover:scale-105">
              S'inscrire maintenant
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => router.push("/doleances/soumettre")} className="border-2 border-white/20 text-white hover:bg-white/10 px-10 py-6 text-lg transition-all">
              Nous contacter
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-4 p-6 rounded-xl bg-gray-50">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                <Building2 className="w-5 h-5 text-green-700" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">Ambassade du Mali</h4>
                <p className="text-xs text-gray-500 mt-1">Moscou, Fédération de Russie</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 rounded-xl bg-gray-50">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-green-700" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">Contact téléphonique</h4>
                <p className="text-xs text-gray-500 mt-1">+7 XXX XXX XX XX</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 rounded-xl bg-gray-50">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-green-700" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">Contact email</h4>
                <p className="text-xs text-gray-500 mt-1">contact@etudiantsmali.ru</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-950 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-400 flex items-center justify-center text-white font-bold">
                  M
                </div>
                <div>
                  <div className="font-bold">Ambassade du Mali à Moscou</div>
                  <div className="text-sm text-green-400">République du Mali</div>
                </div>
              </div>
              <p className="text-green-300 text-sm leading-relaxed max-w-md">
                Plateforme numérique de gestion des ressortissants maliens en Fédération de Russie.
                Service de l'Ambassade de la République du Mali à Moscou.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-yellow-400 mb-4 text-sm uppercase tracking-wider">Services</h4>
              <ul className="space-y-2 text-sm text-green-300">
                <li><a href="/inscription" className="hover:text-white transition-colors">Inscription</a></li>
                <li><a href="/accueil" className="hover:text-white transition-colors">Portail services</a></li>
                <li><a href="/arrivee" className="hover:text-white transition-colors">Signaler mon arrivée</a></li>
                <li><a href="/doleances/soumettre" className="hover:text-white transition-colors">Doléances</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-yellow-400 mb-4 text-sm uppercase tracking-wider">Liens</h4>
              <ul className="space-y-2 text-sm text-green-300">
                <li><a href="/presentation" className="hover:text-white transition-colors">À propos</a></li>
                <li><a href="/services" className="hover:text-white transition-colors">Services à venir</a></li>
                <li><a href="/login" className="hover:text-white transition-colors">Espace ambassade</a></li>
              </ul>
            </div>
          </div>
          <div className="flex h-1 rounded-full overflow-hidden mb-6">
            <div className="flex-1 bg-green-600" />
            <div className="flex-1 bg-yellow-400" />
            <div className="flex-1 bg-red-600" />
          </div>
          <p className="text-center text-sm text-green-500">
            © 2026 Ambassade de la République du Mali à Moscou — Tous droits réservés
          </p>
        </div>
      </footer>

      {/* Animations CSS */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scroll {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(12px); opacity: 0; }
        }
        .animate-fade-in { animation: fadeIn 1s ease-out; }
        .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; opacity: 0; }
        .animate-scroll { animation: scroll 1.5s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
