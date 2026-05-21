import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import "./globals.css";

export const metadata: Metadata = {
  title: "Portail Ambassade du Mali en Fédération de Russie",
  description: "Portail numérique de gestion des étudiants et ressortissants maliens en Fédération de Russie",
  metadataBase: new URL("https://etudiantsmali.ru"),
  openGraph: {
    title: "Portail Ambassade du Mali en Fédération de Russie",
    description: "Plateforme de gestion des étudiants et ressortissants maliens en Fédération de Russie",
    url: "https://etudiantsmali.ru",
    locale: "fr_FR",
    type: "website",
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} className="h-full antialiased">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/images/icon-192.png" />
        <meta name="apple-mobile-web-app-title" content="Ambassade Mali" />
        <script dangerouslySetInnerHTML={{
          __html: `
            if ("serviceWorker" in navigator) {
              navigator.serviceWorker.register("/sw.js").then((reg) => {
                reg.addEventListener("updatefound", () => {
                  const newSW = reg.installing;
                  newSW.addEventListener("statechange", () => {
                    if (newSW.state === "installed" && navigator.serviceWorker.controller) {
                      const banner = document.createElement("div");
                      banner.id = "pwa-update";
                      banner.style.cssText = "position:fixed;bottom:0;left:0;right:0;z-index:9999;background:#166534;color:#fff;padding:12px 16px;display:flex;align-items:center;justify-content:space-between;font-size:14px;font-family:sans-serif;box-shadow:0 -2px 10px rgba(0,0,0,.2)";
                      banner.innerHTML = '<span>Mise à jour disponible</span><button onclick="location.reload()" style="background:#fbbf24;color:#166534;border:none;border-radius:6px;padding:8px 16px;font-weight:bold;cursor:pointer;margin-left:12px">Actualiser</button>';
                      document.body.appendChild(banner);
                    }
                  });
                });
              }).catch(() => {});
            }
          `,
        }} />
      </head>
      <body className="min-h-full font-sans" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" }}>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
