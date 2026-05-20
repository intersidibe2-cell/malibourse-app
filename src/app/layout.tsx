import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Portail Ambassade Mali à Moscou",
  description: "Portail numérique de l'Ambassade du Mali à Moscou pour la gestion des ressortissants maliens en Fédération de Russie",
  metadataBase: new URL("https://etudiantsmali.ru"),
  openGraph: {
    title: "Portail Ambassade Mali à Moscou",
    description: "Plateforme de gestion centralisée pour les boursiers maliens en Fédération de Russie",
    url: "https://etudiantsmali.ru",
    siteName: "GestBourse Mali",
    locale: "fr_FR",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
