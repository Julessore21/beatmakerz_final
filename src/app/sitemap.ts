import type { MetadataRoute } from "next";

const site = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.NODE_ENV === "production" ? "https://beatmakerz.fr" : "http://localhost:3000")
).replace(/\/$/, "");

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    "/",
    "/web/catalogue",
    "/web/prodsurmesure",
    "/web/contact",
    "/web/faq",
    "/web/cgv",
    "/web/cgu",
    "/web/mentions",
    "/web/politique",
    "/web/retractation",
  ];
  const now = new Date();
  return pages.map((path) => ({
    url: `${site}${path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
