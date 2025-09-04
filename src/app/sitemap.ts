import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const site = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
  const pages = [
    "/",
    "/web/catalogue",
    "/web/abonnements",
    "/web/prodsurmesure",
    "/web/marketplace",
    "/web/profil",
    "/web/account",
    "/web/panier",
    "/web/contact",
    "/web/cgv",
    "/web/cgu",
    "/web/mentions",
    "/web/politique",
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

