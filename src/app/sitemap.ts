import type { MetadataRoute } from "next";

const site = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.NODE_ENV === "production"
    ? process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "https://beatmakerz-final.vercel.app"
    : "http://localhost:3000")
).replace(/\/$/, "");

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    "/",
    "/web/catalogue",
    "/web/abonnements",
    "/web/prodsurmesure",
    "/web/marketplace",
    "/web/cartes-cadeau",
    "/web/notrehistoire",
    "/web/profil",
    "/web/account",
    "/web/panier",
    "/web/contact",
    "/web/faq",
    "/web/cgv",
    "/web/cgu",
    "/web/mentions",
    "/web/politique",
    "/web/retractation",
    "/web/tarification",
    "/web/programmefidelite",
    "/web/vendeur",
  ];
  const now = new Date();
  return pages.map((path) => ({
    url: `${site}${path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
