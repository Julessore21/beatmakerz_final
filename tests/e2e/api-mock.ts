import type { Page } from "@playwright/test";

/** L'API simulée dans le navigateur : les tests ne dépendent ni du serveur, ni de la base, ni de Stripe. */
export const BEATS = [
  { _id: "b1", title: "Dark Melo", bpm: 110, key: "Am", genres: ["Trap"], moods: ["Sombre"], createdAt: "2026-11-20T00:00:00Z", artist: { name: "Beatmakerz" }, assets: [{ type: "preview", durationSec: 45 }], formats: ["mp3", "wav"], prices: [{ licenseTypeId: "lic", code: "Basic", priceCents: 999, currency: "EUR" }] },
  { _id: "b2", title: "Church Drill", bpm: 85, key: "Gm", genres: ["Drill"], moods: [], createdAt: "2026-11-19T00:00:00Z", artist: { name: "Beatmakerz" }, assets: [{ type: "preview", durationSec: 45 }], formats: ["mp3"], prices: [{ licenseTypeId: "lic", code: "Basic", priceCents: 999, currency: "EUR" }] },
  { _id: "b3", title: "Old Love", bpm: 120, key: "C#m", genres: ["Trap"], moods: [], createdAt: "2026-11-18T00:00:00Z", artist: { name: "Beatmakerz" }, assets: [], formats: ["mp3"], prices: [{ licenseTypeId: "lic", code: "Basic", priceCents: 999, currency: "EUR" }] },
];

export async function mockApi(page: Page) {
  await page.route(/\/beats\?/, (r) => r.fulfill({ json: { items: BEATS, cursor: null } }));
  await page.route(/\/beats\/[^/?]+$/, (r) => {
    const id = new URL(r.request().url()).pathname.split("/").pop();
    const beat = BEATS.find((b) => b._id === id);
    return beat ? r.fulfill({ json: beat }) : r.fulfill({ status: 404, json: { message: "Beat not found" } });
  });
  await page.route(/\/licenses$/, (r) => r.fulfill({ json: [{ id: "lic", code: "Basic", priceCents: 999, currency: "EUR", files: ["mp3", "wav"], terms: {} }] }));
  await page.route(/\/checkout\/custom-prod$/, (r) => (r.request().method() === "GET" ? r.fulfill({ json: { priceCents: 5999, currency: "EUR" } }) : r.fallback()));
  await page.route(/\/auth\/refresh$/, (r) => r.fulfill({ status: 401, json: { message: "Unauthorized" } }));
}
