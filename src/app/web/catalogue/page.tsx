"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Grid3X3, Rows3, SlidersHorizontal, Star, Crown, Flame, ChevronDown } from "lucide-react";

import { Input } from "@/components/ui/input";
import { useAudio } from "@/context/AudioPlayerContext";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import BeatCard from "@/components/BeatCard";
import AuthRequiredModal from "@/components/AuthRequiredModal";
import BeatTableRow from "@/components/BeatTableRow";
import { fetchFileUpCatalogue } from "@/lib/services/fileup-catalogue";
import { fetchFavorites, toggleFavorite as toggleFavoriteApi } from "@/lib/services/user-api";

/* ------------------------------ types & data ------------------------------ */

type Tag = "Tendance" | "Nouveau" | "Populaire";
type ViewMode = "grid" | "table";

export type Beat = {
  id: number | string;
  name: string;
  artist: string;
  genre: string;
  bpm: number;
  key: string;
  tag: Tag | null;
  audio: string;
  price: number;
};

// Utilise le même fichier test que la marketplace pour assurer la lecture sur les deux pages
const TEST_AUDIO = "/audio/Woke up late, still rich from yesterday  (Remix) (Instrumental) (1).mp3";

const GENRES = [
  "Trap",
  "Drill",
  "Boom Bap",
  "R&B",
  "Lofi",
  "Soul",
  "West Coast",
  "East Coast",
  "New Wave",
  "New Jazz",
  "Afro",
  "Afro Trap",
  "Pop Urbain",
  "Detroit",
  "Jersey Club",
  "Cloud Rap",
  "Trap Soul",
  "Dancehall",
] as const;
const KEYS = [
  "Fm",
  "Cm",
  "Gm",
  "Am",
  "Dm",
  "Em",
  "Bm",
  "Bb",
  "Eb",
  "Abm",
  "C#m",
  "F#m",
  "G#m",
  "D#m",
  "Ebm",
  "Bbm",
  "A#m",
  "Dbm",
] as const;
const QUICK_TAGS: Tag[] = ["Tendance", "Nouveau", "Populaire"];
const SORTS = ["Prix ↑", "Prix ↓", "BPM ↑", "BPM ↓"] as const;

const COLLECTIONS: {
  key: string;
  label: string;
  icon: React.ReactNode;
  action: (ctx: { setTag: (t: Tag | null) => void }) => void;
}[] = [
  {
    key: "top",
    label: "Top",
    icon: <Crown className="h-4 w-4 text-amber-300" />,
    action: ({ setTag }) => setTag("Populaire"),
  },
  {
    key: "nouveaux",
    label: "Nouveaux",
    icon: <Star className="h-4 w-4 text-yellow-300" />,
    action: ({ setTag }) => setTag("Nouveau"),
  },
  // trending supprimé selon demande
];

// plages de BPM
const BPM_MIN = 60;
const BPM_MAX = 200;

const generateRandomBeats = (count: number): Beat[] => {
  const artists = ["Metro Boomin", "Kendrick Lamar", "Drake", "J. Cole", "Nas", "Travis Scott", "The Weeknd"];
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Beat ${i + 1}`,
    artist: `${artists[Math.floor(Math.random() * artists.length)]} Type Beat`,
    genre: GENRES[Math.floor(Math.random() * GENRES.length)],
    bpm: 80 + Math.floor(Math.random() * 80),
    key: KEYS[Math.floor(Math.random() * KEYS.length)],
    tag: QUICK_TAGS[Math.floor(Math.random() * QUICK_TAGS.length)] ?? null,
    audio: TEST_AUDIO,
    price: Math.random() > 0.5 ? 9.99 : 19.99,
  }));
};

/* -------------------------------- helpers -------------------------------- */

const Chip = ({ active, onClick, children }: { active?: boolean; onClick?: () => void; children: React.ReactNode }) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[12px] transition-colors
      ${
        active ? "border-indigo-500/70 bg-indigo-500 text-white" : "border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10"
      }`}
  >
    {children}
  </button>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-2 text-xs font-medium uppercase tracking-wider text-zinc-400">{children}</div>
);

/* ---------------------------------- page --------------------------------- */

function CatalogueContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { play, toggle, isPlaying, track, setQueue } = useAudio();
  const { addItem } = useCart();
  const { user } = useAuth();

  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");

  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const [bpmMin, setBpmMin] = useState<number>(BPM_MIN);
  const [bpmMax, setBpmMax] = useState<number>(BPM_MAX);
  const [sort, setSort] = useState<(typeof SORTS)[number]>("Prix ↑");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [showAuthModal, setShowAuthModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  const [beats, setBeats] = useState<Beat[]>([]);
  const [favIds, setFavIds] = useState<string[]>([]);
  useEffect(() => {
    const load = async () => {
      try {
        const items = await fetchFileUpCatalogue();
        const mapped =
          items.map((b, idx) => ({
            id: b.id ?? `beat-${idx}`,
            name: b.title || b.name || "Beat",
            artist: typeof b.artist === "string" ? b.artist : b.artist?.name || "Beatmaker",
            genre: b.genres?.[0] || b.genre || "Beat",
            bpm: b.bpm ?? 120,
            key: b.key || "Am",
            tag: null as Tag | null,
            audio:
              b.previewUrl ||
              b.audioUrl ||
              b.assets?.find((a) => a.type === "preview")?.url ||
              b.assets?.find((a) => a.type === "preview")?.storageKey ||
              TEST_AUDIO,
            price: typeof b.price === "number" ? b.price : (b.priceCents ?? 1999) / 100,
          })) || [];
        setBeats(mapped);
      } catch {
        setBeats(generateRandomBeats(96));
      }
    };
    load();
  }, []);

  // hydrate favoris si connecté
  useEffect(() => {
    if (!user) {
      setFavIds([]);
      return;
    }
    fetchFavorites()
      .then((items) => setFavIds(items.map((f) => f.beatId)))
      .catch(() => setFavIds([]));
  }, [user]);

  /* debounce query */
  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 300);
    return () => clearTimeout(t);
  }, [query]);

  /* init from URL once */
  useEffect(() => {
    if (!searchParams) return;
    const q = searchParams.get("q") ?? "";
    const g = searchParams.get("genres")?.split(",").filter(Boolean) ?? [];
    const k = searchParams.get("keys")?.split(",").filter(Boolean) ?? [];
    const bpmMinUrl = parseInt(searchParams.get("bpmMin") || "", 10);
    const bpmMaxUrl = parseInt(searchParams.get("bpmMax") || "", 10);
    const tag = (searchParams.get("tag") as Tag) || null;
    const s = (searchParams.get("sort") as (typeof SORTS)[number]) || "Pertinence";
    const v = (searchParams.get("view") as ViewMode) || "grid";

    setQuery(q);
    setDebounced(q);
    setSelectedGenres(g);
    setSelectedKeys(k);
    let initialMin = BPM_MIN;
    let initialMax = BPM_MAX;
    if (!Number.isNaN(bpmMinUrl)) {
      initialMin = Math.max(BPM_MIN, Math.min(BPM_MAX, bpmMinUrl));
    }
    if (!Number.isNaN(bpmMaxUrl)) {
      initialMax = Math.max(BPM_MIN, Math.min(BPM_MAX, bpmMaxUrl));
    }

    if (initialMin >= initialMax) {
      if (!Number.isNaN(bpmMaxUrl)) {
        initialMax = Math.min(BPM_MAX, initialMin + 1);
      } else if (!Number.isNaN(bpmMinUrl)) {
        initialMin = Math.max(BPM_MIN, initialMax - 1);
      } else {
        initialMax = Math.max(initialMin + 1, initialMax);
      }
    }

    setBpmMin(initialMin);
    setBpmInput(String(initialMin));

    setBpmMax(initialMax);
    setBpmMaxInput(String(initialMax));
    setSelectedTag(tag);
    setSort(s);
    setViewMode(v);
  }, [searchParams]); // mount only

  /* sync URL */
  const lastQSRef = useRef("");
  useEffect(() => {
    const p = new URLSearchParams();
    if (debounced) p.set("q", debounced);
    if (selectedGenres.length) p.set("genres", selectedGenres.join(","));
    if (selectedKeys.length) p.set("keys", selectedKeys.join(","));
    if (bpmMin !== BPM_MIN) p.set("bpmMin", String(bpmMin));
    if (bpmMax !== BPM_MAX) p.set("bpmMax", String(bpmMax));
    if (selectedTag) p.set("tag", selectedTag);
    p.set("sort", sort);
    p.set("view", viewMode);
    const qs = p.toString();
    if (qs !== lastQSRef.current) {
      lastQSRef.current = qs;
      router.replace(qs ? `?${qs}` : "?", { scroll: false });
    }
  }, [debounced, selectedGenres, selectedKeys, bpmMin, bpmMax, selectedTag, sort, viewMode, router]);

  /* reset page on filter change */
  useEffect(() => setCurrentPage(1), [debounced, selectedGenres, selectedKeys, bpmMin, bpmMax, selectedTag, sort, viewMode]);

  // remonter en haut quand la page change (peu importe la direction)
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentPage]);

  /* filtering */
  const filtered = useMemo(() => {
    return beats.filter((b) => {
      const mQ =
        !debounced ||
        b.name.toLowerCase().includes(debounced.toLowerCase()) ||
        b.artist.toLowerCase().includes(debounced.toLowerCase()) ||
        b.genre.toLowerCase().includes(debounced.toLowerCase());
      const mG = selectedGenres.length ? selectedGenres.includes(b.genre) : true;
      const mK = selectedKeys.length ? selectedKeys.includes(b.key) : true;
      const mT = selectedTag ? b.tag === selectedTag : true;
      const mB = b.bpm >= bpmMin && b.bpm <= bpmMax;
      return mQ && mG && mK && mT && mB;
    });
  }, [beats, debounced, selectedGenres, selectedKeys, selectedTag, bpmMin, bpmMax]);

  /* sort */
  const sorted = useMemo(() => {
    switch (sort) {
      case "Prix ↑":
        return [...filtered].sort((a, b) => a.price - b.price);
      case "Prix ↓":
        return [...filtered].sort((a, b) => b.price - a.price);
      case "BPM ↑":
        return [...filtered].sort((a, b) => a.bpm - b.bpm);
      case "BPM ↓":
        return [...filtered].sort((a, b) => b.bpm - a.bpm);
      default:
        return filtered;
    }
  }, [filtered, sort]);

  /* pagination */
  const lastIndex = currentPage * pageSize;
  const currentBeats = sorted.slice(lastIndex - pageSize, lastIndex);
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));

  /* queue -> global player */
  const lastQueueKey = useRef("");
  useEffect(() => {
    const key = currentBeats.map((b) => b.id).join("-");
    if (key !== lastQueueKey.current) {
      lastQueueKey.current = key;
      setQueue(currentBeats);
    }
  }, [currentBeats, setQueue]);

  const toggleInArray = (val: string, arr: string[], set: (v: string[]) => void) =>
    set(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);

  const handleBpmMinChange = useCallback(
    (value: number) => {
      const maxBound = Math.max(bpmMax - 1, BPM_MIN);
      const clamped = Math.min(Math.max(value, BPM_MIN), maxBound);
      setBpmMin(clamped);
    },
    [bpmMax]
  );

  const handleBpmMaxChange = useCallback(
    (value: number) => {
      const minBound = Math.min(bpmMin + 1, BPM_MAX);
      const clamped = Math.max(Math.min(value, BPM_MAX), minBound);
      setBpmMax(clamped);
    },
    [bpmMin]
  );

  const onPlay = (b: Beat) => (track?.id === b.id && isPlaying ? toggle() : play(b, currentBeats));
  const onToggleFav = async (beatId: string) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    await toggleFavoriteApi(beatId);
    setFavIds((prev) => (prev.includes(beatId) ? prev.filter((id) => id !== beatId) : [...prev, beatId]));
  };

  const RangeSlider = ({
    min,
    max,
    valueMin,
    valueMax,
    onChangeMin,
    onChangeMax,
  }: {
    min: number;
    max: number;
    valueMin: number;
    valueMax: number;
    onChangeMin: (value: number) => void;
    onChangeMax: (value: number) => void;
  }) => {
    const sliderRef = useRef<HTMLDivElement>(null);
    const [activeHandle, setActiveHandle] = useState<"min" | "max" | null>(null);

    const getValueFromPointer = useCallback(
      (clientX: number) => {
        const rect = sliderRef.current?.getBoundingClientRect();
        if (!rect) return null;
        const ratio = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
        return Math.round(min + ratio * (max - min));
      },
      [min, max]
    );

    const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
      event.preventDefault();
      const value = getValueFromPointer(event.clientX);
      if (value === null) return;
      const distanceToMin = Math.abs(value - valueMin);
      const distanceToMax = Math.abs(value - valueMax);
      const handle = distanceToMin <= distanceToMax ? "min" : "max";
      setActiveHandle(handle);
      (handle === "min" ? onChangeMin : onChangeMax)(value);
    };

    const handleWindowPointerMove = useCallback(
      (event: PointerEvent) => {
        if (!activeHandle) return;
        const value = getValueFromPointer(event.clientX);
        if (value === null) return;
        (activeHandle === "min" ? onChangeMin : onChangeMax)(value);
      },
      [activeHandle, getValueFromPointer, onChangeMax, onChangeMin]
    );

    useEffect(() => {
      if (!activeHandle) return;
      const handlePointerUp = () => {
        setActiveHandle(null);
      };
      window.addEventListener("pointermove", handleWindowPointerMove);
      window.addEventListener("pointerup", handlePointerUp);
      window.addEventListener("pointercancel", handlePointerUp);
      return () => {
        window.removeEventListener("pointermove", handleWindowPointerMove);
        window.removeEventListener("pointerup", handlePointerUp);
        window.removeEventListener("pointercancel", handlePointerUp);
      };
    }, [activeHandle, handleWindowPointerMove]);

    const totalRange = max - min;
    const minPercent = totalRange > 0 ? ((valueMin - min) / totalRange) * 100 : 0;
    const maxPercent = totalRange > 0 ? ((valueMax - min) / totalRange) * 100 : 100;

    return (
      <div className="space-y-2">
        <div
          ref={sliderRef}
          className="relative h-3 cursor-pointer rounded-full bg-white/10"
          onPointerDown={handlePointerDown}
        >
          <div
            className="absolute inset-y-0 rounded-full bg-gradient-to-r from-[#7c5cff] to-[#c43eff]"
            style={{
              left: `${Math.min(minPercent, maxPercent)}%`,
              right: `${100 - Math.max(minPercent, maxPercent)}%`,
            }}
          />
          <div
            className={`absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border border-white/40 bg-white/90 shadow-lg transition ${
              activeHandle === "min" ? "scale-110" : ""
            }`}
            style={{ left: `${minPercent}%`, transform: `translate(-50%, -50%)` }}
          />
          <div
            className={`absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border border-white/40 bg-white/90 shadow-lg transition ${
              activeHandle === "max" ? "scale-110" : ""
            }`}
            style={{ left: `${maxPercent}%`, transform: `translate(-50%, -50%)` }}
          />
        </div>
        <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.3em] text-zinc-400">
          <span>Min {valueMin} BPM</span>
          <span>Max {valueMax} BPM</span>
        </div>
      </div>
    );
  };

  const FiltersBlocks = () => (
    <>
    <div className="rounded-2xl border border-white/10 bg-[#141416]/80 p-4 backdrop-blur-xl space-y-4">
        <div className="flex items-center justify-between">
          <SectionTitle>Genres</SectionTitle>
          {selectedGenres.length > 0 && (
            <button className="text-xs text-zinc-400 hover:text-zinc-200" onClick={() => setSelectedGenres([])}>
              Effacer
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {GENRES.map((g) => (
            <button
              key={g}
              onClick={() => toggleInArray(g, selectedGenres, setSelectedGenres)}
              className={`h-8 rounded-xl border px-2 text-[11px] text-left ${
                selectedGenres.includes(g) ? "border-indigo-500 bg-indigo-500 text-white" : "border-white/10 bg-white/5 hover:bg-white/10 text-zinc-100"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#141416]/80 p-4 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <SectionTitle>Tonalites</SectionTitle>
          {selectedKeys.length > 0 && (
            <button className="text-xs text-zinc-400 hover:text-zinc-200" onClick={() => setSelectedKeys([])}>
              Effacer
            </button>
          )}
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
          {KEYS.map((k) => (
            <Chip key={k} active={selectedKeys.includes(k)} onClick={() => toggleInArray(k, selectedKeys, setSelectedKeys)}>
              {k}
            </Chip>
          ))}
        </div>
      <RangeSlider
        min={BPM_MIN}
        max={BPM_MAX}
        valueMin={bpmMin}
        valueMax={bpmMax}
        onChangeMin={handleBpmMinChange}
        onChangeMax={handleBpmMaxChange}
      />
    </>
  );

  /* --------------------------------- render -------------------------------- */

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0A0A12] text-white pt-24 pb-40">
      {/* Ambient animated background (aligné avec account/abonnements) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-0 overflow-hidden">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={{ duration: 1.2 }} className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-violet-600/30 blur-3xl" />
        <motion.div
          animate={{ x: [0, 20, -10, 0], y: [0, -10, 10, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute right-[-10rem] top-10 h-[28rem] w-[28rem] rounded-full bg-violet-700/30 blur-[100px]"
        />
        <motion.div
          animate={{ x: [0, -10, 15, 0], y: [0, 12, -8, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-12rem] left-20 h-[26rem] w-[26rem] rounded-full bg-violet-900/25 blur-[100px]"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.06),transparent_60%),radial-gradient(ellipse_at_bottom,rgba(255,255,255,0.04),transparent_60%)]" />
      </div>
      {/* header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto max-w-screen-2xl px-4 xs:px-5 sm:px-6 lg:px-8"
      >
        <div className="rounded-3xl border border-white/10 bg-[#141416]/90 p-6 backdrop-blur-xl shadow-[0_10px_60px_rgba(0,0,0,.35)]">
          <div className="text-2xl font-bold tracking-tight">Catalogue</div>
          <div className="mt-1 text-sm text-zinc-300">{sorted.length} résultats • {GENRES.length} genres • vue {viewMode}</div>
        </div>

        {/* tools sticky */}
        <div className="mt-6 sticky top-20 z-40 rounded-2xl border border-white/10 bg-[#141416]/80 p-4 backdrop-blur-xl">
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 text-sm text-zinc-400">
              <SlidersHorizontal className="h-4 w-4" />
              Filtres rapides
            </div>
            {/* Badges icônes: Tendance, Nouveaux, Populaire */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedTag(selectedTag === "Tendance" ? null : "Tendance")}
                className={`inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm ${selectedTag === "Tendance" ? "border-orange-400 bg-orange-400/10" : "border-white/10 bg-white/5 hover:bg-white/10"}`}
              >
                <Flame className="h-4 w-4 text-orange-400" /> Top
              </button>
              <button
                onClick={() => setSelectedTag(selectedTag === "Nouveau" ? null : "Nouveau")}
                className={`inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm ${selectedTag === "Nouveau" ? "border-yellow-300 bg-yellow-300/10" : "border-white/10 bg-white/5 hover:bg-white/10"}`}
              >
                <Star className="h-4 w-4 text-yellow-300" /> Nouveaux
              </button>
              <button
                onClick={() => setSelectedTag(selectedTag === "Populaire" ? null : "Populaire")}
                className={`inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm ${selectedTag === "Populaire" ? "border-amber-400 bg-amber-400/10" : "border-white/10 bg-white/5 hover:bg-white/10"}`}
              >
                <Crown className="h-4 w-4 text-amber-300" /> Populaire
              </button>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm ${viewMode === "grid" ? "border-indigo-500 text-white bg-indigo-500" : "border-white/10 bg-white/5 hover:bg-white/10"}`}
              >
                <Grid3X3 className="h-4 w-4" /> Grille
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm ${viewMode === "table" ? "border-indigo-500 text-white bg-indigo-500" : "border-white/10 bg-white/5 hover:bg-white/10"}`}
              >
                <Rows3 className="h-4 w-4" /> Tableau
              </button>

              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as (typeof SORTS)[number])}
                  className="appearance-none rounded-full border border-white/10 bg-[#0e0e12]/80 px-6 pr-8 py-2 h-9 text-sm outline-none text-center leading-none"
                >
                  {SORTS.map((s) => (
                    <option key={s} value={s} className="text-center">
                      {s}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              </div>
            </div>
          </div>

          {/* search */}
          <div className="relative mt-4">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tape un artiste, un genre…"
              className="w-full rounded-2xl border border-white/10 bg-[#0e0e12]/80 pl-11 py-3"
            />
          </div>
        </div>
      </motion.div>

      {/* content */}
      <div className="container mx-auto mt-8 max-w-screen-2xl px-4 xs:px-5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <section className="lg:col-span-12 lg:hidden">
            <div className="space-y-3">
              <details className="group rounded-2xl border border-white/10 bg-[#141416]/80 backdrop-blur-xl">
                <summary className="flex cursor-pointer items-center justify-between px-4 py-3 text-sm text-zinc-200">
                  <span>Filtres</span>
                  <ChevronDown className="h-4 w-4 text-zinc-400 transition-transform group-open:rotate-180" />
                </summary>
                <div className="px-4 pb-4 space-y-3">
                  <FiltersBlocks />
                  {selectedGenres.length || selectedKeys.length || bpmMin !== BPM_MIN || bpmMax !== BPM_MAX || selectedTag ? (
                    <button
                      onClick={() => {
                        setSelectedGenres([]);
                        setSelectedKeys([]);
                        setBpmMin(BPM_MIN);
                        setBpmMax(BPM_MAX);
                        setBpmInput(String(BPM_MIN));
                        setBpmMaxInput(String(BPM_MAX));
                        setSelectedTag(null);
                        setQuery("");
                        setDebounced("");
                      }}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
                    >
                      R?initialiser tous les filtres
                    </button>
                  ) : null}
                </div>
              </details>
            </div>
          </section>
          {/* filters */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24 space-y-4">
              <FiltersBlocks />
              {selectedGenres.length || selectedKeys.length || bpmMin !== BPM_MIN || bpmMax !== BPM_MAX || selectedTag ? (
                <button
                  onClick={() => {
                    setSelectedGenres([]);
                    setSelectedKeys([]);
                    setBpmMin(BPM_MIN);
                    setBpmMax(BPM_MAX);
                    setBpmInput(String(BPM_MIN));
                    setBpmMaxInput(String(BPM_MAX));
                    setSelectedTag(null);
                    setQuery("");
                    setDebounced("");
                  }}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
                >
                  Réinitialiser tous les filtres
                </button>
              ) : null}
            </div>
          </aside>

          {/* list + header de résultats */}
          <section className="lg:col-span-9">
            <div className="mb-3 flex items-center justify-between text-sm text-zinc-400">
              <span>{sorted.length} résultats</span>
              <div className="inline-flex items-center gap-2">
                <span className="hidden sm:inline">Vue</span>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 ${viewMode === "grid" ? "border-white/20 bg-white/10" : "border-white/10"}`}
                >
                  <Grid3X3 className="h-3.5 w-3.5" /> Grille
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 ${viewMode === "table" ? "border-white/20 bg-white/10" : "border-white/10"}`}
                >
                  <Rows3 className="h-3.5 w-3.5" /> Tableau
                </button>
              </div>
            </div>
            <AnimatePresence mode="popLayout">
              {viewMode === "grid" ? (
                <motion.div
                  key="grid"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="grid grid-cols-2 gap-4 xxs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
                >
                  {currentBeats.map((b) => (
                    <BeatCard
                      key={b.id}
                      id={b.id}
                      name={b.name}
                      artist={b.artist}
                      genre={b.genre}
                      bpm={b.bpm}
                      keySig={b.key}
                      price={b.price}
                      tag={b.tag ?? undefined}
                      isCurrent={track?.id === b.id}
                      isPlaying={isPlaying}
                      onPlayPause={() => onPlay(b)}
                      isFav={favIds.includes(String(b.id))}
                      onFav={() => onToggleFav(String(b.id))}
                      onMore={() => {}}
                    />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="table"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="overflow-x-auto sm:overflow-hidden rounded-2xl border border-white/10"
                >
                  <table className="w-full text-sm table-fixed max-sm:min-w-[720px]">
                    <thead className="bg-white/5 text-zinc-300">
                      <tr>
                        <th className="px-4 py-3 text-left w-[40%]">Titre</th>
                        <th className="px-4 py-3 w-[14%] text-center">Genre</th>
                        <th className="px-4 py-3 w-[8%]">BPM</th>
                        <th className="px-4 py-3 w-[8%]">Gamme</th>
                        <th className="px-4 py-3 text-center w-[10%]">Prix</th>
                        <th className="px-4 py-3 text-center w-[8%]">Tag</th>
                        <th className="px-4 py-3 text-center w-[20%]"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {currentBeats.map((b) => (
                        <BeatTableRow
                          key={b.id}
                          id={b.id}
                          name={b.name}
                          artist={b.artist}
                          genre={b.genre}
                          bpm={b.bpm}
                          keySig={b.key}
                      price={b.price}
                      tagIcon={b.tag === "Tendance" ? "top" : b.tag === "Nouveau" ? "new" : b.tag === "Populaire" ? "popular" : null}
                      isCurrent={track?.id === b.id}
                      isPlaying={isPlaying}
                      onPlayPause={() => onPlay(b)}
                      onAdd={() => addItem({ id: b.id, name: b.name, price: b.price })}
                      onFav={() => onToggleFav(String(b.id))}
                      onMore={() => {}}
                    />
                  ))}
                    </tbody>
                  </table>
                </motion.div>
              )}
            </AnimatePresence>

            {/* pagination */}
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                disabled={currentPage === 1}
                onClick={() => {
                  setCurrentPage((p) => Math.max(1, p - 1));
                  if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="rounded-full bg-white/5 px-3 py-1.5 text-sm hover:bg-white/10 disabled:opacity-40"
              >
                Précédent
              </button>
              <div className="text-sm text-zinc-400">
                Page {currentPage} sur {totalPages}
              </div>
              <button
                disabled={currentPage === totalPages}
                onClick={() => {
                  setCurrentPage((p) => Math.min(totalPages, p + 1));
                  if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="rounded-full bg-white/5 px-3 py-1.5 text-sm hover:bg-white/10 disabled:opacity-40"
              >
                Suivant
              </button>
            </div>
          </section>
        </div>
      </div>
      <AuthRequiredModal
        open={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={() => {
          setShowAuthModal(false);
          router.push("/web/profil?mode=login");
        }}
      />
    </div>
  );
}

export default function CataloguePage() {
  return (
    <>
      <Suspense fallback={<div className="min-h-screen bg-black text-white pt-24 px-4">Chargement…</div>}>
        <CatalogueContent />
      </Suspense>
    </>
  );
}
