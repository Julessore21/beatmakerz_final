import { API_URL } from "@/lib/apiUrl";

/** Ce qu'une licence coûte pour une prod (prix déjà calculé par l'API, celui du panier). */
export interface BeatPrice {
  licenseTypeId: string;
  code: string;
  priceCents: number;
  currency: string;
}

export interface Beat {
  id: string;
  title: string;
  artist: string;
  bpm: number | null;
  key: string | null;
  genres: string[];
  moods: string[];
  coverUrl: string | null;
  /** Adresse de l'extrait (l'API redirige vers une adresse signée). */
  previewUrl: string | null;
  previewSeconds: number | null;
  formats: string[];
  prices: BeatPrice[];
  createdAt: string | null;
}

export interface License {
  id: string;
  code: string;
  priceCents: number;
  currency: string;
  files: string[];
  terms: { summary?: string; exclusive?: boolean; commercialUse?: boolean; resale?: boolean } & Record<string, unknown>;
}

type ApiBeat = {
  _id?: string;
  id?: string;
  title?: string;
  bpm?: number;
  key?: string;
  genres?: string[];
  moods?: string[];
  coverUrl?: string;
  artist?: { name?: string } | null;
  assets?: { type?: string; durationSec?: number }[];
  formats?: string[];
  prices?: BeatPrice[];
  priceCents?: number | null;
  createdAt?: string;
};

const clean = (list: unknown): string[] =>
  Array.isArray(list) ? list.filter((x): x is string => typeof x === "string" && x.trim() !== "").map((x) => x.trim()) : [];

/** Une prod telle que l'API la renvoie → ce que le site affiche. Rien d'inventé : une donnée absente reste nulle. */
export function normalizeBeat(raw: ApiBeat, apiUrl = API_URL): Beat | null {
  const id = String(raw._id ?? raw.id ?? "");
  if (!id || !raw.title) return null;
  const preview = raw.assets?.find((a) => a.type === "preview");
  return {
    id,
    title: raw.title.trim(),
    artist: raw.artist?.name?.trim() || "Beatmakerz",
    bpm: typeof raw.bpm === "number" && raw.bpm > 0 ? Math.round(raw.bpm) : null,
    key: raw.key?.trim() || null,
    genres: clean(raw.genres),
    moods: clean(raw.moods),
    coverUrl: raw.coverUrl || null,
    previewUrl: preview ? `${apiUrl}/beats/${id}/stream/preview` : null,
    previewSeconds: preview?.durationSec ?? null,
    formats: clean(raw.formats),
    prices: Array.isArray(raw.prices) ? raw.prices.filter((p) => p && p.licenseTypeId && Number.isFinite(p.priceCents)) : [],
    createdAt: raw.createdAt ?? null,
  };
}

/** Le prix d'appel d'une prod : la licence la moins chère qu'on peut lui acheter. */
export function cheapest(beat: Pick<Beat, "prices">): BeatPrice | null {
  return beat.prices.reduce<BeatPrice | null>((min, p) => (!min || p.priceCents < min.priceCents ? p : min), null);
}

export const FORMAT_LABEL: Record<string, string> = { mp3: "MP3", wav: "WAV", stems: "Pistes séparées" };

async function getJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, { ...init, headers: { Accept: "application/json", ...(init?.headers ?? {}) } });
  if (!res.ok) throw new Error(`${path} : ${res.status}`);
  return res.json() as Promise<T>;
}

export async function fetchBeats(params: { limit?: number; cursor?: string; genre?: string; query?: string } = {}): Promise<{ items: Beat[]; cursor: string | null }> {
  const q = new URLSearchParams();
  if (params.limit) q.set("limit", String(params.limit));
  if (params.cursor) q.set("cursor", params.cursor);
  if (params.genre) q.set("genre", params.genre);
  if (params.query) q.set("query", params.query);
  const data = await getJson<{ items?: ApiBeat[]; cursor?: string | null }>(`/beats?${q.toString()}`);
  return { items: (data.items ?? []).map((b) => normalizeBeat(b)).filter((b): b is Beat => b !== null), cursor: data.cursor ?? null };
}

/** Tout le catalogue publié, page après page (50 par page, 40 pages au plus). */
export async function fetchAllBeats(): Promise<Beat[]> {
  const all: Beat[] = [];
  let cursor: string | undefined;
  for (let page = 0; page < 40; page++) {
    const res = await fetchBeats({ limit: 50, cursor });
    for (const b of res.items) if (!all.some((x) => x.id === b.id)) all.push(b);
    if (!res.cursor) break;
    cursor = res.cursor;
  }
  return all;
}

export async function fetchBeat(id: string, init?: RequestInit): Promise<Beat | null> {
  const res = await fetch(`${API_URL}/beats/${encodeURIComponent(id)}`, { ...init, headers: { Accept: "application/json" } });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`/beats/${id} : ${res.status}`);
  return normalizeBeat((await res.json()) as ApiBeat);
}

export const fetchLicenses = () => getJson<License[]>("/licenses");

export const fetchCustomProdPrice = () => getJson<{ priceCents: number | null; currency: string }>("/checkout/custom-prod");

/** Les genres présents dans le catalogue, les plus fréquents d'abord. */
export function genresOf(beats: Beat[]): string[] {
  const count = new Map<string, number>();
  for (const b of beats) for (const g of b.genres) count.set(g, (count.get(g) ?? 0) + 1);
  return [...count.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([g]) => g);
}

export type BpmRange = "all" | "slow" | "mid" | "fast" | "faster";
export const BPM_RANGES: { id: BpmRange; label: string; test: (bpm: number) => boolean }[] = [
  { id: "all", label: "Tous", test: () => true },
  { id: "slow", label: "< 90", test: (b) => b < 90 },
  { id: "mid", label: "90–120", test: (b) => b >= 90 && b < 120 },
  { id: "fast", label: "120–140", test: (b) => b >= 120 && b < 140 },
  { id: "faster", label: "140 +", test: (b) => b >= 140 },
];

export type Sort = "recent" | "bpm-asc" | "bpm-desc" | "price-asc";

/** Filtre et tri du catalogue, côté navigateur. */
export function filterBeats(beats: Beat[], f: { query?: string; genre?: string | null; bpm?: BpmRange; sort?: Sort }): Beat[] {
  const words = (f.query ?? "").toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").split(/\s+/).filter(Boolean);
  const range = BPM_RANGES.find((r) => r.id === (f.bpm ?? "all"));
  const out = beats.filter((b) => {
    if (f.genre && !b.genres.some((g) => g.toLowerCase() === f.genre?.toLowerCase())) return false;
    if (range && range.id !== "all" && (b.bpm == null || !range.test(b.bpm))) return false;
    if (words.length) {
      const hay = [b.title, b.artist, b.key ?? "", ...b.genres, ...b.moods, b.bpm ? `${b.bpm}bpm ${b.bpm}` : ""]
        .join(" ")
        .toLowerCase()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "");
      if (!words.every((w) => hay.includes(w))) return false;
    }
    return true;
  });
  const sort = f.sort ?? "recent";
  if (sort === "recent") return out;
  const byBpm = (b: Beat) => b.bpm ?? (sort === "bpm-asc" ? Infinity : -Infinity);
  return [...out].sort((a, b) =>
    sort === "bpm-asc" ? byBpm(a) - byBpm(b) : sort === "bpm-desc" ? byBpm(b) - byBpm(a) : (cheapest(a)?.priceCents ?? Infinity) - (cheapest(b)?.priceCents ?? Infinity),
  );
}
