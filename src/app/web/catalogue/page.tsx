"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import BeatCard from "@/components/BeatCard";
import {
  Search,
  Grid3X3,
  Rows3,
  SlidersHorizontal,
  PlayCircle,
  Plus,
  Heart,
  Music4,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { useAudio } from "@/context/AudioPlayerContext";

/* ------------------------------- Types ---------------------------------- */

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

/* -------------------------- Données / Constantes ------------------------- */

const TEST_AUDIO =
  "/audio/Woke up late, still rich from yesterday  (Remix) (Instrumental) (1).mp3"; // place un fichier ici

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

/** Génère une liste fixe au premier rendu pour éviter tout mismatch SSR/CSR */
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

/* --------------------------------- UI ----------------------------------- */

const Chip = ({
  active,
  onClick,
  children,
  className = "",
}: {
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}) => (
  <button
    onClick={onClick}
    className={`px-3 py-1.5 rounded-full border text-sm transition-colors ${
      active
        ? "bg-[#7C5CFF] border-[#7C5CFF] text-white"
        : "border-white/15 text-zinc-200 hover:bg-white/5"
    } ${className}`}
  >
    {children}
  </button>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div className="text-xs uppercase tracking-wider text-zinc-400 mb-2">
    {children}
  </div>
);

const Card = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    layout
    whileHover={{ y: -2 }}
    className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#2b233f]/60 to-[#181622]/60 p-4 shadow-xl"
  >
    {children}
  </motion.div>
);

/* ------------------------------ Page ------------------------------------ */

export default function CataloguePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // lecteur global
  const { play, isPlaying, track, setQueue } = useAudio();

  // état filtres / vue
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const [sort, setSort] = useState<(typeof SORTS)[number]>("Pertinence");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // dataset stable
  const beats = useMemo(() => generateRandomBeats(50), []);

  /* ------------------------ Debounce de la recherche ------------------------ */
  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 350);
    return () => clearTimeout(t);
  }, [query]);

  /* ------------------ Lecture des filtres depuis l'URL (mount) -------------- */
  useEffect(() => {
    if (!searchParams) return;
    const q = searchParams.get("q") ?? "";
    const g = searchParams.get("genres")?.split(",").filter(Boolean) ?? [];
    const k = searchParams.get("keys")?.split(",").filter(Boolean) ?? [];
    const tag = (searchParams.get("tag") as Tag) || null;
    const s =
      (searchParams.get("sort") as (typeof SORTS)[number]) || "Pertinence";
    const v = (searchParams.get("view") as ViewMode) || "grid";

    setQuery(q);
    setDebounced(q);
    setSelectedGenres(g);
    setSelectedKeys(k);
    setSelectedTag(tag);
    setSort(s);
    setViewMode(v);
  }, []); // pas de deps ici

  /* ------------------ Sync URL (avec garde pour éviter boucles) -------------- */
  const lastQSRef = useRef<string>("");
  useEffect(() => {
    const p = new URLSearchParams();
    if (debounced) p.set("q", debounced);
    if (selectedGenres.length) p.set("genres", selectedGenres.join(","));
    if (selectedKeys.length) p.set("keys", selectedKeys.join(","));
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
    selectedTag,
    sort,
    viewMode,
    router,
  ]);

  /* -------------------- Reset pagination si filtres changent ----------------- */
  useEffect(() => {
    setCurrentPage(1);
  }, [debounced, selectedGenres, selectedKeys, selectedTag, sort, viewMode]);

  /* ------------------------------- Filtrage --------------------------------- */
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

      return mQ && mG && mK && mT;
    });
  }, [beats, debounced, selectedGenres, selectedKeys, selectedTag]);

  /* -------------------------------- Tri ------------------------------------ */
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

  /* ----------------------------- Pagination --------------------------------- */
  const indexOfLast = currentPage * pageSize;
  const currentBeats = sorted.slice(indexOfLast - pageSize, indexOfLast);
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));

  /* --------------- Alimente la queue du lecteur sans boucle ----------------- */
  const lastQueueKey = useRef<string>("");
  useEffect(() => {
    const key = currentBeats.map((b) => b.id).join(",");
    if (key !== lastQueueKey.current) {
      lastQueueKey.current = key;
      setQueue(currentBeats);
    }
  }, [currentBeats, setQueue]);

  /* ------------------------------ Actions UI -------------------------------- */
  const toggleInArray = (
    val: string,
    arr: string[],
    set: (v: string[]) => void
  ) => set(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);

  const onPlay = (b: Beat) => play(b, currentBeats);

  /* --------------------------------- UI ------------------------------------ */

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0b0b12] to-black text-white pt-24 pb-36">
      {/* En-tête */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto w-[min(1200px,92vw)] rounded-3xl border border-white/10 bg-gradient-to-r from-[#7C5CFF]/35 to-[#b8aaff]/20 p-6 shadow-xl"
      >
        <div className="flex items-center gap-3 text-2xl font-bold">
          <Music4 className="opacity-80" />
          Catalogue
        </div>
        <div className="mt-1 text-sm text-zinc-300">
          500 résultats • 7 genres • vue {viewMode}
        </div>
      </motion.div>

      {/* Barre outils + recherche */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto mt-6 flex w-[min(1200px,92vw)] flex-col gap-4 rounded-2xl border border-white/10 bg-black/40 p-4"
      >
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={16} className="text-zinc-400" />
            <span className="text-sm text-zinc-400">Filtres rapides</span>
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
              className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm ${
                viewMode === "grid"
                  ? "border-[#7C5CFF] bg-[#7C5CFF] text-white"
                  : "border-white/15 hover:bg-white/5"
              }`}
            >
              <Grid3X3 size={16} /> Grille
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm ${
                viewMode === "table"
                  ? "border-[#7C5CFF] bg-[#7C5CFF] text-white"
                  : "border-white/15 hover:bg-white/5"
              }`}
            >
              <Rows3 size={16} /> Tableau
            </button>

            <select
              value={sort}
              onChange={(e) =>
                setSort(e.target.value as (typeof SORTS)[number])
              }
              className="rounded-full border border-white/15 bg-black/50 px-3 py-1.5 text-sm outline-none"
            >
              {SORTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Recherche */}
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
            size={18}
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tape un artiste, un genre…"
            className="w-full rounded-2xl border border-white/15 bg-black/60 pl-11 py-3"
          />
        </div>
      </motion.div>

      {/* Contenu */}
      <div className="mx-auto mt-8 grid w-[min(1200px,92vw)] grid-cols-12 gap-6">
        {/* Filtres latéraux */}
        <aside className="col-span-12 md:col-span-3">
          <Card>
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

            <div className="mt-5">
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
          </Card>
        </aside>

        {/* Liste des beats */}
        <section className="col-span-12 md:col-span-9">
          <AnimatePresence mode="popLayout">
            {viewMode === "grid" ? (
              <motion.div
                key="grid"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
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
                    tag={b.tag ?? undefined}
                    isCurrent={track?.id === b.id}
                    isPlaying={isPlaying}
                    onPlayPause={() => {
                      // Si c'est déjà le morceau courant et qu'il joue, toggle via play(b)
                      // (selon ton contexte, tu peux avoir toggle() — adapte si besoin)
                      play(b, currentBeats); // on repousse la queue pour chaîner à partir de la page
                    }}
                    onAdd={() => {
                      // TODO: ajout au panier / favoris
                      console.log("add", b.id);
                    }}
                    onFav={() => {
                      console.log("fav", b.id);
                    }}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="table"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
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
                      <tr key={b.id} className="hover:bg-white/5">
                        <td className="px-4 py-3">{b.name}</td>
                        <td className="px-4 py-3 text-zinc-300">{b.artist}</td>
                        <td className="px-4 py-3 text-center">{b.genre}</td>
                        <td className="px-4 py-3 text-center">{b.bpm}</td>
                        <td className="px-4 py-3 text-center">{b.key}</td>
                        <td className="px-4 py-3 text-right">
                          <Chip onClick={() => onPlay(b)} className="!px-3">
                            <PlayCircle size={16} className="mr-1" />{" "}
                            {track?.id === b.id && isPlaying
                              ? "Pause"
                              : "Écouter"}
                          </Chip>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pagination */}
          <div className="mt-6 flex items-center justify-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="rounded-full border border-white/15 px-3 py-1.5 text-sm text-zinc-200 disabled:opacity-40 hover:bg-white/5"
            >
              ← Précédent
            </button>
            <div className="text-sm text-zinc-400">
              Page <span className="text-white">{currentPage}</span> /{" "}
              {totalPages}
            </div>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="rounded-full border border-white/15 px-3 py-1.5 text-sm text-zinc-200 disabled:opacity-40 hover:bg-white/5"
            >
              Suivant →
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
