"use client";

import { useState, useEffect } from "react";
import { MessageSquare, ChevronDown, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

interface FaqItem {
  id: string;
  question: string;
  reponse: string;
  categorie: string;
}

export default function FaqPage() {
  const [items, setItems] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/faq/public")
      .then((res) => { if (!res.ok) throw new Error("Erreur"); return res.json(); })
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const grouped = items.reduce<Record<string, FaqItem[]>>((acc, item) => {
    const cat = item.categorie || "Général";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="flex items-center gap-1 text-sm text-gray-500 hover:text-green-700 mb-6">
          <ArrowLeft className="w-4 h-4" /> Retour
        </Link>

        <div className="bg-white rounded-2xl shadow-lg border p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-md">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">FAQ</h1>
              <p className="text-xs text-gray-500">Questions fréquemment posées</p>
            </div>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-green-600" />
            </div>
          )}

          {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}

          {!loading && !error && items.length === 0 && (
            <div className="text-center py-12">
              <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Aucune question disponible pour le moment</p>
            </div>
          )}

          {!loading && Object.keys(grouped).length > 0 && (
            <div className="space-y-6">
              {Object.entries(grouped).map(([categorie, faqs]) => (
                <div key={categorie}>
                  <h2 className="text-sm font-semibold text-green-700 uppercase tracking-wide mb-3">{categorie}</h2>
                  <div className="space-y-2">
                    {faqs.map((faq) => (
                      <div key={faq.id} className="border border-gray-200 rounded-xl overflow-hidden">
                        <button
                          type="button"
                          onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                          className="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors"
                        >
                          <span>{faq.question}</span>
                          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${openId === faq.id ? "rotate-180" : ""}`} />
                        </button>
                        {openId === faq.id && (
                          <div className="px-4 pb-3 text-sm text-gray-600 border-t border-gray-100 pt-2">
                            {faq.reponse}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
