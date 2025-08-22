"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Grid3X3, Rows3, SlidersHorizontal } from "lucide-react";

import { Input } from "@/components/ui/input";
import { useAudio } from "@/context/AudioPlayerContext";
import BeatCard from "@/components/BeatCard";
import BeatTableRow from "@/components/BeatTableRow";

/* ------------------------------ types & data ------------------------------ */

type Tag = "Tendance" | "Nouveau" | "Populaire";
type ViewMode = "grid" | "table";

export type Beat = {
  id: number;
  name: string;
  artist: string;
  genre: string;
  bpm: number;
  key: string;
  tag: Tag | null;
  audio: string;
};

const TEST_AUDIO = "/audio/test.mp3";

const GENRES = [
  "Drill",
  "Trap",
  "Lofi",
  "Boom Bap",
  "R&B",
  "Soul",
  "West Coast",
] as const;
const KEYS = [
  "Fm",
  "Cm",
  "Gm",
  "Am",
  "Dm",
  "Bb",
  "Eb",
  "Abm",
  "C#m",
  "F#m",
] as const;
const QUICK_TAGS: Tag[] = ["Tendance", "Nouveau", "Populaire"];
const SORTS = ["Pertinence", "Nouveautés", "Populaire"] as const;

// plages de BPM
const BPM_RANGES = [
  { label: "80 - 90", min: 80, max: 90 },
  { label: "90 - 100", min: 90, max: 100 },
  { label: "100 - 110", min: 100, max: 110 },
  { label: "110 - 120", min: 110, max: 120 },
  { label: "120 - 130", min: 120, max: 130 },
  { label: "130+", min: 130, max: Infinity },
];

const generateRandomBeats = (count: number): Beat[] => {
  const artists = [
    "Metro Boomin",
    "Kendrick Lamar",
    "Drake",
    "J. Cole",
    "Nas",
    "Travis Scott",
    "The Weeknd",
  ];
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Beat ${i + 1}`,
    artist: `${artists[Math.floor(Math.random() * artists.length)]} Type Beat`,
    genre: GENRES[Math.floor(Math.random() * GENRES.length)],
    bpm: 80 + Math.floor(Math.random() * 80),
    key: KEYS[Math.floor(Math.random() * KEYS.length)],
    tag: QUICK_TAGS[Math.floor(Math.random() * QUICK_TAGS.length)] ?? null,
    audio: TEST_AUDIO,
  }));
};

/* -------------------------------- helpers -------------------------------- */

const Chip = ({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center rounded-full border px-3 py-1.5 text-sm transition-colors
      ${
        active
          ? "border-indigo-500/70 bg-indigo-500 text-white"
          : "border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10"
      }`}
  >
    {children}
  </button>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-2 text-xs font-medium uppercase tracking-wider text-zinc-400">
    {children}
  </div>
);

/* ---------------------------------- page --------------------------------- */

export default function CataloguePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { play, toggle, isPlaying, track, setQueue } = useAudio();

  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");

  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const [selectedBpmRanges, setSelectedBpmRanges] = useState<string[]>([]);
  const [sort, setSort] = useState<(typeof SORTS)[number]>("Pertinence");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  const beats = useMemo(() => generateRandomBeats(96), []);

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
    const bpm = searchParams.get("bpms")?.split(",").filter(Boolean) ?? [];
    const tag = (searchParams.get("tag") as Tag) || null;
    const s =
      (searchParams.get("sort") as (typeof SORTS)[number]) || "Pertinence";
    const v = (searchParams.get("view") as ViewMode) || "grid";

    setQuery(q);
    setDebounced(q);
    setSelectedGenres(g);
    setSelectedKeys(k);
    setSelectedBpmRanges(bpm);
    setSelectedTag(tag);
    setSort(s);
    setViewMode(v);
  }, []); // mount only

  /* sync URL */
  const lastQSRef = useRef("");
  useEffect(() => {
    const p = new URLSearchParams();
    if (debounced) p.set("q", debounced);
    if (selectedGenres.length) p.set("genres", selectedGenres.join(","));
    if (selectedKeys.length) p.set("keys", selectedKeys.join(","));
    if (selectedBpmRanges.length) p.set("bpms", selectedBpmRanges.join(","));
    if (selectedTag) p.set("tag", selectedTag);
    p.set("sort", sort);
    p.set("view", viewMode);
    const qs = p.toString();
    if (qs !== lastQSRef.current) {
      lastQSRef.current = qs;
      router.replace(qs ? `?${qs}` : "?", { scroll: false });
    }
  }, [
    debounced,
    selectedGenres,
    selectedKeys,
    selectedBpmRanges,
    selectedTag,
    sort,
    viewMode,
    router,
  ]);

  /* reset page on filter change */
  useEffect(
    () => setCurrentPage(1),
    [
      debounced,
      selectedGenres,
      selectedKeys,
      selectedBpmRanges,
      selectedTag,
      sort,
      viewMode,
    ]
  );

  /* filtering */
  const filtered = useMemo(() => {
    return beats.filter((b) => {
      const mQ =
        !debounced ||
        b.name.toLowerCase().includes(debounced.toLowerCase()) ||
        b.artist.toLowerCase().includes(debounced.toLowerCase()) ||
        b.genre.toLowerCase().includes(debounced.toLowerCase());
      const mG = selectedGenres.length
        ? selectedGenres.includes(b.genre)
        : true;
      const mK = selectedKeys.length ? selectedKeys.includes(b.key) : true;
      const mT = selectedTag ? b.tag === selectedTag : true;
      const mB =
        selectedBpmRanges.length > 0
          ? BPM_RANGES.some(
              (r) =>
                selectedBpmRanges.includes(r.label) &&
                b.bpm >= r.min &&
                b.bpm < r.max
            )
          : true;
      return mQ && mG && mK && mT && mB;
    });
  }, [
    beats,
    debounced,
    selectedGenres,
    selectedKeys,
    selectedTag,
    selectedBpmRanges,
  ]);

  /* sort */
  const sorted = useMemo(() => {
    switch (sort) {
      case "Nouveautés":
        return [...filtered].reverse();
      case "Populaire":
        return [...filtered].sort((a, b) => (a.tag === "Populaire" ? -1 : 1));
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

  const toggleInArray = (
    val: string,
    arr: string[],
    set: (v: string[]) => void
  ) => set(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);

  const onPlay = (b: Beat) =>
    track?.id === b.id && isPlaying ? toggle() : play(b, currentBeats);

  /* --------------------------------- render -------------------------------- */

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0b0b12] to-black text-white pt-24 pb-40">
      {/* header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8"
      >
        <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-indigo-600/30 to-indigo-300/20 p-6 shadow-xl">
          <div className="text-2xl font-bold">Catalogue</div>
          <div className="mt-1 text-sm text-zinc-300">
            {sorted.length} résultats • {GENRES.length} genres • vue {viewMode}
          </div>
        </div>

        {/* tools */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-black/40 p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 text-sm text-zinc-400">
              <SlidersHorizontal className="h-4 w-4" />
              Filtres rapides
            </div>
            <div className="flex flex-wrap gap-2">
              {QUICK_TAGS.map((t) => (
                <Chip
                  key={t}
                  active={selectedTag === t}
                  onClick={() => setSelectedTag(selectedTag === t ? null : t)}
                >
                  {t}
                </Chip>
              ))}
            </div>

            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm
                  ${
                    viewMode === "grid"
                      ? "border-indigo-500 bg-indigo-500 text-white"
                      : "border-white/10 bg-white/5 hover:bg-white/10"
                  }`}
              >
                <Grid3X3 className="h-4 w-4" /> Grille
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm
                  ${
                    viewMode === "table"
                      ? "border-indigo-500 bg-indigo-500 text-white"
                      : "border-white/10 bg-white/5 hover:bg-white/10"
                  }`}
              >
                <Rows3 className="h-4 w-4" /> Tableau
              </button>

              <select
                value={sort}
                onChange={(e) =>
                  setSort(e.target.value as (typeof SORTS)[number])
                }
                className="rounded-full border border-white/10 bg-black/50 px-3 py-1.5 text-sm outline-none"
              >
                {SORTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* search */}
          <div className="relative mt-4">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tape un artiste, un genre…"
              className="w-full rounded-2xl border border-white/10 bg-black/60 pl-11 py-3"
            />
          </div>
        </div>
      </motion.div>

      {/* content */}
      <div className="container mx-auto mt-8 max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* filters */}
          <aside className="lg:col-span-3">
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#241e33]/50 to-[#161522]/50 p-4">
              <SectionTitle>Genres</SectionTitle>
              <div className="flex flex-wrap gap-2">
                {GENRES.map((g) => (
                  <Chip
                    key={g}
                    active={selectedGenres.includes(g)}
                    onClick={() =>
                      toggleInArray(g, selectedGenres, setSelectedGenres)
                    }
                  >
                    {g}
                  </Chip>
                ))}
              </div>

              <div className="mt-6">
                <SectionTitle>Tonalités</SectionTitle>
                <div className="flex flex-wrap gap-2">
                  {KEYS.map((k) => (
                    <Chip
                      key={k}
                      active={selectedKeys.includes(k)}
                      onClick={() =>
                        toggleInArray(k, selectedKeys, setSelectedKeys)
                      }
                    >
                      {k}
                    </Chip>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <SectionTitle>BPM</SectionTitle>
                <div className="flex flex-wrap gap-2">
                  {BPM_RANGES.map((r) => (
                    <Chip
                      key={r.label}
                      active={selectedBpmRanges.includes(r.label)}
                      onClick={() =>
                        toggleInArray(
                          r.label,
                          selectedBpmRanges,
                          setSelectedBpmRanges
                        )
                      }
                    >
                      {r.label}
                    </Chip>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* list */}
          <section className="lg:col-span-9">
            <AnimatePresence mode="popLayout">
              {viewMode === "grid" ? (
                <motion.div
                  key="grid"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
                >
                  {currentBeats.map((b) => (
                    <BeatCard
                      key={b.id}
                      name={b.name}
                      artist={b.artist}
                      genre={b.genre}
                      bpm={b.bpm}
                      keySig={b.key}
                      tag={b.tag ?? undefined}
                      isCurrent={track?.id === b.id}
                      isPlaying={isPlaying}
                      onPlayPause={() => onPlay(b)}
                      onAdd={() => {}}
                      onFav={() => {}}
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
                  className="overflow-hidden rounded-2xl border border-white/10"
                >
                  <table className="w-full text-sm">
                    <thead className="bg-white/5 text-zinc-300">
                      <tr>
                        <th className="px-4 py-3 text-left">Titre</th>
                        <th className="px-4 py-3 text-left">Artiste</th>
                        <th className="px-4 py-3">Genre</th>
                        <th className="px-4 py-3">BPM</th>
                        <th className="px-4 py-3">Key</th>
                        <th className="px-4 py-3"></th>
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
                          isCurrent={track?.id === b.id}
                          isPlaying={isPlaying}
                          onPlayPause={() => onPlay(b)}
                          onAdd={() => {}}
                          onFav={() => {}}
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
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="rounded-full bg-white/5 px-3 py-1.5 text-sm hover:bg-white/10 disabled:opacity-40"
              >
                Précédent
              </button>
              <div className="text-sm text-zinc-400">
                Page {currentPage} sur {totalPages}
              </div>
              <button
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                className="rounded-full bg-white/5 px-3 py-1.5 text-sm hover:bg-white/10 disabled:opacity-40"
              >
                Suivant
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
