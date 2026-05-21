import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://etudiantsmali.ru";
  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/presentation`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/actualites`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/inscription`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/accueil`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/signalements/soumettre`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/conges/demander`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/billets/demander`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/doleances/soumettre`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/arrivee`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/login`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
  ];
}
