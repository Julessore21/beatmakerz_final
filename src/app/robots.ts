import type { MetadataRoute } from "next";

const site = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.NODE_ENV === "production" ? "https://beatmakerz.fr" : "http://localhost:3000")
).replace(/\/$/, "");

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin", "/web/account", "/web/panier", "/web/profil", "/web/checkout"],
    },
    sitemap: [`${site}/sitemap.xml`],
    host: site,
  };
}
