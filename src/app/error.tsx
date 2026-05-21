"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
          <span className="text-4xl font-bold text-red-600">!</span>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Une erreur est survenue</h1>
        <p className="text-sm text-gray-500 mb-8">
          Nous sommes désolés. Veuillez réessayer ou revenir à l&apos;accueil.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center px-6 py-3 rounded-xl bg-green-700 text-white font-medium hover:bg-green-800 transition-colors"
          >
            Réessayer
          </button>
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
