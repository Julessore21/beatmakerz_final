import { describe, expect, it } from "vitest";
import { cheapest, filterBeats, genresOf, normalizeBeat, type Beat } from "@/lib/catalog";
import { formatPrice, formatTime } from "@/lib/format";

const beat = (over: Partial<Beat>): Beat => ({
  id: "b",
  title: "Prod",
  artist: "Beatmakerz",
  bpm: 140,
  key: "Am",
  genres: ["Trap"],
  moods: [],
  coverUrl: null,
  previewUrl: null,
  previewSeconds: null,
  formats: ["mp3"],
  prices: [{ licenseTypeId: "l1", code: "Basic", priceCents: 999, currency: "EUR" }],
  createdAt: null,
  ...over,
});

describe("catalogue", () => {
  it("lit une prod de l’API sans rien inventer", () => {
    const b = normalizeBeat(
      { _id: "x1", title: " Dark Melo ", bpm: 110.4, genres: ["Trap", ""], assets: [{ type: "preview", durationSec: 45 }], prices: [{ licenseTypeId: "l1", code: "Basic", priceCents: 999, currency: "EUR" }] },
      "https://api.test",
    );
    expect(b).toMatchObject({ id: "x1", title: "Dark Melo", bpm: 110, key: null, genres: ["Trap"], artist: "Beatmakerz", previewUrl: "https://api.test/beats/x1/stream/preview", previewSeconds: 45, coverUrl: null });
    expect(normalizeBeat({ _id: "x2", title: "Sans extrait" }, "https://api.test")?.previewUrl).toBeNull();
    expect(normalizeBeat({ title: "Sans id" })).toBeNull();
  });

  it("donne le prix d’appel le plus bas, ou rien", () => {
    expect(cheapest(beat({ prices: [{ licenseTypeId: "a", code: "Premium", priceCents: 2999, currency: "EUR" }, { licenseTypeId: "b", code: "Basic", priceCents: 999, currency: "EUR" }] }))?.code).toBe("Basic");
    expect(cheapest(beat({ prices: [] }))).toBeNull();
  });

  it("filtre par genre, tempo et recherche sans accents", () => {
    const list = [beat({ id: "1", title: "Fève trap", bpm: 140, genres: ["Trap"] }), beat({ id: "2", title: "Old School", bpm: 90, genres: ["Boom Bap"] }), beat({ id: "3", title: "Sans tempo", bpm: null, genres: ["Trap"] })];
    expect(filterBeats(list, { genre: "trap" }).map((b) => b.id)).toEqual(["1", "3"]);
    expect(filterBeats(list, { bpm: "faster" }).map((b) => b.id)).toEqual(["1"]);
    expect(filterBeats(list, { query: "feve" }).map((b) => b.id)).toEqual(["1"]);
    expect(filterBeats(list, { sort: "bpm-asc" }).map((b) => b.id)).toEqual(["2", "1", "3"]);
  });

  it("range les genres du plus fréquent au moins fréquent", () => {
    expect(genresOf([beat({ genres: ["Drill"] }), beat({ genres: ["Trap", "Drill"] })])).toEqual(["Drill", "Trap"]);
  });

  it("écrit les prix et les durées à la française", () => {
    expect(formatPrice(999)).toBe("9,99 €");
    expect(formatPrice(5999, "eur")).toBe("59,99 €");
    expect(formatPrice(null)).toBeNull();
    expect(formatTime(125)).toBe("2:05");
  });
});
