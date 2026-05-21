"use client";

import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="flex items-center gap-1 text-sm text-gray-500 hover:text-green-700 mb-6">
          <ArrowLeft className="w-4 h-4" /> Retour à l&apos;accueil
        </Link>

        <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center mb-6">
          <Shield className="w-7 h-7 text-green-700" />
        </div>

        <h1 className="text-3xl font-bold text-green-900 mb-8">Mentions légales</h1>

        <section className="space-y-8">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Éditeur du site</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Ambassade de la République du Mali en Fédération de Russie<br />
              11, rue Novokouznetskaïa (Новокузнецкая улица, 11с1)<br />
              District administratif central, Moscou<br />
              Tél : +7 495 951-06-55<br />
              Email : amaliru@mail.ru
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Directeur de la publication</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              S.E. l&apos;Ambassadeur de la République du Mali en Fédération de Russie
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Hébergement</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Reg.ru — 130.49.148.253<br />
              125047, Russie, Moscou, rue 1ère Tverskaïa-Iamskaïa, 8<br />
              <a href="https://reg.ru" className="text-green-700 hover:underline" target="_blank" rel="noopener noreferrer">reg.ru</a>
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Protection des données</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Les informations collectées via les formulaires d&apos;inscription et de signalement sont
              destinées à l&apos;usage exclusif de l&apos;Ambassade du Mali en Fédération de Russie.
              Elles ne sont pas transmises à des tiers. Conformément à la réglementation en vigueur,
              vous disposez d&apos;un droit d&apos;accès, de rectification et de suppression des données
              vous concernant. Pour exercer ces droits, contactez l&apos;ambassade par email.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Propriété intellectuelle</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              L&apos;ensemble du contenu de cette plateforme (textes, images, logo) est la propriété
              de l&apos;Ambassade de la République du Mali en Fédération de Russie, sauf mention contraire.
              Toute reproduction ou utilisation sans autorisation est interdite.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
