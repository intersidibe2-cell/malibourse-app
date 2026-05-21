"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 p-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
          <span className="text-4xl font-bold text-green-700">?</span>
        </div>
        <h1 className="text-6xl font-bold text-green-900 mb-2">404</h1>
        <p className="text-xl text-gray-600 mb-2">Page introuvable</p>
        <p className="text-sm text-gray-500 mb-8">
          La page que vous cherchez n&apos;existe pas ou a été déplacée.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 rounded-xl bg-green-700 text-white font-medium hover:bg-green-800 transition-colors"
          >
            Retour à l&apos;accueil
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Page précédente
          </button>
        </div>
      </div>
    </div>
  );
}
